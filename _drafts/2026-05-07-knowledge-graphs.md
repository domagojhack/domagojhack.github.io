---
layout: post
title: What is a knowledge graph?
date: 2026-05-07
description: A structured introduction to knowledge graphs — what they are, how they work, and why biology is one of the domains where they matter most.
category: ai
tags: [knowledge graph, graph database, ontology, RAG, AI, ecology, biodiversity, taxonomy]
---

Data is only as useful as the connections you can draw from it. A spreadsheet tells you that a species was observed at a location on a date. A knowledge graph tells you that the species *belongs to* a genus, the genus *is part of* a family, the location *lies within* a protected area, the date *falls inside* a drought period recorded by a climate model, and the species *competes with* another that was recorded at the same site three weeks earlier. The difference is the explicit encoding of relationships — and that is what knowledge graphs do.

Biology, more than most sciences, is built on relationships. Taxonomy is a hierarchy of containment. Ecology is a web of interactions. Genomics is a network of regulation. Every domain in the life sciences has always been, at its core, a knowledge graph — it just took us a while to build the tools to manage it that way.

## The basic idea

A knowledge graph is a network of entities and the typed relationships between them. Formally, it is a collection of **triples**:

```
(subject) — [predicate] → (object)
```

A biological example immediately makes this concrete:

```
(Lumbricus terrestris) — [is_a]           → (species)
(Lumbricus terrestris) — [belongs_to]     → (Lumbricidae)
(Lumbricus terrestris) — [inhabits]       → (temperate deciduous forest)
(Lumbricus terrestris) — [feeds_on]       → (decomposing organic matter)
(Lumbricus terrestris) — [improves]       → (soil aeration)
(Lumbricus terrestris) — [is_prey_of]     → (Turdus merula)
(Turdus merula)        — [is_a]           → (species)
(Turdus merula)        — [belongs_to]     → (Turdidae)
```

Chain enough triples together and you can ask questions that no single table could answer:

> *Which bird species prey on organisms that improve soil aeration in temperate deciduous forests?*

A graph database traverses that chain in milliseconds. A relational database would require three or four JOINs — if the schema even modelled those relationships at all.

## Nodes, edges, and labels

| Term | Meaning |
|------|---------|
| **Node** (or entity) | A thing — a species, a gene, a habitat, an observation, a publication |
| **Edge** (or relation) | A directed, labelled connection between two nodes |
| **Triple** | One (subject, predicate, object) statement |
| **Ontology** | The schema — the defined set of entity types and the allowed relations between them |

The critical word in "labelled connection" is *labelled*. Generic graphs have edges; knowledge graphs have edges with meaning. `is_a`, `part_of`, `eats`, `located_in`, `regulates`, `transmits`, `co_occurs_with` — the label is what separates structured biological knowledge from a hairball of nodes.

## Biology already thinks in graphs

Biologists have been constructing knowledge graphs for centuries — they just called them other things.

**Taxonomic hierarchies** are the oldest and most universal example. The Linnaean system is a directed acyclic graph: every taxon is connected to its parent by a `part_of` or `is_a` relation. The NCBI Taxonomy database, which is the backbone used by GenBank, GBIF, and most biodiversity informatics platforms, contains over 2.3 million named taxa connected into a single rooted tree. It is, structurally, a knowledge graph.

**Food webs** are ecological knowledge graphs. Nodes are species or functional groups; edges are `eats` / `is_eaten_by` relations, often annotated with interaction strength, frequency, or body-mass ratio. Analysing food web topology — path lengths, trophic levels, keystone species — is a standard application of graph theory in ecology.

**Gene regulatory networks** connect transcription factors to their target genes via `activates` and `represses` edges, genes to proteins via `encodes`, and proteins to biological processes via `participates_in`. The Gene Ontology (GO) formalises this into a shared vocabulary used across every model organism database on the planet.

**Host-parasite and vector networks** are graphs by nature: a mosquito species `transmits` a pathogen `to` a vertebrate host, the host `is_found_in` a habitat, the habitat `overlaps_with` a human-modified landscape. Understanding disease transmission is fundamentally a graph traversal problem.

## Biological ontologies: the shared vocabularies

A knowledge graph is only as useful as the consistency of its vocabulary. If one dataset says `preys_on` and another says `feeds_on` and a third says `eats`, a query engine cannot equate them. Biological ontologies solve this by defining canonical terms and their logical relationships.

The **OBO Foundry** is the community standard for biological ontologies. Key members:

| Ontology | Covers |
|----------|--------|
| **Gene Ontology (GO)** | Molecular function, biological process, cellular component |
| **NCBI Taxonomy** | All described taxa, their ranks and hierarchical relationships |
| **Environment Ontology (ENVO)** | Habitats, biomes, environmental materials |
| **Relation Ontology (RO)** | Standardised biological relations (`eats`, `parasitizes`, `located_in`, …) |
| **Phenotype and Trait Ontology (PATO)** | Organism qualities and phenotypic descriptions |
| **Darwin Core** | Occurrence records, sampling events, measurements |

**Darwin Core** deserves special mention. It is the standard vocabulary for biodiversity occurrence data — the schema used by GBIF, iNaturalist, and most national biodiversity databases. When you download a GBIF occurrence dataset, every column name (`scientificName`, `decimalLatitude`, `eventDate`, `samplingProtocol`) is a Darwin Core term. The dataset is a flat table, but the terms are drawn from an ontology that specifies their meaning and relationships. The table becomes a knowledge graph the moment you start joining across the taxonomy backbone and the spatial hierarchy.

**GBIF itself** is one of the largest biological knowledge graphs in existence. Its backbone taxonomy links over 9 million species names through synonymy, hierarchy, and authorship. Every occurrence record links a taxon node to a location node (with spatial geometry) to a date node to an observer node to a dataset node. At full scale, this is hundreds of millions of triples.

## A fuller ecological example

Here is what a knowledge graph looks like when it integrates taxonomy, observations, ecology, and environmental context for a real field dataset:

```
# Taxonomy
(Lumbricus terrestris)  — [is_a]           → (species)
(Lumbricus terrestris)  — [belongs_to]     → (Lumbricidae)
(Lumbricidae)           — [belongs_to]     → (Haplotaxida)
(Haplotaxida)           — [belongs_to]     → (Oligochaeta)
(Oligochaeta)           — [belongs_to]     → (Annelida)

# Ecological roles
(Lumbricus terrestris)  — [functional_group] → (decomposer)
(Lumbricus terrestris)  — [feeds_on]          → (organic_litter)
(Lumbricus terrestris)  — [ecosystem_service] → (soil_bioturbation)
(Lumbricus terrestris)  — [is_prey_of]        → (Turdus merula)
(Lumbricus terrestris)  — [is_prey_of]        → (Talpa europaea)

# Observations linking to taxonomy and space
(obs_042)  — [records]       → (Lumbricus terrestris)
(obs_042)  — [at_location]   → (plot_A)
(obs_042)  — [on_date]       → (2023-04-15)
(obs_042)  — [method]        → (hand_sorting)
(obs_042)  — [count]         → 14

# Spatial context
(plot_A)        — [located_in]   → (Kopački rit)
(plot_A)        — [soil_type]    → (fluvisol)
(Kopački rit)   — [is_a]         → (Ramsar_wetland)
(Kopački rit)   — [ecoregion]    → (Pannonian_mixed_forests)

# Environmental conditions linked to the survey date
(2023-04-15)    — [soil_moisture]   → 0.42
(2023-04-15)    — [soil_temp_C]     → 12.3
(2023-04-15)    — [during]          → (spring_survey_2023)
(spring_survey_2023) — [follows]    → (2022_drought_event)
```

With this graph you can answer questions that span every layer:

- *Which decomposer species were observed in Ramsar wetlands during surveys that followed a drought event?*
- *What ecosystem services are provided by species in the Oligochaeta that have been recorded on fluvisol soils?*
- *Which predators of Lumbricus terrestris co-occur in the same ecoregion as plots with high soil moisture?*

These are not exotic queries — they are the kinds of questions ecologists ask constantly. The problem is that the answers are currently locked inside separate spreadsheets, taxonomic databases, and climate datasets that do not talk to each other.

## Building a biological knowledge graph in Python

Starting from a typical GBIF-style occurrence DataFrame, building a knowledge graph is straightforward with NetworkX:

```python
import networkx as nx
import pandas as pd

# Suppose occurrences is a DataFrame with columns:
# species, family, order, class, phylum, locality, habitat, date, count
occurrences = pd.read_csv("occurrences.csv")

G = nx.MultiDiGraph()

for _, row in occurrences.iterrows():
    sp = row["species"]

    # Taxonomic chain
    G.add_node(sp,              node_type="species")
    G.add_node(row["family"],   node_type="family")
    G.add_node(row["order"],    node_type="order")
    G.add_node(row["class"],    node_type="class")

    G.add_edge(sp, row["family"], relation="belongs_to")
    G.add_edge(row["family"], row["order"], relation="belongs_to")
    G.add_edge(row["order"],  row["class"], relation="belongs_to")

    # Observation node
    obs_id = f"obs_{_}"
    G.add_node(obs_id, node_type="observation", count=row["count"], date=row["date"])
    G.add_edge(obs_id, sp,             relation="records")
    G.add_edge(obs_id, row["locality"], relation="at_location")

    # Habitat link
    G.add_edge(sp, row["habitat"], relation="found_in")

# Multi-hop query: all species found in a given habitat type
habitat = "fluvisol"
species_in_habitat = [
    u for u, v, d in G.in_edges(habitat, data=True)
    if d["relation"] == "found_in"
]

# Extend: which families do those species belong to?
families = set()
for sp in species_in_habitat:
    for _, fam, d in G.out_edges(sp, data=True):
        if d["relation"] == "belongs_to":
            families.add(fam)

print(f"Families recorded on {habitat}: {families}")
```

For a production system — or when the graph exceeds a few hundred thousand nodes — Neo4j with the Cypher query language scales far better. The same graph built above translates directly:

```cypher
// Load all species and their taxonomy
MATCH (s:Species)-[:BELONGS_TO]->(f:Family)-[:BELONGS_TO]->(o:Order)
// Find observations linked to a specific habitat
MATCH (obs:Observation)-[:RECORDS]->(s)
MATCH (s)-[:FOUND_IN]->(h:Habitat {name: "fluvisol"})
RETURN s.name, f.name, o.name, COUNT(obs) AS n_observations
ORDER BY n_observations DESC
```

## Knowledge graphs and biological AI

Large language models trained on scientific literature have absorbed a great deal of biology, but they hallucinate — they generate plausible species names, interactions, and ecological claims that are simply wrong. A knowledge graph grounded in verified occurrence records and curated ontologies provides the factual backbone that LLMs lack.

In a biological graph-RAG pipeline:

```
User: "Which earthworm species in Croatia improve soil structure
       and are threatened by agricultural land use?"

  │
  ▼
Embed query → vector search over species nodes
  │
  ▼
Graph traversal:
  species → ecosystem_service = soil_bioturbation
  species → range_includes = Croatia
  species → threat = agricultural_intensification
  │
  ▼
Inject subgraph as context → LLM generates answer
  grounded in verified GBIF + IUCN data
```

The answer is no longer a confident confabulation — it is traceable to specific nodes and edges that can be audited, corrected, or updated when the underlying data changes. For conservation decisions, species monitoring reports, or systematic literature reviews, this difference matters.

## How knowledge graphs are stored

**Triple stores** (Apache Jena, Stardog, Blazegraph) store RDF triples natively and are queried with SPARQL. The NCBI Taxonomy, Gene Ontology, and Wikidata all expose SPARQL endpoints. If you want to query "all Ramsar wetland sites in the Pannonian bioregion that contain at least three Oligochaeta species in the GBIF backbone," SPARQL across federated endpoints is the right tool.

**Property graph databases** (Neo4j, Amazon Neptune, Memgraph) attach key-value properties to both nodes and edges, and are queried with Cypher or Gremlin. Better for application development, easier to integrate with Python backends, and more performant for deep traversals on large graphs.

**In-memory / embedded** (NetworkX, RDFLib, igraph) work well for smaller graphs, exploratory analysis, and prototyping. I build NetworkX graphs from occurrence DataFrames regularly as a first step before deciding whether a persistent database is needed.

## When to use a knowledge graph in biology

**Use one when:**
- You are integrating data across multiple sources with different schemas (occurrence databases, trait databases, climate data, literature)
- Your entities have deeply hierarchical relationships — taxonomy, anatomy, process hierarchies
- You need to answer multi-hop questions across entity types
- You are building an AI assistant that needs to reason over biological facts without hallucinating

**Stick with relational tables when:**
- You have a stable schema and queries are mostly aggregations on a single entity type
- You are working with a single occurrence dataset and simple spatial / temporal filters
- The team is more comfortable with SQL than Cypher or SPARQL

Ecological informatics sits at the crossroads: the raw occurrence data is tabular, but the knowledge needed to interpret it — taxonomy, trait ecology, biogeography, conservation status — is inherently graph-shaped. Bridging the two is one of the more interesting data engineering challenges in modern biodiversity science.

---

Knowledge graphs have been a formal concept since the 1980s, but biology was doing it long before that — every taxonomic revision, every food web diagram, every gene interaction map is a knowledge graph that needed better tooling. That tooling now exists: graph databases are mature, biological ontologies are well-maintained, and the LLM integration story is starting to make sense. The gap between "we have all this data" and "we can actually reason over it" has never been smaller.
