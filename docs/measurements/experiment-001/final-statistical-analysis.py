#!/usr/bin/env python3
"""Descriptive statistics for the completed Experiment 001 dataset.

Reads stored Lighthouse, Network, and Performance artifacts. Does not modify
raw files, impute missing milestones, or drop samples.
"""

from __future__ import annotations

import csv
import json
import math
import re
import statistics
from collections import defaultdict
from datetime import datetime
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent
OUT_MD = ROOT / "final-statistical-analysis.md"
OUT_JSON = ROOT / "final-statistical-analysis.json"
OUT_CSV = ROOT / "final-statistical-analysis.csv"

PROFILES = ("Mobile", "Desktop")
VARIANTS = ("V1", "V2", "V3", "V3B")
PROFILE_DIR = {"Mobile": "profile-m", "Desktop": "profile-d"}
VARIANT_DIR = {"V1": "v1", "V2": "v2", "V3": "v3", "V3B": "v3b"}


def round_half_up(value: float, places: int) -> Decimal:
    quant = Decimal("1").scaleb(-places)
    return Decimal(f"{value:.12f}").quantize(quant, rounding=ROUND_HALF_UP)


def fmt_num(value: float, unit: str) -> str:
    if unit == "ms":
        return f"{round_half_up(value, 1)}"
    if unit == "score":
        return f"{round_half_up(value, 1)}"
    if unit == "cls":
        return f"{round_half_up(value, 4)}"
    if unit == "count":
        rounded = round_half_up(value, 1)
        if rounded == rounded.to_integral():
            return f"{int(rounded)}"
        return f"{rounded}"
    if unit == "bytes":
        rounded = round_half_up(value, 1)
        if rounded == rounded.to_integral():
            return f"{int(rounded):,}"
        whole, frac = f"{rounded}".split(".")
        return f"{int(whole):,}.{frac}"
    if unit == "pct":
        return f"{round_half_up(value, 1)}"
    raise ValueError(unit)


def parse_iso(value: str) -> datetime:
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def describe(values: list[float]) -> dict:
    ordered = sorted(values)
    n = len(ordered)
    q1, q2, q3 = statistics.quantiles(ordered, n=4, method="inclusive")
    median = statistics.median(ordered)
    if abs(q2 - median) > 1e-6:
        raise SystemExit(f"quartile median mismatch {q2} vs {median}")
    iqr = q3 - q1
    mean = statistics.fmean(ordered)
    sd = statistics.stdev(ordered) if n >= 2 else 0.0
    return {
        "n": n,
        "median": median,
        "q1": q1,
        "q3": q3,
        "iqr": iqr,
        "min": ordered[0],
        "max": ordered[-1],
        "sd": sd,
        "mean": mean,
    }


def sample_identity(path: Path) -> tuple[str, str, str, int]:
    stem = path.stem.strip()
    match = re.fullmatch(r"([MD])-(LH|NW|PF)-(V1|V2|V3|V3B)-(\d{2})", stem)
    if not match:
        raise SystemExit(f"unrecognized sample name: {path.name}")
    profile = "Mobile" if match.group(1) == "M" else "Desktop"
    variant = match.group(3)
    index = int(match.group(4))
    return profile, variant, stem, index


def load_lighthouse(path: Path) -> dict:
    data = json.loads(path.read_text())
    audits = data["audits"]
    score = data["categories"]["performance"]["score"]
    if score is None:
        raise SystemExit(f"missing performance score: {path.name}")

    def numeric(audit_id: str) -> float:
        value = audits[audit_id].get("numericValue")
        if not isinstance(value, (int, float)):
            raise SystemExit(f"missing {audit_id} in {path.name}")
        return float(value)

    inp = audits.get("interaction-to-next-paint")
    inp_numeric = None
    if isinstance(inp, dict) and isinstance(inp.get("numericValue"), (int, float)):
        inp_numeric = float(inp["numericValue"])
    lcp_element_audit = audits.get("largest-contentful-paint-element")
    screen = data.get("configSettings", {}).get("screenEmulation") or {}
    final_url = data.get("finalUrl") or ""
    query = urlparse(final_url).query
    return {
        "performance_score": float(score) * 100.0,
        "fcp_ms": numeric("first-contentful-paint"),
        "lcp_ms": numeric("largest-contentful-paint"),
        "speed_index_ms": numeric("speed-index"),
        "tbt_ms": numeric("total-blocking-time"),
        "cls": numeric("cumulative-layout-shift"),
        "tti_ms": numeric("interactive"),
        "inp_numeric": inp_numeric,
        "lcp_element_present": lcp_element_audit is not None,
        "final_url": final_url,
        "origin": urlparse(final_url).netloc,
        "variant_query": query,
        "form_factor": data.get("configSettings", {}).get("formFactor"),
        "screen_disabled": bool(screen.get("disabled")),
        "screen_width": screen.get("width"),
        "screen_height": screen.get("height"),
        "screen_dsf": screen.get("deviceScaleFactor"),
        "lighthouse_version": data.get("lighthouseVersion"),
        "run_warnings": list(data.get("runWarnings") or []),
    }


def load_har(path: Path) -> dict:
    data = json.loads(path.read_text())
    log = data["log"]
    pages = log["pages"]
    if len(pages) != 1:
        raise SystemExit(f"{path.name} has {len(pages)} pages")
    page = pages[0]
    page_start = parse_iso(page["startedDateTime"])
    timings = page.get("pageTimings") or {}
    entries = log["entries"]
    urls = []
    transferred = 0
    resource = 0
    unknown_body = 0
    documents = []
    kinds = defaultdict(int)
    for entry in entries:
        url = entry["request"]["url"]
        urls.append(url)
        body = entry["response"].get("bodySize")
        headers = entry["response"].get("headersSize")
        if isinstance(body, (int, float)) and isinstance(headers, (int, float)) and body >= 0 and headers >= 0:
            transferred += body + headers
        else:
            unknown_body += 1
        size = (entry["response"].get("content") or {}).get("size")
        if isinstance(size, (int, float)) and size >= 0:
            resource += size
        path_only = urlparse(url).path
        if path_only.startswith("/experiments/experiment-001"):
            kind = "document"
        elif path_only.startswith("/assets/"):
            kind = "asset"
        elif path_only.endswith("/favicon.svg"):
            kind = "favicon"
        else:
            kind = "other"
        kinds[kind] += 1
        if kind == "document":
            started = parse_iso(entry["startedDateTime"])
            start_ms = (started - page_start).total_seconds() * 1000.0
            duration = float(entry["time"])
            documents.append((start_ms, duration, url))
    if len(documents) != 1:
        raise SystemExit(f"{path.name} has {len(documents)} document entries")
    start_ms, duration, doc_url = documents[0]
    counts = defaultdict(int)
    for url in urls:
        counts[url] += 1
    duplicate_urls = sum(1 for count in counts.values() if count > 1)
    return {
        "request_count": len(entries),
        "static_asset_count": kinds["asset"] + kinds["favicon"],
        "other_url_count": kinds["other"],
        "duplicate_url_count": duplicate_urls,
        "transferred_bytes": float(transferred),
        "resource_bytes": float(resource),
        "unknown_body_size": unknown_body,
        "document_start_ms": start_ms,
        "document_duration_ms": duration,
        "document_end_ms": start_ms + duration,
        "dcl_ms": float(timings["onContentLoad"]),
        "load_ms": float(timings["onLoad"]),
        "origin": urlparse(doc_url).netloc,
        "document_url": doc_url,
    }


def load_notes(path: Path) -> dict | None:
    if not path.exists():
        return None
    text = path.read_text()
    marks = {}
    for match in re.finditer(r"^\s+- ([A-F]): ([0-9.eE+-]+)\s*$", text, re.M):
        marks[match.group(1)] = float(match.group(2))
    if set(marks) != set("ABCDEF"):
        raise SystemExit(f"incomplete milestones in {path.name}: {sorted(marks)}")
    rpc_match = re.search(r"Server Function RPC count:\s*(\d+)", text)
    dup_match = re.search(r"Duplicate Server Function URLs:\s*(.+)", text)
    return {
        "milestones_ms": marks,
        "rpc_count_notes": int(rpc_match.group(1)) if rpc_match else None,
        "duplicate_sf_notes": dup_match.group(1).strip() if dup_match else None,
    }


def load_performance(path: Path) -> dict:
    data = json.loads(path.read_text())
    events = data["traceEvents"]
    navs = [
        event
        for event in events
        if event.get("name") == "navigationStart"
        and "experiment-001"
        in str(((event.get("args") or {}).get("data") or {}).get("documentLoaderURL", ""))
    ]
    if len(navs) != 1:
        raise SystemExit(f"{path.name} experiment navigationStart count {len(navs)}")
    nav = navs[0]
    nav_ts = nav["ts"]
    frame = nav["args"]["frame"]
    nav_id = nav["args"]["data"]["navigationId"]

    def rel(event: dict) -> float:
        return (event["ts"] - nav_ts) / 1000.0

    def frame_of(event: dict):
        args = event.get("args") or {}
        return args.get("frame") or (args.get("data") or {}).get("frame")

    fcp_events = [
        event
        for event in events
        if event.get("name") == "firstContentfulPaint"
        and ((event.get("args") or {}).get("data") or {}).get("navigationId") == nav_id
    ]
    lcp_events = [
        event
        for event in events
        if event.get("name") == "largestContentfulPaint::Candidate"
        and ((event.get("args") or {}).get("data") or {}).get("navigationId") == nav_id
    ]
    if len(fcp_events) != 1 or len(lcp_events) < 1:
        raise SystemExit(f"{path.name} FCP {len(fcp_events)} LCP {len(lcp_events)}")
    lcp_event = max(lcp_events, key=lambda event: event["ts"])

    dcl_starts = [
        event
        for event in events
        if event.get("name") == "domContentLoadedEventStart"
        and frame_of(event) == frame
        and event["ts"] >= nav_ts
    ]
    marks_dcl = [
        event
        for event in events
        if event.get("name") == "MarkDOMContent"
        and frame_of(event) == frame
        and event["ts"] >= nav_ts
    ]
    load_starts = [
        event
        for event in events
        if event.get("name") == "loadEventStart" and frame_of(event) == frame and event["ts"] >= nav_ts
    ]
    load_ends = [
        event
        for event in events
        if event.get("name") == "loadEventEnd" and frame_of(event) == frame and event["ts"] >= nav_ts
    ]
    if len(marks_dcl) != 1 or not dcl_starts or len(load_starts) != 1 or len(load_ends) != 1:
        raise SystemExit(
            f"{path.name} DCL starts {len(dcl_starts)} marks {len(marks_dcl)} "
            f"load start {len(load_starts)} load end {len(load_ends)}"
        )
    mark_ts = marks_dcl[0]["ts"]
    paired = [event for event in dcl_starts if event["ts"] <= mark_ts]
    if not paired:
        raise SystemExit(f"{path.name} has no DCL start at or before MarkDOMContent")
    document_dcl = max(paired, key=lambda event: event["ts"])
    early = [event for event in dcl_starts if event is not document_dcl]

    milestones = defaultdict(list)
    for event in events:
        name = event.get("name") or ""
        if name.startswith("exp-milestone-"):
            milestones[name[-1]].append(float(event["args"]["data"]["startTime"]))
    if set(milestones) != set("ABCDEF") or any(len(milestones[key]) != 1 for key in "ABCDEF"):
        raise SystemExit(f"{path.name} milestone counts { {k: len(v) for k, v in milestones.items()} }")

    metadata = data.get("metadata") or {}
    return {
        "source": metadata.get("source"),
        "fcp_ms": rel(fcp_events[0]),
        "lcp_ms": rel(lcp_event),
        "lcp_node": ((lcp_event.get("args") or {}).get("data") or {}).get("nodeName"),
        "dcl_ms": rel(document_dcl),
        "dcl_mark_ms": rel(marks_dcl[0]),
        "dcl_early_ms": rel(early[0]) if len(early) == 1 else (None if not early else "multiple"),
        "load_event_start_ms": rel(load_starts[0]),
        "load_event_end_ms": rel(load_ends[0]),
        "milestones_ms": {key: milestones[key][0] for key in "ABCDEF"},
        "navigation_url": nav["args"]["data"].get("documentLoaderURL"),
    }


LH_METRICS = [
    ("performance_score", "Performance score", "score", "primary"),
    ("fcp_ms", "FCP (ms)", "ms", "primary"),
    ("lcp_ms", "LCP (ms)", "ms", "primary"),
    ("speed_index_ms", "Speed Index (ms)", "ms", "primary"),
    ("tbt_ms", "TBT (ms)", "ms", "secondary"),
    ("cls", "CLS", "cls", "primary"),
    ("tti_ms", "TTI (ms)", "ms", "informational"),
]
NW_METRICS = [
    ("request_count", "Request count", "count", "primary"),
    ("static_asset_count", "Static asset count", "count", "primary"),
    ("duplicate_url_count", "Duplicate URL count", "count", "primary"),
    ("rpc_count", "Browser-visible Server Function RPC count", "count", "primary"),
    ("transferred_bytes", "Transferred bytes", "bytes", "supplementary"),
    ("resource_bytes", "Resource bytes", "bytes", "supplementary"),
    ("document_start_ms", "Document request start (ms)", "ms", "primary"),
    ("document_duration_ms", "Document duration (ms)", "ms", "primary"),
    ("document_end_ms", "Document response end (ms)", "ms", "primary"),
    ("dcl_ms", "DOMContentLoaded (ms)", "ms", "primary"),
    ("load_ms", "Load (ms)", "ms", "primary"),
]
MILESTONE_METRICS = [
    ("A", "Milestone A (ms)", "ms", "primary"),
    ("B", "Milestone B (ms)", "ms", "primary"),
    ("C", "Milestone C (ms)", "ms", "primary"),
    ("D", "Milestone D (ms)", "ms", "primary"),
    ("E", "Milestone E (ms)", "ms", "primary"),
    ("F", "Milestone F (ms)", "ms", "primary"),
]
PF_METRICS = [
    ("fcp_ms", "Trace FCP (ms)", "ms", "diagnostic"),
    ("lcp_ms", "Trace LCP (ms)", "ms", "diagnostic"),
    ("dcl_ms", "Trace DOMContentLoaded (ms)", "ms", "diagnostic"),
    ("load_event_end_ms", "Trace load event end (ms)", "ms", "diagnostic"),
] + [(letter, f"Trace milestone {letter} (ms)", "ms", "diagnostic") for letter in "ABCDEF"]


def group_values(samples: list[dict], family: str, key: str, require_notes: bool = False) -> dict:
    grouped = {}
    for profile in PROFILES:
        for variant in VARIANTS:
            chosen = []
            for sample in samples:
                if sample["family"] != family or sample["profile"] != profile or sample["variant"] != variant:
                    continue
                if require_notes and not sample.get("notes_stored"):
                    continue
                value = sample["metrics"].get(key)
                if value is None:
                    continue
                chosen.append(value)
            grouped[(profile, variant)] = chosen
    return grouped


def stats_rows(samples: list[dict], family: str, metrics: list[tuple], require_notes: bool = False) -> list[dict]:
    rows = []
    for key, label, unit, role in metrics:
        grouped = group_values(samples, family, key, require_notes=require_notes)
        for profile in PROFILES:
            for variant in VARIANTS:
                values = grouped[(profile, variant)]
                if not values:
                    continue
                stats = describe(values)
                rows.append(
                    {
                        "family": family,
                        "profile": profile,
                        "variant": variant,
                        "metric_key": key,
                        "metric": label,
                        "unit": unit,
                        "role": role,
                        **stats,
                    }
                )
    return rows


def lookup(rows: list[dict], profile: str, variant: str, metric: str) -> dict:
    for row in rows:
        if row["profile"] == profile and row["variant"] == variant and row["metric"] == metric:
            return row
    raise KeyError((profile, variant, metric))


def comparison_rows(rows: list[dict], metrics: list[str]) -> list[dict]:
    output = []
    for profile in PROFILES:
        for metric in metrics:
            v3b = lookup(rows, profile, "V3B", metric)
            v3 = lookup(rows, profile, "V3", metric)
            delta = v3b["median"] - v3["median"]
            if abs(v3["median"]) < 1e-12:
                relative = None
            else:
                relative = (delta / v3["median"]) * 100.0
            output.append(
                {
                    "profile": profile,
                    "metric": metric,
                    "unit": v3b["unit"],
                    "role": v3b["role"],
                    "n_v3b": v3b["n"],
                    "n_v3": v3["n"],
                    "median_v3b": v3b["median"],
                    "median_v3": v3["median"],
                    "delta": delta,
                    "relative_change_pct": relative,
                }
            )
    return output


def tukey_flags(samples: list[dict], rows: list[dict]) -> list[dict]:
    flags = []
    index = {(row["family"], row["profile"], row["variant"], row["metric_key"]): row for row in rows}
    for sample in samples:
        for row in rows:
            if row["family"] != sample["family"] or row["profile"] != sample["profile"] or row["variant"] != sample["variant"]:
                continue
            if sample["family"] == "network-milestone" and not sample.get("notes_stored"):
                continue
            value = sample["metrics"].get(row["metric_key"])
            if value is None:
                continue
            stats = index[(row["family"], row["profile"], row["variant"], row["metric_key"])]
            iqr = stats["iqr"]
            if abs(iqr) <= 1e-9:
                flagged = abs(value - stats["median"]) > 1e-6
                reason = "IQR is 0 and the value differs from the group median"
            else:
                low = stats["q1"] - 1.5 * iqr
                high = stats["q3"] + 1.5 * iqr
                flagged = value < low or value > high
                reason = "outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR)"
            if not flagged:
                continue
            if abs(stats["median"]) < 1e-12:
                deviation = None
            else:
                deviation = ((value - stats["median"]) / stats["median"]) * 100.0
            flags.append(
                {
                    "sample_id": sample["sample_id"],
                    "profile": sample["profile"],
                    "variant": sample["variant"],
                    "family": sample["family"],
                    "metric": row["metric"],
                    "unit": row["unit"],
                    "observed": value,
                    "median": stats["median"],
                    "deviation_pct": deviation,
                    "reason": reason,
                }
            )
    return flags


def md_table(headers: list[str], records: list[list[str]]) -> str:
    lines = [
        "| " + " | ".join(headers) + " |",
        "| " + " | ".join(["---"] + ["---:"] * (len(headers) - 1)) + " |",
    ]
    for record in records:
        lines.append("| " + " | ".join(record) + " |")
    return "\n".join(lines)


def stat_table(rows: list[dict], metric: str) -> str:
    chosen = [row for row in rows if row["metric"] == metric]
    records = []
    for row in chosen:
        records.append(
            [
                row["profile"],
                row["variant"],
                row["metric"],
                str(row["n"]),
                fmt_num(row["median"], row["unit"]),
                fmt_num(row["q1"], row["unit"]),
                fmt_num(row["q3"], row["unit"]),
                fmt_num(row["iqr"], row["unit"]),
                fmt_num(row["min"], row["unit"]),
                fmt_num(row["max"], row["unit"]),
                fmt_num(row["sd"], row["unit"]),
                fmt_num(row["mean"], row["unit"]),
            ]
        )
    return md_table(
        ["Profile", "Variant", "Metric", "n", "Median", "Q1", "Q3", "IQR", "Min", "Max", "SD", "Mean"],
        records,
    )


def comparison_table(rows: list[dict], profile: str) -> str:
    records = []
    for row in rows:
        if row["profile"] != profile:
            continue
        relative = "not defined" if row["relative_change_pct"] is None else fmt_num(row["relative_change_pct"], "pct")
        records.append(
            [
                row["metric"],
                f"{row['n_v3b']}/{row['n_v3']}",
                fmt_num(row["median_v3b"], row["unit"]),
                fmt_num(row["median_v3"], row["unit"]),
                fmt_num(row["delta"], row["unit"]),
                relative,
            ]
        )
    return md_table(
        ["Metric", "n (V3B/V3)", "V3B median", "V3 median", "Δ median", "Relative change (%)"],
        records,
    )


def collect_samples() -> list[dict]:
    samples = []
    for path in sorted(ROOT.rglob("*")):
        if not path.is_file():
            continue
        if path.parent.name not in {"lighthouse", "network", "performance"}:
            continue
        if path.suffix.lower() not in {".json", ".har"}:
            continue
        profile, variant, sample_id, index = sample_identity(path)
        if path.parent.name == "lighthouse" and path.suffix.lower() == ".json":
            metrics = load_lighthouse(path)
            samples.append(
                {
                    "family": "lighthouse",
                    "profile": profile,
                    "variant": variant,
                    "sample_id": sample_id,
                    "index": index,
                    "path": str(path.relative_to(ROOT)),
                    "metrics": metrics,
                }
            )
        elif path.parent.name == "network" and path.suffix.lower() == ".har":
            har = load_har(path)
            notes_path = path.with_suffix(".notes.md")
            notes = load_notes(notes_path)
            metrics = dict(har)
            if notes:
                metrics["rpc_count"] = float(notes["rpc_count_notes"])
                for letter, value in notes["milestones_ms"].items():
                    metrics[letter] = value
                metrics["duplicate_sf_notes"] = notes["duplicate_sf_notes"]
            else:
                metrics["rpc_count"] = 0.0 if har["other_url_count"] == 0 else None
            samples.append(
                {
                    "family": "network",
                    "profile": profile,
                    "variant": variant,
                    "sample_id": sample_id,
                    "index": index,
                    "path": str(path.relative_to(ROOT)),
                    "notes_stored": notes is not None,
                    "metrics": metrics,
                }
            )
        elif path.parent.name == "performance" and path.suffix.lower() == ".json":
            parsed = load_performance(path)
            metrics = {
                "fcp_ms": parsed["fcp_ms"],
                "lcp_ms": parsed["lcp_ms"],
                "dcl_ms": parsed["dcl_ms"],
                "load_event_end_ms": parsed["load_event_end_ms"],
                "load_event_start_ms": parsed["load_event_start_ms"],
                "dcl_early_ms": parsed["dcl_early_ms"] if isinstance(parsed["dcl_early_ms"], float) else None,
                "dcl_mark_ms": parsed["dcl_mark_ms"],
            }
            metrics.update(parsed["milestones_ms"])
            samples.append(
                {
                    "family": "performance",
                    "profile": profile,
                    "variant": variant,
                    "sample_id": sample_id,
                    "index": index,
                    "path": str(path.relative_to(ROOT)),
                    "source": parsed["source"],
                    "metrics": metrics,
                    "lcp_node": parsed["lcp_node"],
                    "navigation_url": parsed["navigation_url"],
                }
            )
    network_samples = [sample for sample in samples if sample["family"] == "network"]
    for sample in network_samples:
        milestone_copy = {
            "family": "network-milestone",
            "profile": sample["profile"],
            "variant": sample["variant"],
            "sample_id": sample["sample_id"],
            "index": sample["index"],
            "path": sample["path"],
            "notes_stored": sample["notes_stored"],
            "metrics": {letter: sample["metrics"].get(letter) for letter in "ABCDEF"},
        }
        samples.append(milestone_copy)
    return samples


def render_metric_sections(title_prefix: str, rows: list[dict], metrics: list[tuple]) -> str:
    parts = []
    for _key, label, _unit, role in metrics:
        parts.append(f"#### {label}")
        parts.append("")
        parts.append(f"Role: {role}.")
        parts.append("")
        parts.append(stat_table(rows, label))
        parts.append("")
    return "\n".join(parts)


def build_report(payload: dict) -> str:
    lh_rows = payload["lighthouse_rows"]
    nw_rows = payload["network_rows"]
    ms_rows = payload["milestone_rows"]
    pf_rows = payload["performance_rows"]
    flags = payload["flags"]
    clock_metrics = {"Document request start (ms)", "TTI (ms)"}
    substantive_large = [
        flag
        for flag in flags
        if flag["metric"] not in clock_metrics
        and flag["deviation_pct"] is not None
        and abs(flag["deviation_pct"]) >= 10.0
    ]
    audit_series_flags = [
        flag
        for flag in flags
        if flag["metric"] not in {"TTI (ms)", "Document request start (ms)", "Document response end (ms)"}
    ]
    flagged_ids = sorted({flag["sample_id"] for flag in flags})

    def row(profile, variant, metric, source):
        return lookup(source, profile, variant, metric)

    lines = []
    a = lines.append
    a("# Experiment 001 — Final statistical analysis")
    a("")
    a("Processing date: 2026-09-30.")
    a("")
    a("This report is the descriptive numerical basis for thesis Chapter 4.4 and 4.5. It is not the thesis chapter. It does not rerun measurements, change raw artifacts, remove samples, test hypotheses, calculate p-values, or rank variants.")
    a("")
    a("## 1. Scope and dataset")
    a("")
    a("Source tree: `docs/measurements/experiment-001/`.")
    a("")
    a("Processed artifacts:")
    a("")
    a("- 80 Lighthouse JSON files, including `profile-d/variant-v1/lighthouse/D-LH-V1-01 .json` (space before the extension). HTML companions were not used as a second sample.")
    a("- 80 Network HAR files. User Timing milestones were read only from the paired `.notes.md` files.")
    a("- 24 Performance trace JSON files.")
    a("")
    a(f"Sample files parsed: **{payload['counts']['files']}**. Expected: **184**. Parse failures: **{payload['counts']['failures']}**.")
    a("")
    a("Each tool remains its own series of navigations. A shared sample index does not mean a shared page load.")
    a("")
    a("Metric roles follow protocol sections 10 and 13.6:")
    a("")
    a("- Primary quantitative evidence: Lighthouse and Network, including Network User Timing milestones.")
    a("- Secondary Lighthouse metric: TBT.")
    a("- Informational Lighthouse metric: TTI.")
    a("- Diagnostic evidence: Performance traces, n=3, with the capture-method caveat in `performance-capture-method-audit.md`.")
    a("- Supplementary network size: transferred bytes and resource bytes.")
    a("")
    a("## 2. Sample counts")
    a("")
    a("| Profile | Variant | Lighthouse n | Network HAR n | Network milestone n | Performance n |")
    a("| --- | --- | ---: | ---: | ---: | ---: |")
    for profile in PROFILES:
        for variant in VARIANTS:
            a(
                f"| {profile} | {variant} | 10 | 10 | 9 | 3 |"
            )
    a("| **Total** |  | **80** | **80** | **72** | **24** |")
    a("")
    a("Lighthouse and Network HAR groups keep n=10, including every index-01 sample. Network milestones use the 72 stored notes (n=9 per profile × variant). The eight index-01 notes are absent, so those eight milestone values are not in the milestone tables. The eight HAR files remain in every HAR statistic. Performance keeps n=3 per profile × variant.")
    a("")
    a("Notes absent:")
    a("")
    for sample_id in payload["missing_notes"]:
        a(f"- `{sample_id}`")
    a("")
    a("## 3. Statistical methodology")
    a("")
    a("For each profile × variant × metric, the statistics are n, median, Q1, Q3, IQR, minimum, maximum, sample standard deviation, and mean. The median is the primary summary. The mean is auxiliary.")
    a("")
    a("Quartiles use the inclusive linear method (`statistics.quantiles`, `n=4`, `method=\"inclusive\"`): the position is `1 + (n − 1) p` on the sorted sample, with linear interpolation. IQR is Q3 − Q1. The median is the ordinary sample median, which matches the 50% inclusive quartile. The standard deviation uses divisor n − 1.")
    a("")
    a("Presentation rounding is half-up and is applied only after the statistic is computed. Milliseconds and scores are shown to 1 decimal place. CLS is shown to 4 decimal places. Relative change is shown to 1 decimal place. The JSON export keeps the unrounded values.")
    a("")
    a("No sample was removed, winsorized, or replaced. Tukey fences are reported in section 9 as flags only. A flag is a value outside Q1 − 1.5 IQR and Q3 + 1.5 IQR. When IQR is 0, any value that differs from the group median is flagged. Flagged observations stay inside n.")
    a("")
    a("V3B versus V3, for each profile separately:")
    a("")
    a("- Δ median = V3B median − V3 median")
    a("- Relative change (%) = (Δ median / V3 median) × 100")
    a("- A negative relative change is a lower measured value for V3B.")
    a("- When the V3 median is 0, relative change is not defined.")
    a("")
    a("Field definitions used in this processing:")
    a("")
    a("- Lighthouse performance score: `categories.performance.score × 100`.")
    a("- Lighthouse FCP, LCP, Speed Index, TBT, CLS, and TTI: audit `numericValue` in milliseconds, except CLS, which is unitless.")
    a("- INP: numeric audit value present in 0 of 80 files.")
    a("- Lighthouse LCP element: `largest-contentful-paint-element` present in 0 of 80 files. No element name was inferred. Trace LCP node names are not used as that element.")
    a("- Network request count: HAR entry count.")
    a("- Static asset count: entries under `/assets/` plus `favicon.svg`.")
    a("- Duplicate URL count: distinct request URLs that occur more than once.")
    a("- Browser-visible Server Function RPC count: the notes field where a notes file exists, and the HAR count of URLs outside the document, `/assets/`, and `favicon.svg` where notes are absent. Both sources are 0.")
    a("- Document request start: document entry `startedDateTime` minus HAR page `startedDateTime`, in milliseconds.")
    a("- Document duration: document entry HAR `time`.")
    a("- Document response end: document request start + document duration.")
    a("- Network DOMContentLoaded and load: `pageTimings.onContentLoad` and `pageTimings.onLoad`.")
    a("- Network milestones: notes `startTime` for `exp-milestone-A` through `exp-milestone-F`. Missing notes were not reconstructed from Lighthouse or Performance traces.")
    a("- Performance times are milliseconds after the single main-frame `navigationStart` whose URL contains `/experiments/experiment-001`. Navigation start is that zero point.")
    a("- Trace FCP: `firstContentfulPaint` with that navigation id.")
    a("- Trace LCP: the latest `largestContentfulPaint::Candidate` with that navigation id.")
    a("- Trace DOMContentLoaded: the `domContentLoadedEventStart` on that frame immediately preceding `MarkDOMContent`. An earlier start, about 0–8 ms after navigation start, is stored in the JSON and is not the reported DCL. See section 7.")
    a("- Trace load event end: `loadEventEnd` on that frame. The dataset audit’s Load column matches `loadEventStart`. The gap between those two events is under 1 ms on every trace.")
    a("- Trace milestones: User Timing `startTime` on `exp-milestone-A` through `exp-milestone-F`. Each trace has exactly one of each mark.")
    a("")
    a("## 4. Lighthouse descriptive statistics")
    a("")
    a("All Lighthouse groups are n=10, including the four Desktop S1 samples with the screen-emulation mismatch and the four Mobile S1 samples collected with screen emulation disabled. INP has no numeric value. The LCP element audit is absent.")
    a("")
    a(render_metric_sections("Lighthouse", lh_rows, LH_METRICS))
    a("Desktop TBT is 0 on all 40 Desktop samples. Mobile CLS is 0 on all 40 Mobile samples.")
    a("")
    a("TTI is informational. It is summarized above and is omitted from the V3B versus V3 comparison.")
    a("")
    a("## 5. Network descriptive statistics")
    a("")
    a("HAR metrics use n=10 in every profile × variant group. Viewport, CPU throttle, and network throttle are not stored in the HAR.")
    a("")
    a("Request count is 53 on all 80 HAR files. Static asset count is 52 on all 80. Duplicate URL count is 0 on all 80. Browser-visible Server Function RPC count is 0 on all 80. No HAR entry falls outside the document, `/assets/`, and `favicon.svg`. The 72 notes files record the same RPC count and `Duplicate Server Function URLs: none`. That zero is the browser-visible row count. The notes state that query work is streamed inside the document response.")
    a("")
    a(
        "Document request start is −1, 0, or 1 ms on all 80 HAR files "
        f"(minimum {fmt_num(payload['document_start_min'], 'ms')} ms, maximum {fmt_num(payload['document_start_max'], 'ms')} ms). "
        "A value of −1 ms is a one-millisecond clock step between the page timestamp and the document entry."
    )
    a("")
    a(render_metric_sections("Network", nw_rows, NW_METRICS))
    a("Transferred bytes and resource bytes are supplementary size descriptions. Index 01 is the minimum in every byte group. The other nine samples in each group share one byte total.")
    a("")
    a("## 6. Network milestone statistics")
    a("")
    a("Primary milestone times are the Network-sample User Timing marks. Each group below is n=9. Index 01 is absent from every group because the notes file was not stored. Those values were not filled from Performance traces.")
    a("")
    a("Milestone names, from protocol section 11: A dashboard visible, B critical content visible, C chart visible, D recent transactions visible, E budgets visible, F fully completed dashboard.")
    a("")
    a(render_metric_sections("Milestones", ms_rows, MILESTONE_METRICS))
    a("## 7. Performance descriptive statistics")
    a("")
    a("Performance is diagnostic. Every group is n=3 and includes the S1 DevTools trace and the two S2–S3 CDP traces. These medians corroborate Network milestones and navigation timing. They are not a substitute for the Network n=9 milestone series or for Lighthouse FCP and LCP.")
    a("")
    a("S1 and S2–S3 are different capture methods: DevTools versus CDP Tracing, different day, port, and asset hashes, with extension scripts present only on S1. Desktop trace FCP and LCP medians pool those methods. The three raw Desktop FCP observations are listed in section 9 so the S1 offset stays visible inside n=3.")
    a("")
    a(render_metric_sections("Performance", pf_rows, PF_METRICS))
    a("### DOMContentLoaded definition")
    a("")
    a("The reported trace DCL is the `domContentLoadedEventStart` paired with `MarkDOMContent` on the experiment frame. That is the document DCL marker.")
    a("")
    a("The dataset audit’s DCL column matches this value on 11 Desktop traces. On all 12 Mobile traces, and on `D-PF-V3-02`, the audit column is an earlier `domContentLoadedEventStart` about 0.2–7.9 ms after navigation start. This processing keeps one definition for all 24 traces. The earlier timestamp remains in the JSON field `dcl_early_ms` and is not used in the tables above. No trace was removed.")
    a("")
    a("Reported trace DCL for `D-PF-V3-02` is the document event at " + fmt_num(payload["d_pf_v3_02_dcl"], "ms") + " ms. The audit column for that sample is 3.1 ms, which is the earlier event.")
    a("")
    a("Trace load in these tables is `loadEventEnd`. The audit Load column is `loadEventStart`. On these 24 traces the end is 0.0–0.8 ms after the start.")
    a("")
    a("## 8. V3B vs V3 comparisons")
    a("")
    a("Δ median = V3B median − V3 median. Relative change (%) = (Δ median / V3 median) × 100. A negative relative change is a lower measured value for V3B. These tables do not assign a better variant, a winner, or a significant result.")
    a("")
    a("### 8.1 Lighthouse, primary and secondary")
    a("")
    a("n is 10/10. TTI is excluded here because it is informational.")
    a("")
    a("#### Mobile")
    a("")
    a(comparison_table(payload["lh_comparisons"], "Mobile"))
    a("")
    a("#### Desktop")
    a("")
    a(comparison_table(payload["lh_comparisons"], "Desktop"))
    a("")
    a("### 8.2 Network HAR")
    a("")
    a("n is 10/10.")
    a("")
    a("#### Mobile")
    a("")
    a(comparison_table(payload["nw_comparisons"], "Mobile"))
    a("")
    a("#### Desktop")
    a("")
    a(comparison_table(payload["nw_comparisons"], "Desktop"))
    a("")
    a("### 8.3 Network milestones")
    a("")
    a("n is 9/9. Protocol section 12.1 names milestones C, D, E, and F as the V3 versus V3B comparison. Milestones A and B are included because both groups have stored notes.")
    a("")
    a("#### Mobile")
    a("")
    a(comparison_table(payload["ms_comparisons"], "Mobile"))
    a("")
    a("#### Desktop")
    a("")
    a(comparison_table(payload["ms_comparisons"], "Desktop"))
    a("")
    a("### 8.4 Performance, diagnostic corroboration")
    a("")
    a("n is 3/3. These deltas mix the S1 DevTools trace with two CDP traces, including the Desktop FCP/LCP capture split. They are corroboration of the Network milestone comparison, not a second primary result.")
    a("")
    a("#### Mobile")
    a("")
    a(comparison_table(payload["pf_comparisons"], "Mobile"))
    a("")
    a("#### Desktop")
    a("")
    a(comparison_table(payload["pf_comparisons"], "Desktop"))
    a("")
    a("## 9. Methodological caveats")
    a("")
    a("### Samples retained with a known cohort difference")
    a("")
    a("Index 01 is a separate collection cohort: 2026-09-28 for Lighthouse and Network, 2026-09-29 for Performance, origin port 4173. Index 02 and later is 2026-09-30, port 3000. The build SHA on the later Network notes and CDP traces is `8c8df0b3266b32b841735126151e9b1b1b2b94ba`. The index-01 build SHA is not verifiable from these artifacts. All index-01 samples stay in the n=10 and n=3 series that apply to them.")
    a("")
    a("Lighthouse screen emulation, counted from the JSON in this processing:")
    a("")
    a(f"- Screen emulation disabled: {payload['screen']['disabled']} of 80.")
    a(f"- Desktop index 01 stored screen: {payload['screen']['desktop_s1_screen']}. `formFactor` on those four files is desktop. Throttling on those four files is the desktop preset. The stored screen block is the mobile size and scale, and emulation is disabled. That mismatch stays attached to Desktop Lighthouse n=10.")
    a("")
    a("The four Desktop S1 Lighthouse samples inside n=10:")
    a("")
    a("| Sample | Performance score | FCP (ms) | LCP (ms) | Speed Index (ms) | CLS |")
    a("| --- | ---: | ---: | ---: | ---: | ---: |")
    for item in payload["desktop_s1_lighthouse"]:
        a(
            f"| {item['sample_id']} | {fmt_num(item['performance_score'], 'score')} | {fmt_num(item['fcp_ms'], 'ms')} | {fmt_num(item['lcp_ms'], 'ms')} | {fmt_num(item['speed_index_ms'], 'ms')} | {fmt_num(item['cls'], 'cls')} |"
        )
    a("")
    a("### Performance capture method")
    a("")
    a("S1 Performance traces are DevTools captures. S2–S3 traces are CDP Tracing. Extension scripts are present on S1 only. Emulated device scale is not stored on the eight S1 traces. Desktop `cpuThrottling` is absent on all 12 Desktop traces.")
    a("")
    a("Desktop trace FCP, S1 value and the two CDP values, all retained in n=3:")
    a("")
    a("| Variant | S1 FCP (ms) | CDP FCP (ms) | CDP FCP (ms) |")
    a("| --- | ---: | ---: | ---: |")
    for item in payload["desktop_fcp_split"]:
        a(
            f"| {item['variant']} | {fmt_num(item['s1'], 'ms')} | {fmt_num(item['cdp'][0], 'ms')} | {fmt_num(item['cdp'][1], 'ms')} |"
        )
    a("")
    a("On each Desktop variant the S1 FCP is later than both CDP values. Mobile S1 FCP stays within the same band as its CDP pair. Lighthouse remains the primary FCP and LCP series.")
    a("")
    a("### Tukey flags")
    a("")
    tti_flags = sum(1 for flag in flags if flag["metric"] == "TTI (ms)")
    start_flags = sum(1 for flag in flags if flag["metric"] == "Document request start (ms)")
    end_flags = sum(1 for flag in flags if flag["metric"] == "Document response end (ms)")
    a(
        f"Tukey flags on the reported series: **{len(flags)}** metric values across **{len(flagged_ids)}** samples. "
        f"The dataset audit’s series — Lighthouse without TTI, HAR timings without document start and document end, and Network milestones — account for **{len(audit_series_flags)}** of those flags. "
        f"The other {tti_flags + start_flags + end_flags} flags are TTI ({tti_flags}), document request start ({start_flags}), and document response end ({end_flags}). "
        f"Performance trace flags: **{sum(1 for flag in flags if flag['family']=='performance')}**. "
        "No flagged sample was removed. The full flag list is in `final-statistical-analysis.json`."
    )
    a("")
    a(
        f"Flags at least 10% from the group median, excluding informational TTI and the 1 ms document-start clock: **{len(substantive_large)}**. "
        "The remaining flags are under 10% and come mostly from tight groups, including byte totals and sub-percent timing differences."
    )
    a("")
    if substantive_large:
        a("Flags at least 10% from the group median:")
        a("")
        records = []
        ordered_flags = sorted(
            substantive_large,
            key=lambda flag: -abs(flag["deviation_pct"]),
        )
        for flag in ordered_flags:
            deviation = "not defined" if flag["deviation_pct"] is None else fmt_num(flag["deviation_pct"], "pct")
            records.append(
                [
                    flag["sample_id"],
                    f"{flag['profile']} {flag['variant']}",
                    flag["metric"],
                    fmt_num(flag["observed"], flag["unit"]),
                    fmt_num(flag["median"], flag["unit"]),
                    deviation,
                    flag["reason"],
                ]
            )
        a(md_table(["Sample", "Group", "Metric", "Observed", "Group median", "Deviation from median (%)", "Reason"], records))
        a("")
    a("### Filename")
    a("")
    a("`D-LH-V1-01` is stored as `D-LH-V1-01 .json` and `D-LH-V1-01 .html`. The sample was parsed from the spaced JSON path. The file was not renamed.")
    a("")
    a("## 10. Metrics excluded from comparative interpretation")
    a("")
    a("| Metric | Status in this processing |")
    a("| --- | --- |")
    a("| INP | No numeric value in 80/80 Lighthouse files. Load-only experiment. Not estimated. |")
    a("| Lighthouse LCP element | Audit absent in 80/80 files. Not inferred from traces. |")
    a("| Network milestones for eight index-01 samples | Notes not stored. Left blank. Not reconstructed. |")
    a("| Performance scripting time | Not summarized. S1 and S2–S3 disagree in direction across definitions in the capture-method audit. |")
    a("| Performance rendering time | Not summarized. Excluded from comparison across the capture split. |")
    a("| Performance painting time | Not summarized. Excluded from comparison across the capture split. |")
    a("| Performance long tasks | Not summarized. Excluded from comparison across the capture split. |")
    a("| Last network activity → milestone F | Not summarized. The capture-method audit shows the gap changes sign and size between S1 and S2–S3. |")
    a("| TTI | Calculated as informational Lighthouse dispersion only. Omitted from V3B versus V3. |")
    a("| Early trace `domContentLoadedEventStart` | Stored per sample in JSON. Omitted from the reported DCL median. |")
    a("")
    a("Suitable for the final thesis analysis: Lighthouse performance score, FCP, LCP, Speed Index, CLS, and TBT; Network request count, static asset count, duplicate URL count, browser-visible Server Function RPC count, document start, document duration, document response end, DOMContentLoaded, load, and milestones A–F at the n stated above. Transferred bytes and resource bytes can be reported as size, separately from the timing comparison.")
    a("")
    a("Diagnostic only: Performance FCP, LCP, DOMContentLoaded, load event end, and milestones A–F, each at n=3, with the S1 capture-method caveat. Desktop trace FCP and LCP are reported with the S1 versus CDP values visible.")
    a("")
    a("## 11. Recommended tables and figures for Chapter 4")
    a("")
    a("Use profile-separate displays. Caption every display with the tool, the metric, and n. Keep index 01 inside Lighthouse and HAR displays. State n=9 on Network milestone displays. State the Desktop Lighthouse S1 screen mismatch on Desktop Lighthouse displays.")
    a("")
    a("1. Table, Lighthouse medians by variant, separate Mobile and Desktop panels. Columns: variant, n, performance score, FCP, LCP, Speed Index, TBT, CLS. n=10.")
    a("2. Appendix table, the dispersion rows in section 4, for the same metrics.")
    a("3. Table, Network medians by variant, separate profiles. Columns: variant, n, request count, document duration, DOMContentLoaded, load, Server Function RPC count, duplicate URL count. n=10.")
    a("4. Table, Network milestone medians B–F by variant, separate profiles, with A available from section 6. n=9. Caption the eight absent index-01 notes.")
    a("5. Table, V3B versus V3, section 8.1 through 8.3, split by profile. This is the numeric table for Chapter 4.5. Leave hypothesis language out of the table.")
    a("6. Figure, median Network milestones B–F by variant, one panel per profile, with an interval from Q1 to Q3. n=9.")
    a("7. Figure, Lighthouse LCP and Speed Index medians by variant, one panel per profile. n=10. Desktop caption includes the S1 screen-emulation mismatch.")
    a("8. Small size table, transferred bytes and resource bytes by variant. The two profiles match. n=10.")
    a("9. Diagnostic table or appendix, Performance milestone medians A–F, n=3, captioned as corroboration and as a mixed capture method.")
    a("10. Do not chart scripting, rendering, painting, long tasks, or the last-network-activity gap.")
    a("")
    a("## 12. Numerical findings to carry into Chapter 4")
    a("")
    a("Quote medians with the n and IQR below. Full dispersion is in sections 4–7. Δ is V3B median minus V3 median. A negative relative change is a lower V3B median.")
    a("")
    a("### Lighthouse medians (n=10)")
    a("")
    for metric, _label, unit, _role in LH_METRICS:
        if metric == "tti_ms":
            continue
        label = next(item[1] for item in LH_METRICS if item[0] == metric)
        a(f"**{label}**")
        a("")
        for profile in PROFILES:
            bits = []
            for variant in VARIANTS:
                stats = row(profile, variant, label, lh_rows)
                bits.append(
                    f"{variant} {fmt_num(stats['median'], unit)} (IQR {fmt_num(stats['iqr'], unit)})"
                )
            a(f"- {profile}: " + "; ".join(bits))
        a("")
    a("### Network HAR medians (n=10)")
    a("")
    for key, label, unit, role in NW_METRICS:
        if role == "supplementary":
            continue
        a(f"**{label}**")
        a("")
        for profile in PROFILES:
            bits = []
            for variant in VARIANTS:
                stats = row(profile, variant, label, nw_rows)
                bits.append(
                    f"{variant} {fmt_num(stats['median'], unit)} (IQR {fmt_num(stats['iqr'], unit)})"
                )
            a(f"- {profile}: " + "; ".join(bits))
        a("")
    a("### Network milestone medians (n=9)")
    a("")
    for _key, label, unit, _role in MILESTONE_METRICS:
        a(f"**{label}**")
        a("")
        for profile in PROFILES:
            bits = []
            for variant in VARIANTS:
                stats = row(profile, variant, label, ms_rows)
                bits.append(
                    f"{variant} {fmt_num(stats['median'], unit)} (IQR {fmt_num(stats['iqr'], unit)})"
                )
            a(f"- {profile}: " + "; ".join(bits))
        a("")
    a("### V3B median minus V3 median")
    a("")
    a("Lighthouse, n=10/10:")
    a("")
    for item in payload["lh_comparisons"]:
        relative = "not defined" if item["relative_change_pct"] is None else f"{fmt_num(item['relative_change_pct'], 'pct')}%"
        a(
            f"- {item['profile']} {item['metric']}: V3B {fmt_num(item['median_v3b'], item['unit'])}, V3 {fmt_num(item['median_v3'], item['unit'])}, Δ {fmt_num(item['delta'], item['unit'])}, relative change {relative}"
        )
    a("")
    a("Network milestones C–F, n=9/9:")
    a("")
    for item in payload["ms_comparisons"]:
        if item["metric"] not in {label for _k, label, _u, _r in MILESTONE_METRICS if label.startswith("Milestone C") or label.startswith("Milestone D") or label.startswith("Milestone E") or label.startswith("Milestone F")}:
            continue
        relative = "not defined" if item["relative_change_pct"] is None else f"{fmt_num(item['relative_change_pct'], 'pct')}%"
        a(
            f"- {item['profile']} {item['metric']}: V3B {fmt_num(item['median_v3b'], item['unit'])}, V3 {fmt_num(item['median_v3'], item['unit'])}, Δ {fmt_num(item['delta'], item['unit'])}, relative change {relative}"
        )
    a("")
    a("Network document duration and load, n=10/10:")
    a("")
    for item in payload["nw_comparisons"]:
        if item["metric"] not in {"Document duration (ms)", "Load (ms)", "DOMContentLoaded (ms)", "Document response end (ms)"}:
            continue
        relative = "not defined" if item["relative_change_pct"] is None else f"{fmt_num(item['relative_change_pct'], 'pct')}%"
        a(
            f"- {item['profile']} {item['metric']}: V3B {fmt_num(item['median_v3b'], item['unit'])}, V3 {fmt_num(item['median_v3'], item['unit'])}, Δ {fmt_num(item['delta'], item['unit'])}, relative change {relative}"
        )
    a("")
    a("Performance diagnostic medians are in section 7. Carry them into Chapter 4 only as corroboration, with the capture-method caveat.")
    a("")
    a("## Processing record")
    a("")
    a(f"- Lighthouse files parsed: {payload['counts']['lighthouse']}")
    a(f"- Network HAR files parsed: {payload['counts']['network']}")
    a(f"- Network notes files parsed: {payload['counts']['notes']}")
    a(f"- Network notes absent: {payload['counts']['notes_absent']}")
    a(f"- Performance files parsed: {payload['counts']['performance']}")
    a(f"- Total sample files: {payload['counts']['files']}")
    a("- Raw measurement files were opened for reading and were not written.")
    a("- Tables in this file were written by `final-statistical-analysis.py` from the raw artifacts.")
    a("- Machine-readable exports: `final-statistical-analysis.json` and `final-statistical-analysis.csv`.")
    a("")
    return "\n".join(lines) + "\n"


def json_ready(value):
    if isinstance(value, dict):
        return {key: json_ready(item) for key, item in value.items()}
    if isinstance(value, list):
        return [json_ready(item) for item in value]
    if isinstance(value, float):
        if math.isnan(value) or math.isinf(value):
            return None
        return value
    return value


def main() -> None:
    samples = collect_samples()
    families = defaultdict(int)
    for sample in samples:
        if sample["family"] != "network-milestone":
            families[sample["family"]] += 1
    lighthouse = [sample for sample in samples if sample["family"] == "lighthouse"]
    network = [sample for sample in samples if sample["family"] == "network"]
    performance = [sample for sample in samples if sample["family"] == "performance"]
    if (len(lighthouse), len(network), len(performance)) != (80, 80, 24):
        raise SystemExit(f"unexpected counts {len(lighthouse)} {len(network)} {len(performance)}")

    missing_notes = [sample["sample_id"] for sample in network if not sample["notes_stored"]]
    if len(missing_notes) != 8:
        raise SystemExit(f"expected 8 missing notes, found {missing_notes}")

    lh_rows = stats_rows(samples, "lighthouse", LH_METRICS)
    nw_rows = stats_rows(samples, "network", NW_METRICS)
    ms_rows = stats_rows(samples, "network-milestone", MILESTONE_METRICS, require_notes=True)
    pf_rows = stats_rows(samples, "performance", PF_METRICS)
    for row in ms_rows:
        if row["n"] != 9:
            raise SystemExit(f"milestone n is {row['n']} for {row['profile']} {row['variant']} {row['metric']}")

    lh_compare_metrics = [label for _k, label, _u, role in LH_METRICS if role != "informational"]
    nw_compare_metrics = [label for _k, label, _u, _r in NW_METRICS]
    ms_compare_metrics = [label for _k, label, _u, _r in MILESTONE_METRICS]
    pf_compare_metrics = [label for _k, label, _u, _r in PF_METRICS]

    lh_comparisons = comparison_rows(lh_rows, lh_compare_metrics)
    nw_comparisons = comparison_rows(nw_rows, nw_compare_metrics)
    ms_comparisons = comparison_rows(ms_rows, ms_compare_metrics)
    pf_comparisons = comparison_rows(pf_rows, pf_compare_metrics)

    flag_rows = lh_rows + nw_rows + ms_rows + pf_rows
    flags = tukey_flags(samples, flag_rows)

    desktop_s1 = []
    for sample in lighthouse:
        if sample["profile"] == "Desktop" and sample["index"] == 1:
            desktop_s1.append({"sample_id": sample["sample_id"], **{key: sample["metrics"][key] for key in ("performance_score", "fcp_ms", "lcp_ms", "speed_index_ms", "cls")}})
    desktop_s1.sort(key=lambda item: item["sample_id"])

    disabled = sum(1 for sample in lighthouse if sample["metrics"]["screen_disabled"])
    desktop_s1_screens = sorted(
        {
            (
                sample["metrics"]["screen_width"],
                sample["metrics"]["screen_height"],
                sample["metrics"]["screen_dsf"],
                sample["metrics"]["screen_disabled"],
                sample["metrics"]["form_factor"],
            )
            for sample in lighthouse
            if sample["profile"] == "Desktop" and sample["index"] == 1
        }
    )
    if len(desktop_s1_screens) != 1:
        raise SystemExit(f"desktop S1 screen configs differ: {desktop_s1_screens}")
    width, height, dsf, disabled_flag, form_factor = desktop_s1_screens[0]
    screen_text = f"{width}×{height}, device scale {dsf}, emulation disabled={disabled_flag}, formFactor={form_factor}"

    desktop_fcp_split = []
    for variant in VARIANTS:
        group = [sample for sample in performance if sample["profile"] == "Desktop" and sample["variant"] == variant]
        s1 = next(sample["metrics"]["fcp_ms"] for sample in group if sample["index"] == 1)
        cdp = sorted(sample["metrics"]["fcp_ms"] for sample in group if sample["index"] != 1)
        desktop_fcp_split.append({"variant": variant, "s1": s1, "cdp": cdp})

    d_pf = next(sample for sample in performance if sample["sample_id"] == "D-PF-V3-02")

    # Spot-check unambiguous Lighthouse and Network extractions against values read from the artifacts during audit.
    v1_m = next(sample for sample in lighthouse if sample["sample_id"] == "M-LH-V1-01")
    if abs(v1_m["metrics"]["fcp_ms"] - 3939.294) > 1e-6:
        raise SystemExit("M-LH-V1-01 FCP mismatch")
    if abs(v1_m["metrics"]["performance_score"] - 70.0) > 1e-9:
        raise SystemExit("M-LH-V1-01 score mismatch")
    mobile_v1_fcp = lookup(lh_rows, "Mobile", "V1", "FCP (ms)")
    if fmt_num(mobile_v1_fcp["median"], "ms") != "3481.8":
        raise SystemExit(f"Mobile V1 FCP median {mobile_v1_fcp['median']}")
    mobile_v3b_f = lookup(ms_rows, "Mobile", "V3B", "Milestone F (ms)")
    if fmt_num(mobile_v3b_f["median"], "ms") != "3839.7":
        raise SystemExit(f"Mobile V3B milestone F median {mobile_v3b_f['median']}")

    payload = {
        "counts": {
            "lighthouse": len(lighthouse),
            "network": len(network),
            "notes": 80 - len(missing_notes),
            "notes_absent": len(missing_notes),
            "performance": len(performance),
            "files": len(lighthouse) + len(network) + len(performance),
            "failures": 0,
        },
        "missing_notes": missing_notes,
        "lighthouse_rows": lh_rows,
        "network_rows": nw_rows,
        "milestone_rows": ms_rows,
        "performance_rows": pf_rows,
        "lh_comparisons": lh_comparisons,
        "nw_comparisons": nw_comparisons,
        "ms_comparisons": ms_comparisons,
        "pf_comparisons": pf_comparisons,
        "flags": flags,
        "desktop_s1_lighthouse": desktop_s1,
        "screen": {"disabled": disabled, "desktop_s1_screen": screen_text},
        "desktop_fcp_split": desktop_fcp_split,
        "d_pf_v3_02_dcl": d_pf["metrics"]["dcl_ms"],
        "document_start_min": min(sample["metrics"]["document_start_ms"] for sample in network),
        "document_start_max": max(sample["metrics"]["document_start_ms"] for sample in network),
    }
    starts = {sample["metrics"]["document_start_ms"] for sample in network}
    if starts - {-1.0, 0.0, 1.0}:
        raise SystemExit(f"unexpected document start values: {sorted(starts)}")
    report = build_report(payload)
    OUT_MD.write_text(report)

    export_samples = []
    for sample in samples:
        if sample["family"] == "network-milestone":
            continue
        export_samples.append(
            {
                "sample_id": sample["sample_id"],
                "family": sample["family"],
                "profile": sample["profile"],
                "variant": sample["variant"],
                "index": sample["index"],
                "path": sample["path"],
                "notes_stored": sample.get("notes_stored"),
                "source": sample.get("source"),
                "metrics": sample["metrics"],
            }
        )
    export = {
        "experiment": "001",
        "processing_date": "2026-09-30",
        "method": {
            "primary_summary": "median",
            "quartiles": "inclusive linear interpolation, statistics.quantiles n=4 method=inclusive",
            "sd": "sample standard deviation, divisor n-1",
            "outlier_policy": "Tukey fences flag only; no sample removed",
            "hypothesis_tests": False,
            "p_values": False,
        },
        "counts": payload["counts"],
        "missing_milestone_notes": missing_notes,
        "samples": export_samples,
        "descriptive": lh_rows + nw_rows + ms_rows + pf_rows,
        "v3b_vs_v3": lh_comparisons + nw_comparisons + ms_comparisons + pf_comparisons,
        "tukey_flags": flags,
    }
    OUT_JSON.write_text(json.dumps(json_ready(export), indent=2) + "\n")

    with OUT_CSV.open("w", newline="") as handle:
        writer = csv.DictWriter(
            handle,
            fieldnames=[
                "record_type",
                "family",
                "profile",
                "variant",
                "metric",
                "role",
                "n",
                "n_v3b",
                "n_v3",
                "median",
                "q1",
                "q3",
                "iqr",
                "minimum",
                "maximum",
                "sd",
                "mean",
                "median_v3b",
                "median_v3",
                "delta_median",
                "relative_change_pct",
            ],
        )
        writer.writeheader()
        for row in export["descriptive"]:
            writer.writerow(
                {
                    "record_type": "descriptive",
                    "family": row["family"],
                    "profile": row["profile"],
                    "variant": row["variant"],
                    "metric": row["metric"],
                    "role": row["role"],
                    "n": row["n"],
                    "median": row["median"],
                    "q1": row["q1"],
                    "q3": row["q3"],
                    "iqr": row["iqr"],
                    "minimum": row["min"],
                    "maximum": row["max"],
                    "sd": row["sd"],
                    "mean": row["mean"],
                }
            )
        for row in export["v3b_vs_v3"]:
            writer.writerow(
                {
                    "record_type": "v3b_vs_v3",
                    "profile": row["profile"],
                    "metric": row["metric"],
                    "role": row["role"],
                    "n_v3b": row["n_v3b"],
                    "n_v3": row["n_v3"],
                    "median_v3b": row["median_v3b"],
                    "median_v3": row["median_v3"],
                    "delta_median": row["delta"],
                    "relative_change_pct": row["relative_change_pct"],
                }
            )
    print("wrote", OUT_MD)
    print("wrote", OUT_JSON)
    print("wrote", OUT_CSV)
    print("flags", len(flags), "large", sum(1 for flag in flags if flag["deviation_pct"] is None or abs(flag["deviation_pct"]) >= 10))
    print("D-PF-V3-02 document DCL", d_pf["metrics"]["dcl_ms"], "early", d_pf["metrics"]["dcl_early_ms"])


if __name__ == "__main__":
    main()
