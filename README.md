# 🔐 CipherFeed  
### Speak Without Words · Seal Moments as Visual Ciphers

CipherFeed is a prototype platform where emotions are expressed **without text**, encoded as **abstract visual patterns**.  
Each post represents a **sealed emotional moment** — visible as art to everyone, but meaningful only to those allowed to unlock it.

This project was built for **UIU HackDay 2026 (Category 3)**.

---

## 🧠 Concept & Motivation

Not all emotions are meant to be explained.  
Not all messages are meant for everyone.

Modern platforms force people to:
- use words
- be explicit
- expose meaning to unintended audiences

CipherFeed explores an alternative form of communication where:
- emotions are **felt visually**, not written
- meaning can remain **private or selectively revealed**
- abstract visuals act as **emotional ciphers**

The platform separates **expression** from **interpretation**.

---

## 🎯 Core Idea

Each post follows a simple but powerful flow:

1. A user selects an **emotion or intent**
2. The system **deterministically encodes** it into a visual pattern
3. The feed displays only the **abstract visual**
4. The true meaning stays hidden unless the viewer is allowed to unlock it

To outsiders, the post is just art.  
To the intended viewer, it carries meaning.

---

## ✨ Key Features

### 🖼 Visual Emotion Encoding
- Emotions are mapped to visual parameters:
  - color palette
  - geometric shape
  - symmetry
  - motion
- The same emotion always produces the same visual language

### 🕶 Public Art, Private Meaning
- Feed shows only abstract patterns
- Meaning (emotion label) is hidden by default
- Optional **PIN-protected reveal** for selective sharing

### 👤 Anonymous or Named Posting
- Users can post anonymously or as a named author
- Identity is optional; expression is primary

### 🗂 Feed-Based Experience
- Posts appear newest-first
- Each post feels like a **sealed moment**, not a status update

### 💾 Reliable & Demo-Safe
- Frontend-only prototype
- Posts stored using **LocalStorage**
- No backend or external APIs → stable demo

---

## 🏗 System Architecture (High Level)

