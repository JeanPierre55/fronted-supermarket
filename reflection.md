# Reflection: SDD vs Traditional Development

In this workshop, the SDD (Specification-Driven Development) approach changed how the project evolved compared to a traditional code-first workflow. Instead of jumping directly into components, the process started by writing clear requirements, a concrete design, and incremental tasks. That shifted most ambiguity to the beginning, where it is cheaper and safer to resolve.

The biggest advantage of SDD was alignment. The `requirements.md` file forced user stories and acceptance criteria to be explicit and testable. This reduced interpretation errors and gave a reliable checklist for validation. The `design.md` then translated those requirements into architecture decisions, data models, and state flows. By the time implementation started, the project had a stable map: components, domain entities, calculation order, and offline behavior were already defined.

`tasks.md` also provided strong execution discipline. Breaking the project into small, testable steps made progress measurable and lowered the risk of large regressions. In a traditional workflow, tasks are often implicit and code can grow in a fragmented way. With SDD, each change has a known purpose and validation condition, which improves both code quality and confidence.

Another key benefit was collaboration with AI-assisted implementation. Well-written specs acted as high-quality prompts for generation and iteration. When output differed from expectation, the root cause was usually in spec clarity, not in coding speed. This reinforced an important lesson: with AI tools, specification quality directly impacts implementation quality.

Traditional development still has strengths, especially for rapid prototyping when requirements are unknown. However, for a transactional system like a POS, where correctness in totals, taxes, and checkout rules matters, SDD is more robust. It encourages deliberate design, traceability from requirement to code, and easier QA.

Overall, SDD felt slower in the first phase but faster and safer in implementation and validation. The process produced cleaner structure, fewer late surprises, and better readiness for maintenance. For this kind of application, SDD is not just documentation overhead; it is a practical strategy to improve delivery quality.
