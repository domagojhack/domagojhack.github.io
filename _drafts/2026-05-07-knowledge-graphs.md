---
layout: post
title: What is a knowledge graph?
date: 2026-05-07
description: A structured introduction to knowledge graphs — what they are, how they work, and why they matter for science and AI.
category: ai
tags: [knowledge graph, graph database, ontology, RAG, AI, semantic web]
---

Data is only as useful as the connections you can draw from it. A spreadsheet tells you that a species was observed at a location on a date. A knowledge graph tells you that the species *belongs to* a genus, the genus *is part of* a family, the location *lies within* a protected area, and the date *falls inside* a drought period recorded by a climate model. The difference is the explicit encoding of relationships — and that is what knowledge graphs do.

## The basic idea

A knowledge graph is a network of entities and the typed relationships between them. Formally, it is a collection of **triples**:

```
(subject) — [predicate] → (object)
```

For example:

```
(Python)        — [is a]         → (programming language)
(GeoPandas)     — [depends on]   → (Shapely)
(Shapely)       — [implements]   → (OGC Simple Features)
(Domagoj)       — [authored]     → (toolkit post)
(toolkit post)  — [published on] → (2025-07-27)
```

Chain enough triples together and you get a graph where you can ask questions that no single table could answer:

> *Which posts were authored by someone who uses a library that implements OGC Simple Features?*

A graph database traverses that chain in milliseconds; a relational database would require three or four JOINs — if the schema even modelled it at all.

## Nodes, edges, and labels

The vocabulary is simple:

| Term | Meaning |
|------|---------|
| **Node** (or entity) | A thing — a person, a place, a concept, a document |
| **Edge** (or relation) | A directed, labelled connection between two nodes |
| **Triple** | One (subject, predicate, object) statement |
| **Ontology** | The schema — the defined set of entity types and allowed relations |

The critical word in "labelled connection" is *labelled*. Generic graphs have edges; knowledge graphs have edges with meaning. `is_a`, `part_of`, `located_in`, `measured_by`, `contradicts` — the label is what separates structured knowledge from a hairball.

## A small ecological example

Consider a minimal graph for a field ecology dataset:

```
(Lumbricus terrestris) — [is_a]          → (earthworm species)
(Lumbricus terrestris) — [belongs_to]    → (Lumbricidae)
(Lumbricidae)          — [belongs_to]    → (Oligochaeta)
(plot_A)               — [located_in]    → (Kopački rit)
(Kopački rit)          — [is_a]          → (Ramsar wetland)
(observation_042)      — [records]       → (Lumbricus terrestris)
(observation_042)      — [at_location]   → (plot_A)
(observation_042)      — [on_date]       → (2023-04-15)
(2023-04-15)           — [during]        → (spring_survey_2023)
```

From this graph, a query engine can answer:

- *Which earthworm species were observed in Ramsar wetlands?*
- *How many observations belong to Oligochaeta and in what date range?*
- *Which plots have records of species from the family Lumbricidae?*

None of these questions require the data to have been structured with those queries in mind in advance.

## How knowledge graphs are stored

Three common approaches:

**Triple stores** (e.g. Apache Jena, Stardog) store RDF triples natively and are queried with SPARQL — the SQL of the semantic web. They are the natural home for ontology-heavy, standards-compliant knowledge bases like Wikidata or the Gene Ontology.

**Property graph databases** (e.g. Neo4j, Amazon Neptune) attach arbitrary key-value properties to both nodes and edges, and are queried with Cypher or Gremlin. They tend to feel more natural for application developers.

**In-memory / embedded graphs** (e.g. NetworkX in Python, RDFLib for RDF) are fine for smaller graphs, analysis tasks, and prototyping. I often build a small NetworkX graph from a Pandas DataFrame as a fast way to explore connectivity before committing to a database.

## Knowledge graphs and LLMs

This is where knowledge graphs have become newly relevant. Large language models are powerful but they hallucinate — they generate plausible-sounding text that is factually wrong, because they cannot reliably distinguish what they know from what they are confabulating.

A knowledge graph plugged into an LLM pipeline does two things:

1. **Grounds answers in verifiable facts.** Instead of the model recalling from parametric memory, the system queries the graph for the relevant subgraph and injects it as context. The model then reasons over concrete triples rather than fuzzy associations.

2. **Makes reasoning traceable.** Every statement in the answer can be traced back to a specific edge in the graph, making it possible to audit and correct the knowledge base rather than the model weights.

This is a step beyond standard RAG (retrieval-augmented generation with vector embeddings). Vector search finds *similar* passages; graph traversal finds *connected* facts. The two are complementary — you often want both: vector search to find the relevant part of the graph, graph traversal to pull in the neighbourhood of connected knowledge.

```
User query
  │
  ▼
Embed query → vector search → candidate nodes
                                    │
                                    ▼
                            graph traversal → subgraph
                                    │
                                    ▼
                        LLM + subgraph as context → answer
```

Libraries like **LangChain** have graph retriever components that implement exactly this pattern, and it can connect to Neo4j or a local NetworkX graph with similar code.

## Building a simple graph in Python

```python
import networkx as nx

G = nx.DiGraph()

# add entities
G.add_node("Lumbricus terrestris", type="species")
G.add_node("Lumbricidae",          type="family")
G.add_node("plot_A",               type="location")

# add relationships
G.add_edge("Lumbricus terrestris", "Lumbricidae", relation="belongs_to")
G.add_edge("plot_A", "Kopački rit",               relation="located_in")

# query: all outgoing relations from a node
for _, target, data in G.out_edges("Lumbricus terrestris", data=True):
    print(f"  → {data['relation']} → {target}")
```

For anything that needs to persist, scale beyond thousands of nodes, or be queried by multiple services, move to a proper graph database — but NetworkX is a fast way to validate the model before you commit to schema decisions.

## When to use a knowledge graph

Knowledge graphs are not the right tool for everything. A few honest guidelines:

**Use one when:**
- Relationships between entities are as important as the entities themselves
- The schema will evolve — new entity types and relations are added over time
- You need multi-hop queries ("find all species observed within 50 km of a site that has more than 3 monitoring stations")
- You are building an AI system that needs grounded, auditable knowledge

**Stick with relational tables when:**
- You have a well-defined, stable schema
- Queries are mostly row-level lookups or aggregations on a single entity type
- Your team is more familiar with SQL than SPARQL or Cypher

In ecological informatics, knowledge graphs are an increasingly natural fit: taxonomic hierarchies, spatial containment, temporal observations, methodological provenance, and literature citations are all inherently graph-shaped.

---

Knowledge graphs have been around since the 1980s under various names (semantic networks, ontologies, RDF stores), but the combination of better tooling, graph-native databases, and LLM integration has made them practically relevant in a way they were not a decade ago. Worth understanding even if you never end up building one from scratch.
