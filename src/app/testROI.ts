function berechneROIundRentabilitaetsjahr(
    jahre: number[],
    einnahmen: number[],
    kosten: number[],
    massnahmenKosten: Record<string, number>
  ): { roi: number; rentabilitaetsjahr: number } {
    let kumulierteEinnahmen = 0;
    let kumulierteKosten = 0;
  
    for (let i = 0; i < jahre.length; i++) {
      // Berechne die Einnahmen und Kosten für das aktuelle Jahr
      const einnahmenJahr = einnahmen[i];
      const kostenJahr = kosten[i];
  
      // Berücksichtige die Kosten der Maßnahmen für das aktuelle Jahr
      const massnahmenKostenJahr = Object.values(massnahmenKosten).reduce(
        (acc, kosten) => acc + kosten,
        0
      );
  
      // Aktualisiere die kumulierten Einnahmen und Kosten
      kumulierteEinnahmen += einnahmenJahr;
      kumulierteKosten += kostenJahr + massnahmenKostenJahr;
  
      // Berechne den ROI für das aktuelle Jahr
      const roi = ((kumulierteEinnahmen - kumulierteKosten) / kumulierteKosten) * 100;
  
      // Überprüfe, ob der ROI positiv ist, und gib das Ergebnis zurück
      if (roi > 0) {
        return { roi, rentabilitaetsjahr: jahre[i] };
      }
    }
  
    // Rückgabe, falls der ROI nie positiv wurde
    return { roi: 0, rentabilitaetsjahr: 0 };
  }
  
  // Beispielaufruf
  const jahre = [2020, 2021];
  const einnahmen = [30, 70];
  const kosten = [100, 150];
  const massnahmenKosten = { measure1: 50, measure2: 30 };
  
  const { roi, rentabilitaetsjahr } = berechneROIundRentabilitaetsjahr(
    jahre,
    einnahmen,
    kosten,
    massnahmenKosten
  );
  
  console.log('ROI:', roi);
  console.log('Rentabilitätsjahr:', rentabilitaetsjahr);
  