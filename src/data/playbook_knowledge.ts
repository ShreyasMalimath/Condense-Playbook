/**
 * PLAYBOOK KNOWLEDGE BASE — LLM-Optimized
 *
 * This file is a clean, structured distillation of the full Condense Sales Playbook.
 * It is designed to be injected as grounded context into the Boss Battle LLM prompts.
 * It is NOT a copy of the full playbook — it is a concise set of product facts, 
 * discovery questions, and objection handles that map to each sales stage.
 */

export interface KnowledgeSection {
    id: string;
    title: string;
    summary: string;
    keyFacts: string[];
    discoveryQuestions: string[];
    objectionHandles: Record<string, string>;
}

export const CONDENSE_KNOWLEDGE: KnowledgeSection[] = [
    {
        id: "product-core",
        title: "What Condense Is",
        summary: "Condense is a Kafka-native, AI-first, cloud-native data streaming platform that runs fully inside the customer's own cloud (BYOC). It replaces the fragmented mess of microservices, KSQL chains, and manual Kafka management with a single unified execution engine.",
        keyFacts: [
            "Kafka-native: speaks the standard Kafka protocol natively — no adapters, no overhead, no proprietary lock-in.",
            "BYOC (Bring Your Own Cloud): the software runs entirely inside the customer's AWS, GCP, or Azure account. Zero data leaves their perimeter.",
            "Unified Logic Plane: replaces dozens of fragmented microservices with one consistent processing engine that handles enrichments, filters, joins, aggregations, windowing, and routing.",
            "AI-First: AI dev assistant generates logic, validates pipelines, and helps with Git commits. AI ops assistant interprets Kafka behavior, summarizes logs, and provides root cause insights.",
            "No-code / Low-code / Full-code: visual blocks for analysts, modular compositions for engineers, and a full IDE with Git/version control for complex logic.",
            "Autoscaling: automatically scales Kafka partitions, compute, and storage based on input patterns — no manual tuning required.",
            "Unified Observability: one dashboard for throughput, consumer lag, resource usage, and errors — no more navigating 5 dashboards to find a bug.",
            "Fully managed Kafka: handles provisioning, scaling, upgrades, balancing, and failover — the cluster stays inside the customer's VPC.",
            "Supports enrichments, filters, splits, joins, windowed aggregations, and pattern checks in a single runtime.",
            "Prebuilt connectors for IoT, telemetry, mobility, and cloud-native source/sinks.",
        ],
        discoveryQuestions: [
            "How is Kafka provisioned and maintained in your team today?",
            "How many microservices do you have just for moving and transforming data?",
            "When something goes wrong in the pipeline, how many browser tabs do you open to find the root cause?",
            "What's your turnaround time for a new business rule or transformation change?",
            "Does your platform team spend more time on features or infrastructure maintenance?",
        ],
        objectionHandles: {
            "we already have kafka": "Condense complements Kafka — it's Kafka-native, and it eliminates the fragmented layer of microservices and manual ops that surround your Kafka cluster.",
            "we have msk": "MSK solves broker management, but it does nothing for the processing and logic layer surrounding it — that's exactly where Condense focuses.",
            "we built this in-house": "Home-grown solutions become the biggest maintenance burden over time. Every new use case adds complexity, and your best engineers end up maintaining infra instead of building products.",
            "too expensive": "Condense replaces 5-10+ services with a single platform. When you factor in the compute, licensing, and engineering cost of what it replaces, most customers see a 40-60% TCO improvement.",
        }
    },
    {
        id: "problem-fragmentation",
        title: "The Problem Condense Solves: Fragmented Architectures",
        summary: "Modern real-time architectures are built by stitching together many cloud services — Kinesis/Event Hubs, MSK/Confluent, Lambda/Functions, KSQL, custom microservices, S3, APIs. This creates what we call 'microservice sprawl' — a fragile, expensive, and slow system where engineering effort is wasted on infrastructure glue instead of business value.",
        keyFacts: [
            "The Ingestion layer (Kinesis, Pub/Sub, Event Hubs) delivers events but has NO ability to apply business logic.",
            "The Kafka broker layer (MSK, Confluent) provides durability and ordering but does NOT manage transformations or routing.",
            "The Processing layer becomes 'Microservice Sprawl': each business rule becomes a separate service with its own compute, scaling policy, and failure handling.",
            "SQL/KSQL transformation chains become fragile at scale — a single table change can break dozens of dependent downstream queries.",
            "Companies suffer 7 Natural Forces: (1) Tempo Mismatch — Kafka is continuous but Functions are bursty. (2) Scattered Memory — state split across Kafka topics, SQL tables, caches. (3) Logic Sprawl. (4) Accumulated Latency — every hop adds cost and delay. (5) Misaligned Scaling — Kafka scales by partitions, microservices by CPU, causing lag. (6) Fractured Observability — RCA requires cross-team coordination. (7) Intricate Dependencies — one small change ripples everywhere.",
            "The 'Infrastructure Glue Tax': massive engineering effort wasted on maintaining connections between tools instead of building features.",
            "Even fully managed Kafka (MSK, Confluent) only solves the broker — customers are still responsible for the entire processing layer.",
            "Fragmentation symptoms: multiple independent pipelines, SQL transformation graphs, microservices for every rule, duplicate data flows, manual scaling, and unpredictable costs.",
        ],
        discoveryQuestions: [
            "When a traffic burst hits, does your ingestion handle it or do your consumers lag?",
            "If you need to change an alert threshold, is that a simple config update or a full deployment?",
            "How many teams need to be involved when there's a production incident in your pipeline?",
            "Are new use cases coming faster than your platform can support them?",
            "Does your Kafka scale by partitions while your microservices scale by CPU? Do you see lag even when servers look healthy?",
        ],
        objectionHandles: {
            "our team manages it fine": "How much of your engineering bandwidth is spent on maintaining and scaling the pipeline versus building new features? Most teams are at 60%+ on infra maintenance at scale.",
            "we have observability tools": "Having tools like Datadog and CloudWatch is great, but how many tabs do you open to find a root cause? Condense gives you a single unified view across the entire pipeline.",
        }
    },
    {
        id: "byoc-security",
        title: "BYOC Security, Compliance & Data Residency",
        summary: "For regulated industries (banking, healthcare, automotive, government), data residency is a non-negotiable, board-level requirement. Condense's BYOC model means the software runs inside the customer's cloud account — data physically never leaves their VPC or VNet.",
        keyFacts: [
            "BYOC = Bring Your Own Cloud. Condense deploys into the customer's AWS, Azure, or GCP account.",
            "Uses the customer's existing networking, IAM, security groups, and governance policies.",
            "Nothing leaves the customer's environment — Kafka remains inside their VPC/VNet at all times.",
            "Condense is the only deployment model accepted by banks, healthcare systems, and governments with strict data sovereignty laws.",
            "BYOC aligns with the customer's Enterprise Discount Program (EDP) — spend on Condense infrastructure counts toward their cloud commitment.",
            "Condense is SOC2 Type II compliant.",
            "Pattern 4 ('Fast-Track'): If a prospect says 'Data cannot leave our VPC' or 'We need BYOC', stop the standard pitch and immediately focus on Security and Governance — this is often a budget-unlocking conversation.",
        ],
        discoveryQuestions: [
            "Is data residency a regulatory requirement for your team?",
            "Does your organization have policies around data leaving your cloud perimeter?",
            "Do you have an Enterprise Discount Program (EDP) commitment with AWS, Azure, or GCP?",
            "Who in your organization owns the security and compliance decision for new infrastructure?",
        ],
        objectionHandles: {
            "we can't use saas": "Condense isn't traditional SaaS — it deploys fully inside your cloud account. Your data never leaves your VPC, ever.",
            "security won't approve it": "Because Condense runs inside your own cloud account using your existing IAM and security groups, your security team simply needs to review the deployment template — there are no external data flows to approve.",
        }
    },
    {
        id: "tco-cost",
        title: "Total Cost of Ownership & ROI",
        summary: "Condense replaces 5-10+ fragmented tools and services, resulting in a 40-70% total cost reduction for most customers. The savings come from eliminating redundant compute, reducing dedicated SRE headcount for Kafka ops, and consolidating licensing.",
        keyFacts: [
            "At 30TB/month scale, typical customers see 60-70% cost reduction versus AWS MSK because they pay cloud infra only — no Confluent license on top.",
            "Condense is infrastructure-based, BYOC pricing — no per-message fees like Confluent Cloud.",
            "Removes the cost of dedicated 'Kafka SREs' — provisioning, scaling, upgrades, balancing, and failover are all managed by Condense.",
            "The 'Infrastructure Glue Tax' is eliminated: engineering time wasted on infrastructure maintenance is redirected to product features.",
            "EDP alignment: BYOC infrastructure spend counts toward the customer's cloud provider commitment, reducing net spend.",
            "Layer 2 (Processing) yields the highest long-term margins because business logic is 'sticky' and high-value.",
        ],
        discoveryQuestions: [
            "How many dedicated engineers are currently managing your Kafka infrastructure?",
            "What does your current Confluent or MSK bill look like at your current scale?",
            "What percentage of your engineering time is spent on infrastructure versus product features?",
            "Do you have an EDP commitment with your cloud provider that BYOC infra spend could count toward?",
        ],
        objectionHandles: {
            "budget is frozen": "Condense typically replaces budget already allocated across 5+ tools. It's a reallocation, not a net-new spend.",
            "confluent is cheaper": "Confluent's per-message pricing scales non-linearly. Once you cross 10TB/month, the licensing costs typically exceed the infrastructure. Condense has no per-message fees.",
        }
    },
    {
        id: "persona-developer",
        title: "Talking to Senior Backend Engineers / Platform Engineers",
        summary: "Engineers care about developer experience, operational simplicity, and technical credibility. They want to eliminate Kafka config hell, reduce on-call burden, and ship faster without managing a distributed system.",
        keyFacts: [
            "Kafka rebalancing causes consumer downtime — Condense handles partition reassignment seamlessly.",
            "Developers define pipelines in code using a full IDE with Git integration, review/approval workflows, and version control.",
            "No Zookeeper — Condense eliminates the Zookeeper ensemble entirely. No more 3-node ensemble management.",
            "Auto-scaling eliminates manual partition tuning — no more waking up at 3am to rebalance.",
            "Condense handles hot upgrades on live pipelines without consumer lag or restart required.",
            "A developer with no Kafka expertise can go from setup to a working pipeline in under a day using no-code blocks.",
            "AI dev assistant generates pipeline logic and validates configurations — juniors perform at a senior level.",
            "Prebuilt connectors eliminate connector boilerplate code.",
            "Observability built-in — consumer lag, throughput, and errors in one view.",
        ],
        discoveryQuestions: [
            "How painful are Kafka consumer group rebalances in your environment?",
            "How long does it take to onboard a new engineer to contribute to the pipeline?",
            "Are you managing Zookeeper or have you moved to KRaft mode?",
            "What does a rolling upgrade look like for your Kafka cluster today?",
            "How much time does your team spend tuning partitions and consumer group configs?",
        ],
        objectionHandles: {
            "we know kafka well": "Kafka expertise is valuable, but the goal isn't to make Kafka harder to use — it's to make the logic layer above Kafka frictionless. Condense lets your Kafka experts focus on architecture, not on partition rebalancing at 3am.",
            "we don't want vendor lock-in": "Condense is Kafka-native and uses standard Kafka protocols. Your existing clients, tools, and Kafka expertise all transfer directly.",
        }
    },
    {
        id: "persona-vp",
        title: "Talking to VPs of Engineering / Product",
        summary: "VPs care about velocity, hiring leverage, and hitting product milestones. They want to know: how does this reduce headcount dependency, how fast can my team ship, and what does this do to our cost structure?",
        keyFacts: [
            "A junior engineer can go from zero Kafka experience to shipping a working pipeline in under a day using Condense's visual no-code blocks and guided SDK.",
            "Democratizes pipeline building: analysts handle simple flows, engineers handle complex logic — all within the same Git-based lifecycle.",
            "Reduces the number of specialists required for Kafka operations — no dedicated SRE team needed for Kafka tuning.",
            "The AI assistant acts as a senior advisor — junior engineers perform at a senior level, reducing the need to hire expensive specialists.",
            "Condense lets teams ship new business rules in minutes (config update) instead of weeks (new microservice deployment).",
            "Infrastructure-based pricing, no per-message fees — cost grows linearly with usage, not exponentially.",
            "Auto-scaling means the platform can 5x event volume during peak season without manual intervention.",
            "Unified observability reduces MTTR — fewer P1 incidents and faster recovery when issues occur.",
            "BYOC satisfies compliance and legal requirements that would otherwise block product launches.",
        ],
        discoveryQuestions: [
            "How many engineers does it take to onboard a new real-time use case today?",
            "How often do infrastructure issues block your product team's roadmap?",
            "What's your current hiring plan for Kafka specialists or platform engineers?",
            "Are new streaming use cases coming faster than your engineering capacity can support them?",
            "What metric matters more for you this year — cost control or delivery speed?",
        ],
        objectionHandles: {
            "our team is already busy": "That's exactly the problem Condense solves. Your team is currently spending most of their capacity on infrastructure maintenance. Condense redirects that to product features.",
            "we need to hire more engineers first": "Condense is designed to give you the leverage of 2-3x the engineers without actually hiring them. One platform engineer managing Condense can replace an entire Kafka SRE team.",
        }
    },
    {
        id: "persona-executive",
        title: "Talking to CTOs / C-Suite Executives",
        summary: "Executives care about strategic risk, TCO, compliance, and competitive velocity. The pitch is simple: Condense reduces your cloud bill, eliminates data compliance risk, and accelerates your ability to ship real-time AI products.",
        keyFacts: [
            "Real-time Streaming & Analytics market is $150B by 2030 — companies not operating in real-time are already losing competitive ground.",
            "50,000+ companies globally use Apache Kafka. The majority successfully manage the broker but fail at the processing layer — where Condense plays.",
            "Condense is the ONLY platform that satisfies both strict data residency (BYOC) and full pipeline management.",
            "99.99% SLA with dedicated enterprise support and a named account engineer.",
            "At scale (30TB/month+), customers see 60-70% TCO reduction versus MSK + Confluent licensing.",
            "EDP alignment: BYOC infrastructure spend counts toward cloud provider commitments, reducing net cost.",
            "SOC2 Type II compliant. All data residency and governance requirements met inside the customer's VPC.",
            "Condense eliminates the 'Infrastructure Glue Tax' — the hidden cost of engineering time wasted on maintaining disjointed tools.",
            "AI-first platform positions customers to build real-time AI products at a time when AI requires continuous, low-latency streaming inputs.",
        ],
        discoveryQuestions: [
            "What's your current annual spend on MSK or Confluent, and is it growing linearly or faster?",
            "Is data residency a board-level compliance requirement for your organization?",
            "What is the single biggest bottleneck for your engineering team right now?",
            "Are you seeing your competitors outpace you in real-time data products or features?",
            "Do you have an EDP commitment with your cloud provider?",
        ],
        objectionHandles: {
            "we're happy with our current stack": "Being 'happy' with a fragmented stack is often a sign that your team has adapted to the limitations rather than eliminated them. What does your future architecture need to support — real-time AI pipelines at 10x scale?",
            "not a priority right now": "Every month you delay is a month your engineering team is paying the Infrastructure Glue Tax — wasting headcount on maintenance instead of innovation. The ROI is achieved in the first quarter.",
        }
    },
    {
        id: "zeliot-case-study",
        title: "Case Study: Zeliot (Mobility / Fleet Management)",
        summary: "Zeliot is a real-time fleet intelligence platform that processes millions of vehicle events per day. They are a textbook Condense customer: high input diversity (GPS, CAN bus, OBD-II sensors), always-on telemetry, strict data residency requirements, and a growing gap between use cases and engineering bandwidth.",
        keyFacts: [
            "Zeliot uses Kafka as the backbone for fleet telemetry: location, fuel levels, driver behavior, engine diagnostics.",
            "Input diversity: data from GPS trackers, in-vehicle sensors (OBD-II, CAN bus), partner APIs, and mobile apps.",
            "Real-time requirements: crash detection, geofence alerts, predictive maintenance — sub-second latency is non-negotiable.",
            "Before Condense: isolated microservices for each alert type, separate scaling policies, fragmented observability across CloudWatch and custom logging.",
            "With Condense: unified Logic Plane handles enrichment, routing, and alerting in one place — BYOC inside their cloud.",
            "Result: engineering team redirected from infra maintenance to building new fleet intelligence features.",
        ],
        discoveryQuestions: [
            "What types of devices or sensors send data into your platform today?",
            "How do you handle sub-second alerting requirements — crash detection, battery anomalies?",
            "When a fleet event is missed or delayed, what is the downstream business impact?",
        ],
        objectionHandles: {}
    }
];

/**
 * Get the most relevant knowledge sections for a given Boss Persona and conversation stage.
 * Returns the knowledge as a compact string for prompt injection.
 */
export function getKnowledgeForPersona(personaId: string, stage: number): string {
    // Core product knowledge is always included
    const sections = [
        CONDENSE_KNOWLEDGE.find(k => k.id === "product-core")!,
        CONDENSE_KNOWLEDGE.find(k => k.id === "problem-fragmentation")!,
    ];

    // Add persona-specific section
    if (personaId === 'developer') {
        sections.push(CONDENSE_KNOWLEDGE.find(k => k.id === "persona-developer")!);
    } else if (personaId === 'vp') {
        sections.push(CONDENSE_KNOWLEDGE.find(k => k.id === "persona-vp")!);
    } else if (personaId === 'executive') {
        sections.push(CONDENSE_KNOWLEDGE.find(k => k.id === "persona-executive")!);
        sections.push(CONDENSE_KNOWLEDGE.find(k => k.id === "tco-cost")!);
    }

    // Add BYOC section when security/compliance is likely to come up (stages 2+)
    if (stage >= 2) {
        sections.push(CONDENSE_KNOWLEDGE.find(k => k.id === "byoc-security")!);
    }

    // Add case study for context richness at later stages
    if (stage >= 3) {
        sections.push(CONDENSE_KNOWLEDGE.find(k => k.id === "zeliot-case-study")!);
    }

    // Format as clean text for prompt injection
    return sections.filter(Boolean).map(s => `
=== ${s.title.toUpperCase()} ===
${s.summary}

Key Facts:
${s.keyFacts.map(f => `• ${f}`).join('\n')}

Discovery Questions this persona asks:
${s.discoveryQuestions.map(q => `• ${q}`).join('\n')}
`.trim()).join('\n\n');
}
