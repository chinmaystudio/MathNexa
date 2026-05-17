import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface MathRendererProps {
  math: string;
  block?: boolean;
}

export const MathRenderer = ({ math, block = false }: MathRendererProps) => {
  try {
    if (block) {
      return <BlockMath math={math} />;
    }
    return <InlineMath math={math} />;
  } catch (error) {
    console.error('KaTeX error:', error);
    return <span>{math}</span>;
  }
};
