import React from 'react';
import { Target, AlertTriangle, Cloud, Zap, Layers, Server, Search, CheckCircle, Shield, TrendingUp, Handshake, Users, Database } from 'lucide-react';

export type ContentStep = {
    id: string;
    type: 'info' | 'list';
    title: string;
    subtitle?: string;
    icon: React.ReactNode;
    items?: string[];
    content?: string[];
};

export type QuizQuestion = {
    id: string;
    question: string;
    options: string[];
    correctAnswerIndex: number;
    explanation: string;
};

export type Module = {
    id: string;
    title: string;
    description: string;
    content: ContentStep[];
    quiz: QuizQuestion[];
};

export const playbookData: Module[] = [
    {
        id: "module-1",
        title: "Module 1: What is Condense & The Architecture Problem",
        description: "Understand cloud-native streaming architectures, why they fragment over time, and how Condense unifies them.",
        content: [
            {
                id: "m1-intro",
                type: "info",
                title: "What is Condense?",
                subtitle: "The Elevator Pitch",
                icon: <Zap className="w-6 h-6 text-primary" />,
                content: [
                    "Condense is an AI-first, Kafka-native streaming platform that helps teams build, run, and scale real-time data pipelines inside their own cloud (BYOC).",
                    "It eliminates the 'microservice sprawl' typical of modern streaming architectures by unifying ingestion, transformation, processing, and delivery into a single, clean system.",
                    "Core Value Proposition: Unified Platform (replaces Connectors + Kafka + KSQL + Microservices + Observability), Zero-Ops Overhead (Fully managed inside customer's cloud), Developer Velocity (No-Code, Low-Code, and AI-assisted workflows)."
                ]
            },
            {
                id: "m1-architecture",
                type: "info",
                title: "Cloud-Native Streaming Architecture Today",
                subtitle: "The Fragmentation Problem",
                icon: <Layers className="w-6 h-6 text-accent" />,
                content: [
                    "Modern architectures across AWS, Azure, and GCP are built by stitching together cloud services, compute functions, cloud streaming services, object storage, custom microservices, and Kafka.",
                    "Even with managed Kafka (AWS MSK, Confluent, Aiven), organizations still operate a complex mix of independent pipelines, SQL/KSQL chains, custom microservices, and fragmented observability.",
                    "Kafka provides durability and ordering, but Kafka does not manage transformations, business rules, multi-step workflows, or alerting data. That surrounding complexity becomes fragile and expensive."
                ]
            },
            {
                id: "m1-forces",
                type: "list",
                title: "Forces Breaking Real-Time Architecture",
                subtitle: "Why architectures become challenging over time",
                icon: <AlertTriangle className="w-6 h-6 text-destructive" />,
                items: [
                    "Real-Time Workloads are continuous, but Cloud Systems are not (mismatched tempos).",
                    "Pipeline 'Memory' is scattered across Kafka, SQL tables, caches, and storage.",
                    "Logic spreads across microservices and SQL as new use cases appear.",
                    "Multi-Step pipelines accumulate latency.",
                    "Scaling signals are not aligned across components.",
                    "Observability spreads across multiple tools requiring cross-team debugging."
                ]
            },
            {
                id: "m1-fit",
                type: "info",
                title: "Where Condense Fits",
                subtitle: "Consolidated Execution Plane",
                icon: <Target className="w-6 h-6 text-primary" />,
                content: [
                    "Condense runs fully inside the Customer's Cloud (BYOC) - full control and data residency without external dependencies.",
                    "It acts as a Unified Execution Engine where teams define enrichments, filters, joints, windows, and routing, replacing fragmented paths.",
                    "It offers No-Code, Low-Code, and Full-Code (IDE + Git workflows) combined with AI-first assistance for generating logic and testing."
                ]
            }
        ],
        quiz: [
            {
                id: "q1-1",
                question: "What is the primary factor driving the 'fragility' of modern real-time architectures even when using a managed Kafka service?",
                options: [
                    "Managed brokers eventually hit strict cloud account IOPS limits under load.",
                    "Surrounding logic like KSQL chains and custom microservices remain highly fragmented.",
                    "Cloud providers throttle throughput on unmanaged topics automatically.",
                    "Python microservices cannot process stream aggregations quickly enough."
                ],
                correctAnswerIndex: 1,
                explanation: "While managed Kafka solves broker operations, the surrounding logic (microservices, KSQL chains, routing) becomes highly complex and fragmented."
            },
            {
                id: "q1-2",
                question: "Which of the following strictly describes the Condense 'BYOC' deployment model?",
                options: [
                    "Condense hosts your Kafka cluster in their own isolated, multi-tenant AWS organisation.",
                    "Condense deploys inside the customer's cloud boundary aligning with local IAM policies.",
                    "Condense requires migrating all workloads off of public clouds into a private colo.",
                    "Condense provisions an independent Kubernetes cluster inside the Condense SaaS environment."
                ],
                correctAnswerIndex: 1,
                explanation: "BYOC (Bring Your Own Cloud) means Condense deploys directly into the customer's cloud account, ensuring total data residency and alignment with local security policies."
            },
            {
                id: "q1-3",
                question: "According to the playbook, what is a structural 'force' that breaks real-time architectures over time?",
                options: [
                    "State becomes scattered and duplicated across Kafka, databases, caches, and object storage.",
                    "Standard AWS S3 object storage eventually becomes too expensive for raw event retention.",
                    "Data engineers struggle to write efficient PySpark logic for continuous streaming.",
                    "Apache Kafka eventually drops historical messages when partitions approach capacity."
                ],
                correctAnswerIndex: 0,
                explanation: "As pipelines grow, state is stored in multiple different areas (Kafka for events, SQL for history, cache for lookups), causing duplicates and consistency challenges."
            },
            {
                id: "q1-4",
                question: "How does Condense solve the problem of disconnected pipeline development?",
                options: [
                    "By replacing all microservices with massive, centralised PostgreSQL relational tables.",
                    "By forcing developers to write only in Rust for deterministic, low-latency execution.",
                    "By outsourcing transformation logic generation to third-party consulting integrators.",
                    "By uniting No-Code visual operators and a Full-Code Git-backed IDE in one engine."
                ],
                correctAnswerIndex: 3,
                explanation: "Condense consolidates logic creation by offering simple visual operators alongside an IDE for complex Git-backed code in one execution engine."
            },
            {
                id: "q1-5",
                question: "What happens to 'Observability' in a standard, fragmented streaming architecture?",
                options: [
                    "It is automatically aggregated and resolved centrally by tools like Datadog and Splunk.",
                    "It spreads across multiple toolsets, making cross-team root cause analysis incredibly slow.",
                    "It becomes entirely unnecessary because managed Kafka clusters operate with zero downtime.",
                    "It is usually blocked permanently by default cross-account IAM restrictive policies."
                ],
                correctAnswerIndex: 1,
                explanation: "Troubleshooting typically requires navigating many different toolsets, making incident response slow and reliant on multiple teams."
            }
        ]
    },
    {
        id: "module-2",
        title: "Module 2: Identifying the Ideal Customer Profile (ICP)",
        description: "Learn how to spot Condense opportunities across the Mobility landscape.",
        content: [
            {
                id: "m2-icp",
                type: "list",
                title: "Signs of an Ideal Customer",
                subtitle: "What to look for in their architecture and data",
                icon: <Search className="w-6 h-6 text-primary" />,
                items: [
                    "High Input Diversity: Ingesting from multiple independent sources with inconsistent formats.",
                    "Continuous Event Flow: Streaming user activity, device telemetry, logistics checks (Always-On data).",
                    "Combined Workloads: Have both live transformations and periodic/ETL jobs running.",
                    "Multi-Team Involvement: Platform, backend, data, and SRE teams are all needed to push an update.",
                    "Cost Driven by Fragmentation: Paying for redundant compute, independent scaling silos, and heavy SRE load."
                ]
            },
            {
                id: "m2-mobility",
                type: "info",
                title: "The Mobility Landscape ICP",
                subtitle: "Key Verticals that need Condense",
                icon: <TrendingUp className="w-6 h-6 text-accent" />,
                content: [
                    "Digital-First Fleet Management: Ingesting millions of vehicle events (location, fuel, alerts).",
                    "Vehicle OEMs (EV & ICE): Massive telemetry streams from ECU and CAN.",
                    "Cold Chain & Reefer Logistics: Strict temperature/humidity event monitoring with SLA triggers.",
                    "Shared Mobility & Gig Platforms: Millions of trip, pricing, and matching events.",
                    "Port/Container Logistics: Real-time event syncing between terminals, cranes, and logistics systems."
                ]
            },
            {
                id: "m2-market",
                type: "info",
                title: "Market Size & Position",
                subtitle: "Bigger than 'Streaming Analytics'",
                icon: <Database className="w-6 h-6 text-primary" />,
                content: [
                    "The real-time data market is large and expanding. Operational event processing will top $147B by 2031.",
                    "Condense addresses three layers: Data Ingestion (Kafka), Real-Time Processing (Transformation/Workflows), and Operations/Governance (Scaling/Visibility).",
                    "Almost 50,000 companies globally use Apache Kafka today. This is our target execution space."
                ]
            },
            {
                id: "m2-pitch",
                type: "info",
                title: "The Pitch to a CTO / CIO",
                icon: <Users className="w-6 h-6 text-accent" />,
                content: [
                    "When talking to connected vehicle executives, the pitch is about Consolidation and Speed.",
                    "Pitch: 'Condense unifies your Kafka-based real-time pipelines into a single platform inside your cloud, reducing architectural sprawl and operational overhead. This enables faster delivery of connected vehicle capabilities with higher reliability and lower cost.'"
                ]
            }
        ],
        quiz: [
            {
                id: "q2-1",
                question: "Which of the following is a primary indicator that an organisation is an ideal fit for Condense?",
                options: [
                    "They rely heavily on scheduled, overnight ETL batches for reporting dashboards.",
                    "Simple logic updates require coordination between Platform, Backend, Data, and SRE teams.",
                    "They have a single, massive legacy mainframe pointing to a structured SQL database.",
                    "They refuse to run any multi-tenant infrastructure anywhere inside their own cloud."
                ],
                correctAnswerIndex: 1,
                explanation: "When pipeline updates require coordination across multiple isolated teams, Condense’s unified platform dramatically speeds up delivery."
            },
            {
                id: "q2-2",
                question: "How does Condense fit into 'Cold Chain & Reefer Logistics'?",
                options: [
                    "It sells IoT-enabled hardware refrigeration monitoring units.",
                    "It acts as a driver HR & payroll orchestration platform.",
                    "It manages satellite GPS tracking integrations for cross-border routes.",
                    "It handles real-time ingestion and SLA enforcement for temperature streams."
                ],
                correctAnswerIndex: 3,
                explanation: "Cold chain logistics rely heavily on strict sensor SLAs (alerts for temperature drops in real-time), which is a perfect use case for Kafka-native stream processing."
            },
            {
                id: "q2-3",
                question: "According to the playbook, which three architectural layers does Condense address to calculate its addressable market?",
                options: [
                    "Data Ingestion, Real-Time Processing, and Operations/Governance.",
                    "Frontend UI Frameworks, CSS Styling engines, and Static Image Delivery.",
                    "Financial Auditing trails, Marketing Analytics, and CRM pipelines.",
                    "Hardware Procurement, Preventative Fleet Maintenance, and Driver safety."
                ],
                correctAnswerIndex: 0,
                explanation: "Condense consolidates the Transport layer (Kafka), the Workflow layer (Transforms), and the Governance layer (Scaling/Visibility)."
            },
            {
                id: "q2-4",
                question: "When pitching to a VP Engineering / VP Mobility Platforms, what is typically their primary pain point?",
                options: [
                    "The engineering team struggles to recruit senior developers who know Java.",
                    "Architectural fragmentation dictates that new features span multiple services.",
                    "They want to move their entire cloud infrastructure back into an on-premise server.",
                    "They believe Kafka brokers themselves are inherently too slow for their traffic."
                ],
                correctAnswerIndex: 1,
                explanation: "Engineering VP's feel the pain of 'sprawl' directly via slow feature delivery and massive maintenance overhead created by fragmented microservices."
            },
            {
                id: "q2-5",
                question: "Why does Condense represent a market significantly larger than traditional 'Streaming Analytics' alone?",
                options: [
                    "Because it also manufactures physical telematics tracking devices for vehicles.",
                    "Because it is managed entirely by an open-source non-profit entity.",
                    "Because it forces customers into buying proprietary Condense-branded servers.",
                    "Because it unifies Kafka, workflows, and operations, replacing multiple siloed tools."
                ],
                correctAnswerIndex: 3,
                explanation: "By controlling the Kafka brokers, the logic engines, and the operational dashboards, Condense eats up budgets normally spent across multiple fragmented platforms."
            }
        ]
    },
    {
        id: "module-3",
        title: "Module 3: Win Patterns, Competition & Objections",
        description: "Learn how to position Condense against competitors like Confluent and AWS MSK, and how to handle objections.",
        content: [
            {
                id: "m3-wins",
                type: "list",
                title: "Why Teams Switch to Condense",
                subtitle: "The tipping points against Managed Services",
                icon: <CheckCircle className="w-6 h-6 text-primary" />,
                items: [
                    "Managed Kafka (like MSK) solves the brokers, but NOT the pipelines. The surrounding SQL/Microservices become a burden.",
                    "They want Kafka, processing, deployment, and observability all in one place.",
                    "They demand predictable cost (reduced infrastructure footprint).",
                    "They want cloud control and compliance via BYOC, avoiding multi-tenant SaaS vendors.",
                    "They need to accelerate delivery cycles without rewriting their event backbone."
                ]
            },
            {
                id: "m3-confluent",
                type: "info",
                title: "Competitive Positioning: Confluent & MSK",
                subtitle: "How to differentiate",
                icon: <Shield className="w-6 h-6 text-accent" />,
                content: [
                    "Versus Confluent: Highlight that Condense delivers the same Kafka compatibility, but via a highly cost-effective BYOC model combined with a unified processing/transform layer built directly in.",
                    "Versus AWS MSK: MSK removes broker operations, but its cost grows quickly and leaves the processing puzzle to the user. Condense acts as the managed MSK layer PLUS the pipeline orchestration above it."
                ]
            },
            {
                id: "m3-redpanda",
                type: "info",
                title: "Competitive Positioning: Redpanda & DIY Kafka",
                icon: <Server className="w-6 h-6 text-primary" />,
                content: [
                    "Versus Redpanda: Redpanda focuses on replacing the broker. Condense replaces the broker AND the surrounding microservices/SQL flows. If the customer just wants a fast broker, Redpanda. If they want to simplify their whole architecture, Condense.",
                    "Versus DIY Kafka: DIY is expensive to run and scale. Condense takes over operations fully inside their cloud, cutting SRE overhead drastically."
                ]
            },
            {
                id: "m3-objections",
                type: "list",
                title: "Handling Objections",
                icon: <Handshake className="w-6 h-6 text-destructive" />,
                items: [
                    "'This has to go through Central IT': Emphasize that Condense is BYOC. It runs entirely within their existing pre-approved network and IAM bounds.",
                    "'This looks like a major investment': Pivot to the reality that they don't replace Kafka or rewrite everything at once. They can move one pipeline over (like decoding or alerting) to prove value.",
                    "'We don't have bandwidth to evaluate': Condense handles the deployment into their cloud and builds the first pipeline for them to prove the concept in hours."
                ]
            }
        ],
        quiz: [
            {
                id: "q3-1",
                question: "When a customer objects 'We already use AWS MSK', what is the most effective strategic response?",
                options: [
                    "Assert that MSK is notoriously unstable and must be migrated immediately.",
                    "Condense only operates on Microsoft Azure, so a total migration is required regardless.",
                    "Explain that Condense runs as a stateless Lambda function layer strictly on top of MSK.",
                    "Highlight that Condense manages the brokers but also adds a unified transform and routing layer."
                ],
                correctAnswerIndex: 3,
                explanation: "MSK only solves the broker layer. Condense is a better MSK that also solves the complex processing and orchestration layers above it."
            },
            {
                id: "q3-2",
                question: "How should you position Condense accurately against Redpanda?",
                options: [
                    "Redpanda optimizes broker storage, but Condense simplifies the entire pipeline (broker, microservices, and SQL).",
                    "Redpanda focuses on batch analytics workflows, while Condense focuses on low-latency marketing integrations.",
                    "Condense operates using a significantly faster foundational streaming protocol than Redpanda.",
                    "Condense actually uses Redpanda as its underlying default local storage engine."
                ],
                correctAnswerIndex: 0,
                explanation: "Redpanda is a powerful infrastructure component, but it doesn't solve the sprawling microservices and transformations built on top of the streaming layer. Condense does both."
            },
            {
                id: "q3-3",
                question: "What is the key defensive response if a prospect says 'This has to be approved by strict Central IT data residency policies'?",
                options: [
                    "Suggest bypassing IT approval entirely by utilizing a temporary API token.",
                    "Ensure them that Condense does not ever store plaintext passwords.",
                    "Condense deploys natively inside their cloud, adhering entirely to their existing IAM governance.",
                    "Offer to store the data offshore in alternate regions for a reduced compliance cost."
                ],
                correctAnswerIndex: 2,
                explanation: "BYOC (Bring Your Own Cloud) neutralizes data-residency arguments because data never leaves the customer's VPC."
            },
            {
                id: "q3-4",
                question: "Why do platform teams using 'DIY' (Do It Yourself) Open Source Kafka frequently switch to Condense?",
                options: [
                    "Open Source Kafka commercial licensing costs eventually scale too high.",
                    "Native DIY Apache Kafka does not natively support JSON message parsing.",
                    "DIY Kafka deployments fail to comply with modern European data sovereignty laws.",
                    "Tuning, scaling, and upgrading clusters wastes an immense amount of SRE hours."
                ],
                correctAnswerIndex: 3,
                explanation: "The operational burden of running resilient open-source Kafka at scale is immense, prompting teams to adopt a managed BYOC solution."
            },
            {
                id: "q3-5",
                question: "What phrasing should you absolutely NEVER use in positioning Condense during a pitch?",
                options: [
                    "Stating that Condense provides highly scalable throughput capabilities.",
                    "Saying 'Condense replaces Kafka' or referring to Condense purely as an 'ETL tool.'",
                    "Explaining that Condense runs natively on AWS public infrastructure.",
                    "Promoting the fact that Condense offers built-in No-Code building blocks."
                ],
                correctAnswerIndex: 1,
                explanation: "You must never say 'Condense replaces Kafka' (it manages Kafka) or 'Condense is an ETL tool' (it handles real-time operations, not just analytics batches), as it creates mispositioning."
            }
        ]
    },
    {
        id: "module-4",
        title: "Module 4: Roadmap, Pricing & Customer Support",
        description: "Understand the AI-First Condense roadmap, vCPU pricing, and highlight proven fleet customer wins.",
        content: [
            {
                id: "m4-roadmap",
                type: "list",
                title: "The AI-First Roadmap (until Dec 2026)",
                subtitle: "Self-optimizing, Developer-assistive platforms.",
                icon: <Cloud className="w-6 h-6 text-primary" />,
                items: [
                    "Kafka Agent: Automates tasks like creating topics, fetching metadata, and fetching consumer lag.",
                    "Kubernetes & Grafana Agents: Reads deployed connector logs, summarizes runtime behavior, and explains root causes of Grafana alerts directly.",
                    "Developer & Pipeline Agent: Generates natural-language-to-pipeline logic, creates test suites, and safely refactors code.",
                    "Auto-Optimization: Future ML models to self-adjust scaling behavior, parallelism, and backpressure handling automatically."
                ]
            },
            {
                id: "m4-pricing",
                type: "info",
                title: "Pricing Methodology",
                subtitle: "Transparent and predictable sizing",
                icon: <Zap className="w-6 h-6 text-accent" />,
                content: [
                    "Unlike Kafka deployments that hide costs in partition complexity, Condense prices based on actual Platform Usage Patterns (vCPU hours).",
                    "There is a Base License Fee (e.g., $5,000 standard) covering up to 10MBps workloads / 14400 vCPU hours.",
                    "To provide a precise quote, SEs only need: 1) Average read/write Throughput (MBps), 2) Retention Days, 3) Fan-out per topic, 4) Cloud Provider, and 5) Region."
                ]
            },
            {
                id: "m4-wins",
                type: "list",
                title: "Recent Customer Wins",
                subtitle: "Proven value in Mobility and Logistics",
                icon: <TrendingUp className="w-6 h-6 text-primary" />,
                items: [
                    "Volvo Eicher Commercial Vehicles: Replaced IBM Event Streams with Condense BYOC using direct hardware connectors.",
                    "Ashok Leyland: Used Condense as their fully managed SaaS backend for their Connected Fleet system 'iAlert'.",
                    "Adani Port Operations: Shifted to Condense to manage and sync real-time data from assets across pan-India ports.",
                    "Hero Motocorp & Royal Enfield: Leveraging Condense as the core streaming data backbone for scale up connected vehicle platforms."
                ]
            }
        ],
        quiz: [
            {
                id: "q4-1",
                question: "What is the primary operational function of the 'Grafana Monitoring Agent' outlined in the Condense AI Roadmap?",
                options: [
                    "It automatically redesigns customer-facing logos inside Grafana dashboards.",
                    "It automatically invoices the customer when they exceed their data throughput limit.",
                    "It completely rewrites the entirety of the customer's KSQL logic overnight.",
                    "It interprets alerts and explains root causes utilizing PromQL and K8s logs."
                ],
                correctAnswerIndex: 3,
                explanation: "The Grafana agent directly assists SREs by contextualising alerts and identifying the root cause logs instantly."
            },
            {
                id: "q4-2",
                question: "To configure an accurate and predictable pricing quote for a prospect, which operational metric is the most critical?",
                options: [
                    "Average Read/Write Throughput strictly measured in MBps.",
                    "The number of isolated microservices they currently operate in production.",
                    "The exact number of backend infrastructure engineers currently on the team.",
                    "The prospect's total projected annual recurring revenue for the quarter."
                ],
                correctAnswerIndex: 0,
                explanation: "Throughput (MBps) dictates the required scale of the Kafka cluster and the execution engines, serving as the basis for vCPU-hour calculation."
            },
            {
                id: "q4-3",
                question: "According to the playbook, how are capacity overages priced when moving beyond the initial Base License Fee limit?",
                options: [
                    "Pipelines are securely throttled or shut off until the next billing cycle.",
                    "Incremental charges are flatly calculated based on per-partition usage.",
                    "Overages are charged based on total customer relational database size.",
                    "Overages are charged incrementally per vCPU-hour consumed by the platform."
                ],
                correctAnswerIndex: 3,
                explanation: "Condense uses transparent vCPU-hour pricing to manage bursts and overages predictably rather than hiding cost behind Kafka partition counts."
            },
            {
                id: "q4-4",
                question: "Why did Volvo Eicher Commercial Vehicles strategically transition to the Condense platform?",
                options: [
                    "To launch their first mobile application natively onto the iOS App Store.",
                    "To acquire free, limitless Kafka architectural consulting hours from Condense SEs.",
                    "To replace IBM Event Streams with Condense BYOC using direct hardware integrations.",
                    "To migrate their internal employee payroll system to a real-time event stream."
                ],
                correctAnswerIndex: 2,
                explanation: "Volvo Eicher replaced extremely expensive/legacy IBM tools with Condense BYOC to scale their 'MyEicher' FMS product."
            },
            {
                id: "q4-5",
                question: "What mechanic does Condense plan to introduce to help customers rapidly evaluate the platform with zero friction?",
                options: [
                    "A mandatory 3-month paid consulting phase led by Solutions Architects.",
                    "A fully functional 1-month Try-For-Free trial hosted directly inside the customer's cloud.",
                    "Shipping physical demonstration servers directly to the customer's global offices.",
                    "Signing a multi-year restrictive enterprise contract with an opt-out clause."
                ],
                correctAnswerIndex: 1,
                explanation: "Condense allows teams to experience the real, managed-Kafka BYOC deployment risk-free for a month to demonstrate value quickly."
            }
        ]
    }
];
