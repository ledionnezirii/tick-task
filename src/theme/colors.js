// "Task pad" palette — warm ink on porcelain paper with a marigold highlighter
// accent and a muted sage for completed work. Deliberately avoids the generic
// flat-blue-on-white app look. Every screen pulls from here so the identity
// stays consistent.
export const colors = {
  ink: '#201D1A', // primary text — warm near-black, like pen ink
  inkSoft: '#4A453E', // secondary headings / strong body
  muted: '#8C867A', // captions, metadata, placeholders

  paper: '#E7E4DB', // app background — porcelain paper
  card: '#FBFAF6', // raised surfaces (task rows, inputs)
  line: '#D6D2C7', // hairline borders and ruled lines

  amber: '#E0A22B', // highlighter accent — active tasks, progress, focus
  amberSoft: '#F4E6C4', // amber wash for fills and highlights
  amberInk: '#8A6712', // amber dark enough for text on paper

  sage: '#5E7B5E', // completed state — calm, not a loud green
  sageSoft: '#DDE7DB', // sage wash

  danger: '#B5462F', // destructive actions only (muted brick, not pure red)
  dangerSoft: '#F0DAD2',

  white: '#FFFFFF',
};

export default colors;
