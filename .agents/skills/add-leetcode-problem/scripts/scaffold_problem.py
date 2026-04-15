#!/usr/bin/env python3
"""Scaffold a LeetCode catalog problem for this repository."""

from __future__ import annotations

import argparse
import re
import shutil
from dataclasses import dataclass
from pathlib import Path


SLUG_PATTERN = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
IDENTIFIER_PATTERN = re.compile(r"^[A-Za-z_$][A-Za-z0-9_$]*$")


@dataclass(frozen=True)
class Solution:
    id: str
    name: str
    summary: str


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    slug = re.sub(r"-{2,}", "-", slug)
    if not slug:
        raise ValueError("Unable to derive a slug from the title")
    return slug


def pascal_case(value: str) -> str:
    parts = re.split(r"[^A-Za-z0-9]+", value)
    result = "".join(part[:1].upper() + part[1:] for part in parts if part)
    if not result or result[0].isdigit():
        result = f"Problem{result}"
    return result


def camel_case_slug(value: str) -> str:
    pascal = pascal_case(value)
    return pascal[:1].lower() + pascal[1:]


def parse_tags(raw_tags: str) -> list[str]:
    tags = [tag.strip() for tag in raw_tags.split(",") if tag.strip()]
    if not tags:
        raise ValueError("At least one tag is required")
    return tags


def parse_solution(value: str) -> Solution:
    parts = [part.strip() for part in value.split("|")]
    if len(parts) != 3 or not all(parts):
        raise argparse.ArgumentTypeError(
            "--solution must use the format 'id|Name|Summary'"
        )

    solution_id, name, summary = parts
    if not SLUG_PATTERN.fullmatch(solution_id):
        raise argparse.ArgumentTypeError(
            f"Solution id '{solution_id}' must be lowercase hyphen-case"
        )

    return Solution(id=solution_id, name=name, summary=summary)


def quote_string(value: str) -> str:
    return "'" + value.replace("\\", "\\\\").replace("'", "\\'") + "'"


def format_array(values: list[str]) -> str:
    return "[" + ", ".join(quote_string(value) for value in values) + "]"


def build_meta(
    title: str,
    slug: str,
    difficulty: str,
    tags: list[str],
    leetcode_url: str | None,
    solutions: list[Solution],
) -> str:
    url_line = f"  leetcodeUrl: {quote_string(leetcode_url)},\n" if leetcode_url else ""
    solution_entries = "\n".join(
        "\n".join(
            [
                "    {",
                f"      id: {quote_string(solution.id)},",
                f"      name: {quote_string(solution.name)},",
                f"      summary: {quote_string(solution.summary)},",
                "    },",
            ]
        )
        for solution in solutions
    )

    return f"""import type {{ ProblemMeta }} from '../../types';

const meta: ProblemMeta = {{
  title: {quote_string(title)},
  slug: {quote_string(slug)},
  difficulty: {quote_string(difficulty)},
  tags: {format_array(tags)},
{url_line}  solutions: [
{solution_entries}
  ],
}};

export default meta;
"""


def build_problem_md(title: str) -> str:
    return f"""# {title}

TODO: Replace this placeholder with the pasted problem statement.

## Example 1

```text
Input: TODO
Output: TODO
```

## Constraints

- TODO
"""


def build_registry(
    title: str,
    solutions: list[Solution],
    solution_type: str,
    function_name: str,
) -> str:
    imports = "\n".join(
        f"import {{ {function_name} as {camel_case_slug(solution.id)} }} from './{solution.id}';"
        for solution in solutions
    )
    type_name = f"{pascal_case(title)}Solution"
    entries = "\n".join(
        f"  {quote_string(solution.id)}: {camel_case_slug(solution.id)},"
        for solution in solutions
    )

    return f"""{imports}

export type {type_name} = {solution_type};

export const solutions: Record<string, {type_name}> = {{
{entries}
}};
"""


def build_solution(function_name: str, solution_type: str, solution_name: str) -> str:
    return f"""export const {function_name}: {solution_type} = () => {{
  throw new Error({quote_string(f'{solution_name} solution is not implemented yet.')});
}};
"""


def build_test(title: str, slug: str) -> str:
    return f"""import {{ describe, expect, it }} from 'vitest';
import meta from './meta';
import {{ solutions }} from './solutions';

const cases = [
  // TODO: Replace with shared cases from the pasted problem statement.
];

describe(meta.title, () => {{
  for (const solution of meta.solutions) {{
    it(`${{solution.name}} handles every shared case`, () => {{
      const implementation = solutions[solution.id];
      expect(implementation, `${{solution.id}} is missing from the executable registry`).toBeDefined();

      for (const testCase of cases) {{
        // TODO: Call implementation with copied inputs and assert the expected result.
        expect(testCase).toBeDefined();
      }}
    }});
  }}

  it.todo('replace scaffold placeholders with meaningful {title} coverage for {slug}');
}});
"""


def validate_inputs(args: argparse.Namespace) -> tuple[Path, str, list[str]]:
    root = Path(args.root).expanduser().resolve()
    slug = args.slug or slugify(args.title)

    if not SLUG_PATTERN.fullmatch(slug):
        raise ValueError("--slug must be lowercase hyphen-case")

    if not IDENTIFIER_PATTERN.fullmatch(args.function_name):
        raise ValueError("--function-name must be a valid TypeScript identifier")

    if not args.solutions:
        raise ValueError("At least one --solution is required")

    solution_ids = [solution.id for solution in args.solutions]
    duplicate_ids = sorted({solution_id for solution_id in solution_ids if solution_ids.count(solution_id) > 1})
    if duplicate_ids:
        raise ValueError(f"Duplicate solution ids: {', '.join(duplicate_ids)}")

    return root, slug, parse_tags(args.tags)


def planned_files(
    problem_dir: Path,
    title: str,
    slug: str,
    difficulty: str,
    tags: list[str],
    leetcode_url: str | None,
    solutions: list[Solution],
    solution_type: str,
    function_name: str,
) -> dict[Path, str]:
    files = {
        problem_dir / "meta.ts": build_meta(title, slug, difficulty, tags, leetcode_url, solutions),
        problem_dir / "problem.md": build_problem_md(title),
        problem_dir / f"{slug}.test.ts": build_test(title, slug),
        problem_dir / "solutions" / "index.ts": build_registry(
            title,
            solutions,
            solution_type,
            function_name,
        ),
    }

    for solution in solutions:
        files[problem_dir / "solutions" / f"{solution.id}.ts"] = build_solution(
            function_name,
            solution_type,
            solution.name,
        )

    return files


def write_files(files: dict[Path, str], problem_dir: Path, force: bool) -> None:
    if problem_dir.exists():
        if not force:
            raise FileExistsError(f"{problem_dir} already exists; pass --force to overwrite it")
        shutil.rmtree(problem_dir)

    for path, content in files.items():
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", default=".", help="Repository root. Defaults to the current directory.")
    parser.add_argument("--title", required=True, help="Problem title, for example 'Two Sum'.")
    parser.add_argument("--slug", help="Problem slug. Defaults to a slug derived from --title.")
    parser.add_argument("--difficulty", required=True, choices=["Easy", "Medium", "Hard"])
    parser.add_argument("--tags", required=True, help="Comma-separated tags, for example 'Array, Hash Table'.")
    parser.add_argument("--leetcode-url")
    parser.add_argument(
        "--solution",
        dest="solutions",
        action="append",
        type=parse_solution,
        required=True,
        help="Repeatable solution metadata in the format 'id|Name|Summary'.",
    )
    parser.add_argument(
        "--solution-type",
        required=True,
        help="TypeScript function type, for example '(nums: number[]) => boolean'.",
    )
    parser.add_argument("--function-name", required=True, help="Exported solution function name.")
    parser.add_argument("--force", action="store_true", help="Overwrite an existing problem folder.")
    parser.add_argument("--dry-run", action="store_true", help="Print planned files without writing them.")
    args = parser.parse_args()

    root, slug, tags = validate_inputs(args)
    problem_dir = root / "src" / "problems" / slug
    files = planned_files(
        problem_dir=problem_dir,
        title=args.title,
        slug=slug,
        difficulty=args.difficulty,
        tags=tags,
        leetcode_url=args.leetcode_url,
        solutions=args.solutions,
        solution_type=args.solution_type,
        function_name=args.function_name,
    )

    if args.dry_run:
        print(f"Would create problem: {args.title} ({slug})")
        print(f"Target directory: {problem_dir}")
        for path in sorted(files):
            print(f"  {path.relative_to(root)}")
        return 0

    write_files(files, problem_dir, args.force)
    print(f"Created {len(files)} files under {problem_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
