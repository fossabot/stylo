# Dissertations and theses

---
Stylo allows you to create more complex documents than just articles, such as dissertations or theses; this feature is called **Books**.

**Careful: this option is not fully functional. We recommend that you wait for future updates before using it as a final rendering.**

## Basic principles

> A thesis consists of one or more Stylo documents put together.

- These documents may be chapters or parts of the thesis.
- They are collected in a thesis using the same _[tag]_ label, which must be associated with each Stylo document.
- Each chapter or part therefore functions as a Stylo document:
  - It has its own metadata and bibliography.
  - It can be shared as such (annotation, preview, etc.). It is at the time of exporting the thesis that the different parts are edited together.
- The metadata of the complete thesis is that of the first document.

**Documents within a thesis are listed in alphabetical order. The easiest way to control the order is to place a number at the beginning of the name of each document concerned (the name of the document must not be confused with the title of the document entered in the metadata).**

## Some particularities

### Title levels

Your dissertation or thesis can be structured into parts and chapters or chapters only. **Part titles** must be **level 1 titles** (example: `# Part 1: my part title`) and **chapter titles** will then be **level 2 titles**. In the case of a dissertation structured in chapters only, the **chapter titles** will be **level 1 titles** (example: `# My chapter title`).

At the time of export, you will be able to declare the organization of your thesis:

1. **In parts and chapters**;
2. **In chapters only**.

### Bibliography

By default, the bibliography generated is that of all the references cited or present in the various articles that make up the thesis.

But it is also possible to structure this bibliography: in a dissertation or a thesis, the bibliography is often divided into different sections. Stylo allows you to create a bibliography organized in sub-sections. Here are the two steps to follow:

1. In the metadata of the dissertation, you must declare the different sections of the bibliography. To do this, switch the metadata to _raw_ mode;

![rawmode](uploads/images/alpha_rawmode.png)

Then at the end, before `---`, add the following lines:

```yaml
subbiblio:
  - key: pratique
    title: Pratique littéraire
  - key: theorie
    title: Théorie
```

The structure is as follows:
- `key` is the "section key", in other words a tag that will be used in the next step.
- `title` will be your bibliography section title, as it will be displayed in the thesis.

2. For each of the bibliographic references concerned, add in the `keywords` field the section key (for example `practice` or `theory`). This step can be done either in Zotero or in Stylo by editing the BibTeX directly.

### Thesis metadata

_In a future version, the "Books" interface will offer a metadata editor for dissertation or thesis metadata._

In this version of Stylo, the metadata of the thesis will be those of the first declared document. Other metadata will be ignored. **The subdivisions of the bibliography** must therefore be declared in the first document of the thesis.

### Export

The export of the thesis is done through a dedicated LaTeX template. It corresponds to the thesis template of the University of Montreal.

More templates will be available soon.

<!-- à quoi correspond cette image ? en commentaire pour le moment -->
<!-- ![exportbook](uploads/images/alpha_exportbook.png) -->

Several options are available:

1. Format of the exported document;
2. Bibliographic style;
3. Table of contents;
4. Numbering (or not) of sections and chapters;
5. Structure of the thesis: in parts and chapters, or in chapters alone.

### Customize the export to pdf

It is possible to insert LaTeX code in Markdown content (excluding metadata).
