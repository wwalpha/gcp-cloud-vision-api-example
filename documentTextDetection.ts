const vision = require('@google-cloud/vision');

// Creates a client
const client = new vision.ImageAnnotatorClient();
const fileName = 'documentTextDetection.png';

const start = async () => {
  const results = await client.documentTextDetection(fileName);

  const pages = results[0].fullTextAnnotation.pages;

  pages.forEach((page: any) => {
    let lines = page.blocks
      .map((block: any, idx: number) => {
        const blockLines = getBlock(block);

        return blockLines
          .split('\n')
          .filter((item: any) => item.length !== 0)
          .join('\n');
      })
      .filter((item: any) => item.length !== 0);

    lines = lines.join('\n').split('\n');

    console.log(lines);
  });
};

const getBlock = (block: any) => {
  const lines = block.paragraphs
    .map((paragraph: any) => {
      const words = paragraph.words.map(({ symbols }: any) => filterSymbols(symbols)).filter((item: any) => item.length != 0);

      return words.join('');
    })
    .filter((item: any) => item.length !== 0);

  return lines.join('');
};

const filterSymbols = (symbols: any) => {
  let filters = symbols.filter((symbol: any) => {
    if (symbol.confidence <= 0.85 || !symbol.property || !symbol.property.detectedLanguages) {
      return false;
    }

    const len = symbol.property.detectedLanguages.filter((lan: any) => lan.languageCode === 'en').length;
    return len != 0;
  });

  if (filters.length === 0) {
    return [];
  }

  // Symbols
  return filters
    .map((symbol: any) => {
      let endfix = '';
      if (symbol.property.detectedBreak && symbol.property.detectedBreak.type === 'SPACE') {
        endfix = ' ';
      }

      if (symbol.property.detectedBreak && symbol.property.detectedBreak.type === 'EOL_SURE_SPACE') {
        endfix = '\n';
      }

      return `${symbol.text}${endfix}`;
    })
    .join('');
};

start();
