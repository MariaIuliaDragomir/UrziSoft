# 🤖 Comenzi Chat AI Agent

## Comenzi Disponibile

### ⬅️ Înapoi / Undo

Anulează ultimul filtru aplicat și revine la filtrele anterioare.

**Variante acceptate:**

- `înapoi`
- `inapoi`
- `anulează`
- `anuleaza`
- `șterge`
- `sterge`
- `undo`
- `back`

**Exemple:**

```
Tu: vreau un tricou rosu
AI: Super! Caut tricou de la producători locali (culoare: rosu)...

Tu: înapoi
AI: ✅ Am anulat ultimul filtru! Filtre active: categorie: tricou
```

### 🔄 Resetare Completă

Șterge toate filtrele și reîncepe căutarea de la zero.

**Variante acceptate:**

- `resetează`
- `reseteaza`
- `restart`
- `start over`
- `de la capat`

**Exemple:**

```
Tu: resetează
AI: ✅ Am resetat toate filtrele! Spune-mi ce cauți: tricouri, bluze sau hanorace? 🛍️
```

### 📋 Afișare Filtre Active

Vezi ce filtre ai aplicat în căutarea curentă.

**Variante acceptate:**

- `filtre`
- `ce filtre`
- `filtre active`
- `ce ai setat`

**Exemple:**

```
Tu: filtre
AI: Filtre active:
📦 Categorie: tricou
🎨 Culoare: albastru
📏 Mărime: M
💰 Buget: max 100 lei
📍 Oraș: Cluj-Napoca

Scrie "înapoi" pentru a anula ultimul filtru sau "resetează" pentru a șterge toate.
```

## 🎯 Filtre Suportate

### Categorii

- `tricou` / `tricouri`
- `bluză` / `bluze`
- `hanorac` / `hanorace`

### Culori

- `alb` / `alba` / `albe`
- `albastru` / `albastră` / `albastre`
- `portocaliu` / `orange`
- `verde` / `verzi`
- `roșu` / `rosu` / `roșie` / `rosii`
- `negru` / `neagră` / `negre`
- `gri` / `griu`
- `galben` / `galbena`
- `roz` / `pink`
- `maro` / `cafeniu`

### Mărimi

- `XS`, `S`, `M`, `L`, `XL`, `XXL`

### Orașe

- `Cluj-Napoca` / `Cluj`
- `București` / `Bucuresti`
- `Brașov` / `Brasov`
- `Timișoara` / `Timisoara`
- `Sibiu`
- `Iași` / `Iasi`
- `Constanța` / `Constanta`

### Buget

**Formate acceptate:**

- `maxim 100 lei`
- `max 150 ron`
- `pana la 200 lei`
- `sub 80 ron`
- `100 lei`

## 💡 Exemple de Conversații

### Exemplul 1: Căutare Progresivă cu Înapoi

```
Tu: vreau un tricou
AI: Super! Caut tricou de la producători locali. Ce culoare preferi? ...

Tu: albastru
AI: Am înregistrat! Mai am nevoie de: mărimea

Tu: M
AI: Perfect! Am actualizat căutarea. Vezi produsele în stânga! 🎯

Tu: maxim 100 lei
AI: Am actualizat filtrele! Vezi produsele noi în listă. 🔄

Tu: înapoi
AI: ✅ Am anulat ultimul filtru! Filtre active: categorie: tricou, culoare: albastru, mărime: M

Tu: filtre
AI: Filtre active:
📦 Categorie: tricou
🎨 Culoare: albastru
📏 Mărime: M
```

### Exemplul 2: Resetare și Re-căutare

```
Tu: tricou verde din Cluj
AI: Super! Caut tricou de la producători locali (culoare: verde, oraș: Cluj-Napoca)...

Tu: resetează
AI: ✅ Am resetat toate filtrele! Spune-mi ce cauți...

Tu: bluză roșie L
AI: Super! Caut bluza de la producători locali (culoare: rosu, mărime: L)...
```

## 🚀 Cum Funcționează

1. **Tracking Filtre**: Fiecare filtru aplicat este salvat în istoric
2. **Înapoi**: Restaurează filtrele din istoric (ultimul set)
3. **Resetare**: Șterge complet istoricul și toate filtrele
4. **Persistență**: Istoricul se menține pe durata conversației

## 🔧 Pentru Dezvoltatori

Historicul de filtre este stocat în `state.filterHistory` ca array de obiecte:

```javascript
{
  filters: { category: "tricou", color: "albastru" },
  filterHistory: [
    { smallBusinessOnly: true },
    { smallBusinessOnly: true, category: "tricou" },
    { smallBusinessOnly: true, category: "tricou", color: "albastru" }
  ]
}
```

Când utilizatorul scrie "înapoi", se face `pop()` din array și se restaurează filtrele anterioare.
