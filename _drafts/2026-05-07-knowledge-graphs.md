---
layout: post
title: Knowledge graphs and LLMs — a new instrument for science
date: 2026-05-07
description: New techniques in LLM-powered knowledge retrieval are making knowledge graphs essential for scientific exploration — enabling intricate inquiries and a fundamentally different way of reasoning over knowledge at scale.
category: ai
tags: [knowledge graph, LLM, RAG, ontology, ecology, biodiversity, scientific computing]
---

Science has always had two problems: generating knowledge and connecting it. The first has accelerated dramatically — genomics, remote sensing, ecological monitoring, and automated literature production are generating data faster than any field can absorb. The second problem has barely moved. The connections between a species observation in Croatia, a soil microbiology paper from 2019, a climate anomaly recorded in the Copernicus archive, and a gene expression dataset from a related experiment in Japan exist — but they live in separate databases, separate formats, and separate vocabularies. No researcher can traverse them. No search engine indexes their relationships. The knowledge is there, but it cannot be asked.

That is beginning to change. The combination of **knowledge graphs** and **large language models** is creating something genuinely new: the ability to pose intricate scientific questions across vast, heterogeneous bodies of knowledge and receive grounded, traceable answers. Not summaries of what individual documents say, but synthesised reasoning over the *structure* of what we know. This post argues that this combination is not an incremental improvement in literature search — it is a qualitatively different way of interacting with scientific knowledge, and biology is one of the domains where it will matter most.

## The problem with how science stores knowledge

Consider a question that any ecologist might ask:

> *Which soil invertebrate taxa, recorded in post-flood Pannonian wetlands, have functional traits associated with organic matter decomposition, and what does the literature say about their resilience to drought stress?*

This question requires simultaneously traversing:
- A taxonomic hierarchy (identifying the relevant taxa)
- An occurrence database (filtering by habitat and geography)
- A trait database (linking taxa to functional roles)
- A climate event database (identifying the relevant disturbance history)
- The primary literature (synthesising what is known about drought resilience)

Today, answering this takes weeks of manual work — downloading from GBIF, cross-referencing trait databases, running literature searches, resolving taxonomic synonyms across sources, then synthesising by hand. The bottleneck is not data. The bottleneck is the absence of a structure that connects these layers and a tool that can reason across them.

Knowledge graphs are the structure. LLMs are now becoming the reasoning layer on top.

## What a knowledge graph actually is

A knowledge graph stores information as a network of entities and typed relationships between them. Every statement is a **triple**:

```
(subject)  —  [predicate]  →  (object)
```

The power is in the predicate. Generic databases store rows. Knowledge graphs store *meaning*:

```
(Lumbricus terrestris) — [belongs_to]      → (Lumbricidae)
(Lumbricus terrestris) — [functional_group] → (decomposer)
(Lumbricus terrestris) — [feeds_on]        → (organic_litter)
(Lumbricus terrestris) — [is_prey_of]      → (Turdus merula)
(Lumbricus terrestris) — [sensitive_to]    → (soil_compaction)
(plot_A)               — [located_in]      → (Kopački rit)
(plot_A)               — [soil_type]       → (fluvisol)
(Kopački rit)          — [is_a]            → (Ramsar_wetland)
(Kopački rit)          — [experienced]     → (2022_drought_event)
(obs_042)              — [records]         → (Lumbricus terrestris)
(obs_042)              — [at_location]     → (plot_A)
(obs_042)              — [on_date]         → (2023-04-15)
```

Now ask: *Which decomposer species were observed in Ramsar wetlands after a drought event, at sites with fluvisol soils?* A graph engine traverses this in one query. A relational database would need four or five JOINs across tables that probably do not exist in a single schema. A language model asked cold would likely hallucinate a plausible but unverifiable answer.

The graph makes the question answerable *and* the answer auditable — every step in the reasoning path is a named edge that can be inspected and corrected.

## Biology as a knowledge graph — the infrastructure already exists

Here is what makes biology particularly well-positioned for this transition: the field has been building knowledge graph infrastructure for decades, largely without calling it that.

**Taxonomic hierarchies** are directed graphs. The NCBI Taxonomy — the backbone used by GenBank, GBIF, and most biodiversity informatics platforms — contains over 2.3 million named taxa connected by `is_a` and `part_of` relations into a single rooted tree. Every accession number in GenBank is a node attached to this graph.

**The Gene Ontology (GO)** is one of the most successful biological knowledge graphs ever built. It defines three structured vocabularies — molecular function, biological process, cellular component — and connects them through `is_a`, `part_of`, and `regulates` relations. Tens of millions of gene product annotations in every model organism database are expressed as triples against this ontology.

**The OBO Foundry** provides a suite of interoperable biological ontologies that collectively cover the vocabulary of the life sciences:

| Ontology | What it models |
|----------|---------------|
| NCBI Taxonomy | All described taxa and their hierarchical relationships |
| Gene Ontology (GO) | Molecular function, biological process, cellular component |
| Environment Ontology (ENVO) | Habitats, biomes, environmental materials |
| Relation Ontology (RO) | Standardised biological predicates (`eats`, `parasitizes`, `located_in`, …) |
| Phenotype and Trait Ontology (PATO) | Organism qualities and phenotypic descriptions |
| Darwin Core | Occurrence records, sampling events, measurements |

**GBIF** is the world's largest biodiversity knowledge graph in operational use. Its backbone taxonomy links over 9 million species names through synonymy and hierarchy. Every occurrence record links a taxon node to a location, a date, an observer, a dataset, and an institution. At full scale, this amounts to hundreds of millions of triples, queryable through APIs and SPARQL endpoints.

The raw material for a biological knowledge graph at civilisational scale already exists. What has been missing is the reasoning layer that makes it explorable by scientists asking natural-language questions.

## What LLMs change

A language model alone is a poor tool for scientific reasoning. It has absorbed enormous amounts of biological literature, but it cannot reliably distinguish what it knows from what it is confabulating. Ask it about the drought tolerance of a specific earthworm species in a specific bioregion and it will give you an answer — fluent, confident, and quite possibly wrong.

A knowledge graph alone is also limited. You can query it with precision, but only for questions you have already thought to ask in the exact structure the schema supports. It does not synthesise. It does not generalise. It does not bridge from a precise factual retrieval to the broader scientific context.

Together, they compensate for each other's weaknesses.

The architecture that makes this work is called **graph-augmented retrieval** (a specialisation of RAG). The idea is to use the language model's ability to understand a natural language question, convert it into a graph query, retrieve a relevant subgraph, and then reason over that grounded context rather than over parametric memory alone:

```
Natural language question
        │
        ▼
  LLM parses intent → structured graph query
        │
        ▼
  Graph traversal → relevant subgraph (verified triples)
        │
        ▼
  LLM reasons over subgraph → answer with traceable provenance
```

The result is qualitatively different from a search engine hit or a plain LLM response. Every claim in the answer is backed by a specific triple in a specific database. When the answer is wrong, the error is in the graph — and graphs can be corrected, versioned, and maintained without retraining the model.

## The scientific questions this enables

What changes when you have this capability is the *scale and intricacy* of questions that become answerable in a single session rather than a multi-week research project.

**Cross-domain synthesis.** A question like *"Which invertebrate taxa associated with soil bioturbation in European wetlands also appear in the IUCN threatened species list, and what do the last five years of primary literature say about the mechanisms of their vulnerability?"* previously required a team of researchers and months of work. A knowledge graph connecting GBIF occurrences, functional trait databases, the IUCN Red List, and a literature index makes this a single traversal followed by a synthesising prompt.

**Hypothesis generation at scale.** Knowledge graphs make it possible to systematically scan for structural patterns — species with similar trait profiles that have diverged in extinction risk, ecological network motifs that correlate with resilience, genes that participate in the same biological process across distantly related organisms. These are not questions with known answers that you search for. They are patterns in the *structure* of the knowledge that only become visible when the knowledge is formally connected.

**Integrating heterogeneous data.** A mosquito vector surveillance graph can connect occurrence records, host range data, pathogen associations, land-use change layers, and climate projections into a single queryable structure. The question *"In which areas of the Adriatic coast is the projected range expansion of Aedes albopictus likely to intersect with populations of immunocompromised hosts and existing gaps in surveillance?"* is a multi-hop graph query, not a keyword search. The answer requires simultaneously reasoning over taxonomy, medical demography, spatial data, and climate models.

**Literature as structured knowledge.** LLMs can now extract triples from unstructured text with reasonable accuracy — meaning that published papers, field reports, and grey literature can be progressively converted into graph edges. A knowledge graph that grows by ingesting the literature is a form of machine-assisted knowledge accumulation that does not depend on anyone manually curating every relationship.

## Building it in practice

The entry point in Python is straightforward. Starting from a GBIF occurrence export:

```python
import networkx as nx
import pandas as pd

occ = pd.read_csv("occurrences.csv")
G = nx.MultiDiGraph()

for _, row in occ.iterrows():
    sp = row["species"]

    # Taxonomic chain
    for child, parent, rank in [
        (sp,             row["family"], "belongs_to"),
        (row["family"],  row["order"],  "belongs_to"),
        (row["order"],   row["class"],  "belongs_to"),
    ]:
        G.add_node(child, node_type=rank)
        G.add_edge(child, parent, relation="belongs_to")

    # Observation
    obs = f"obs_{row.name}"
    G.add_node(obs, node_type="observation",
               count=row["individualCount"], date=row["eventDate"])
    G.add_edge(obs, sp,             relation="records")
    G.add_edge(obs, row["locality"], relation="at_location")

    # Habitat
    if pd.notna(row.get("habitat")):
        G.add_edge(sp, row["habitat"], relation="found_in")

# Multi-hop: all families recorded in fluvisol habitats
fluvisol_species = {
    u for u, v, d in G.in_edges("fluvisol", data=True)
    if d["relation"] == "found_in"
}
families = {
    v for sp in fluvisol_species
    for _, v, d in G.out_edges(sp, data=True)
    if d["relation"] == "belongs_to"
}
```

Once the graph exists, dropping in a LangChain graph retriever against it — or exporting to Neo4j for Cypher queries — adds the natural language layer. The graph does not need to be complete to be useful; even a partial connection of occurrence data, taxonomy, and a trait table opens up queries that were previously infeasible.

## A different relationship with knowledge

What is at stake here is not a better literature search. It is a different relationship between a scientist and the total body of knowledge in their field.

Today, a researcher's effective knowledge is bounded by what they have personally read, what their collaborators know, and what a keyword search surfaces. Knowledge graphs with LLM reasoning layers extend that boundary considerably. They make it possible to reason over connections that no single person has made, to find patterns in the structure of knowledge rather than in individual documents, and to ask questions at a scale and complexity that would previously have required a dedicated research programme.

For biology — a field sitting on top of the largest, most structurally complex, most rapidly growing knowledge base in science — this matters acutely. The species interactions, taxonomic relationships, functional traits, genomic annotations, ecological observations, and climate linkages are all there. The ontologies that define their vocabulary are maintained. The databases that hold the data are publicly accessible. What has been missing is the capacity to reason over all of it simultaneously.

That capacity is now, finally, becoming available.
