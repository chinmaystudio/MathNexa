import nerdamer from 'nerdamer';
import 'nerdamer/Algebra';
import 'nerdamer/Calculus';
import 'nerdamer/Solve';

export type EquationType = 'exact' | 'non-exact' | 'linear' | 'separable' | 'homogeneous';

export interface Step {
  title: string;
  description: string;
  math?: string;
  result?: string;
}

export interface Solution {
  type: EquationType;
  isExact: boolean;
  steps: Step[];
  finalResult: string;
}

export const solveDifferentialEquation = (mStr: string, nStr: string): Solution => {
  const steps: Step[] = [];
  
  // Clean inputs
  const M = mStr.replace(/ /g, '');
  const N = nStr.replace(/ /g, '');

  steps.push({
    title: 'Initial Equation',
    description: 'We are given the differential equation in the form M(x,y)dx + N(x,y)dy = 0:',
    math: `(${mStr})dx + (${nStr})dy = 0`
  });

  // Calculate derivatives for exactness
  const dMdy = nerdamer.diff(M, 'y').toString();
  const dNdx = nerdamer.diff(N, 'x').toString();

  steps.push({
    title: 'Testing for Exactness',
    description: 'Calculate ∂M/∂y and ∂N/∂x to check if the equation is exact.',
    math: `\\frac{\\partial M}{\\partial y} = ${nerdamer(dMdy).toTeX()}, \\quad \\frac{\\partial N}{\\partial x} = ${nerdamer(dNdx).toTeX()}`
  });

  const isExact = nerdamer(dMdy).eq(dNdx);

  if (isExact) {
    steps.push({
      title: 'Exactness Verified',
      description: 'Since ∂M/∂y = ∂N/∂x, the differential equation is exact.',
      result: 'Condition Met'
    });

    // Step 1: Integrate M with respect to x
    const integralM = nerdamer.integrate(M, 'x').toString();
    steps.push({
      title: 'Integrate M with respect to x',
      description: 'We find the potential function f(x,y) by integrating M(x,y) with respect to x, adding a function g(y) as the constant of integration.',
      math: `f(x,y) = \\int (${nerdamer(M).toTeX()}) dx = ${nerdamer(integralM).toTeX()} + g(y)`
    });

    // Step 2: Differentiate with respect to y and equate to N
    const diffIntegralM = nerdamer.diff(integralM, 'y').toString();
    steps.push({
      title: 'Differentiate with respect to y',
      description: 'Differentiate this potential function with respect to y and set it equal to N(x,y).',
      math: `\\frac{\\partial}{\\partial y} [${nerdamer(integralM).toTeX()} + g(y)] = ${nerdamer(diffIntegralM).toTeX()} + g'(y) = ${nerdamer(N).toTeX()}`
    });

    // Step 3: Solve for g'(y)
    const gPrimeY = (nerdamer(`${N} - (${diffIntegralM})`) as any).simplify().toString();
    steps.push({
      title: "Solve for g'(y)",
      description: "Isolate g'(y) by subtracting the terms from N.",
      math: `g'(y) = ${nerdamer(gPrimeY).toTeX()}`
    });

    // Step 4: Integrate g'(y) to find g(y)
    const gY = nerdamer.integrate(gPrimeY, 'y').toString();
    steps.push({
      title: 'Find g(y)',
      description: 'Integrate g\'(y) with respect to y.',
      math: `g(y) = \\int (${nerdamer(gPrimeY).toTeX()}) dy = ${nerdamer(gY).toTeX()}`
    });

    // Final result
    const finalVal = (nerdamer(`${integralM} + (${gY})`) as any).simplify().toString();
    steps.push({
      title: 'General Solution',
      description: 'Combine all terms and equate to a constant C.',
      math: `${nerdamer(finalVal).toTeX()} = C`
    });

    return {
      type: 'exact',
      isExact: true,
      steps,
      finalResult: `${finalVal} = C`
    };
  } else {
    // Non-exact logic (Simple IF candidate)
    steps.push({
      title: 'Equation is Non-Exact',
      description: 'Since ∂M/∂y ≠ ∂N/∂x, we need to find an integrating factor (μ).',
      result: 'Condition Not Met'
    });

    // Check IF(x) = (dMdy - dNdx) / N
    const diffDiff = (nerdamer(`(${dMdy}) - (${dNdx})`) as any).simplify().toString();
    const ifXRatio = (nerdamer(`(${diffDiff}) / (${N})`) as any).simplify().toString();
    
    // Check if ifXRatio depends only on x
    const vars = (nerdamer(ifXRatio) as any).variables();
    const onlyX = vars.length === 0 || (vars.length === 1 && vars[0] === 'x');

    if (onlyX) {
      steps.push({
        title: 'Finding Integrating Factor μ(x)',
        description: 'Since (∂M/∂y - ∂N/∂x)/N depends only on x, we can find μ(x).',
        math: `f(x) = \\frac{1}{N} \\left( \\frac{\\partial M}{\\partial y} - \\frac{\\partial N}{\\partial x} \\right) = ${nerdamer(ifXRatio).toTeX()}`
      });

      const integralFx = nerdamer.integrate(ifXRatio, 'x').toString();
      const muX = `exp(${integralFx})`;
      
      steps.push({
        title: 'Calculate μ(x)',
        description: 'The integrating factor is given by μ(x) = e^∫f(x)dx.',
        math: `\\mu(x) = e^{\\int (${nerdamer(ifXRatio).toTeX()}) dx} = ${nerdamer(muX).toTeX()}`
      });

      steps.push({
        title: 'Multiply Original Equation by μ(x)',
        description: 'Now multiply the entire original equation by the integrating factor to make it exact.',
        math: `${nerdamer(muX).toTeX()} [ (${mStr})dx + (${nStr})dy ] = 0`
      });

      steps.push({
        title: 'Proceed with Exact Method',
        description: 'After multiplication, the equation becomes exact. Refer to exact equation steps for final resolution.',
      });
      
      return {
        type: 'non-exact',
        isExact: false,
        steps,
        finalResult: 'Equation transformed to exact form.'
      };
    }

    return {
      type: 'non-exact',
      isExact: false,
      steps,
      finalResult: 'Complex non-exact equation (Requires beyond-basic IF patterns)'
    };
  }
};
