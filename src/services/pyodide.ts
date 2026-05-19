
export interface PyodideInterface {
  loadPackage: (packages: string[]) => Promise<void>;
  runPythonAsync: (code: string) => Promise<any>;
}

declare global {
  interface Window {
    loadPyodide: (config: { indexURL: string }) => Promise<PyodideInterface>;
  }
}

let pyodideInstance: PyodideInterface | null = null;
let initializationPromise: Promise<PyodideInterface> | null = null;

export const getPyodide = async (): Promise<PyodideInterface> => {
  if (pyodideInstance) return pyodideInstance;
  if (initializationPromise) return initializationPromise;

  initializationPromise = (async () => {
    try {
      // Check if the script tag has loaded loadPyodide into window
      let retries = 0;
      while (typeof window.loadPyodide !== "function" && retries < 50) {
        await new Promise(resolve => setTimeout(resolve, 100));
        retries++;
      }

      if (typeof window.loadPyodide !== "function") {
        throw new Error("Pyodide script failed to load into window object.");
      }

      const pyodide = await window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/"
      });
      
      await pyodide.loadPackage(['sympy', 'numpy']);
      
      // Initialize standard functions
      await pyodide.runPythonAsync(`
import sympy as sp
import numpy as np
import json
from sympy.parsing.sympy_parser import parse_expr, standard_transformations, implicit_multiplication_application

def smart_sympify(expr_str):
    transformations = standard_transformations + (implicit_multiplication_application,)
    return parse_expr(expr_str.replace('^', '**'), transformations=transformations)

def verify_expr(user_input, correct_str):
    try:
        user = smart_sympify(user_input)
        correct = sp.sympify(correct_str)
        return sp.simplify(user - correct) == 0
    except:
        return False

def compute_partials(M_expr, N_expr):
    x, y = sp.symbols('x y')
    try:
        M = smart_sympify(M_expr)
        N = smart_sympify(N_expr)
        dM_dy = sp.diff(M, y)
        dN_dx = sp.diff(N, x)
        return json.dumps({
            "dM_dy": sp.latex(dM_dy),
            "dN_dx": sp.latex(dN_dx),
            "dM_dy_str": str(dM_dy),
            "dN_dx_str": str(dN_dx),
            "M_latex": sp.latex(M),
            "N_latex": sp.latex(N)
        })
    except Exception as e:
        return json.dumps({"error": str(e)})

def check_exactness(dM_dy_str, dN_dx_str):
    x, y = sp.symbols('x y')
    dM = sp.sympify(dM_dy_str)
    dN = sp.sympify(dN_dx_str)
    return sp.simplify(dM - dN) == 0

def find_integrating_factor(M_expr, N_expr):
    x, y = sp.symbols('x y')
    try:
        M = smart_sympify(M_expr)
        N = smart_sympify(N_expr)
        dM_dy = sp.diff(M, y)
        dN_dx = sp.diff(N, x)
        
        # Try case 1: (dM/dy - dN/dx) / N depends only on x
        expr_x = sp.simplify((dM_dy - dN_dx) / N)
        if not expr_x.has(y):
            mu = sp.exp(sp.integrate(expr_x, x))
            return json.dumps({"type": "x", "mu": sp.latex(mu), "mu_str": str(mu), "expr": sp.latex(expr_x)})
        
        # Try case 2: (dN/dx - dM/dy) / M depends only on y
        expr_y = sp.simplify((dN_dx - dM_dy) / M)
        if not expr_y.has(x) or expr_y == 0:
            mu = sp.exp(sp.integrate(expr_y, y))
            return json.dumps({"type": "y", "mu": sp.latex(mu), "mu_str": str(mu), "expr": sp.latex(expr_y)})
    except:
        pass
    
    return json.dumps({"type": "none"})

def solve_exact_equation(M_expr, N_expr):
    x, y = sp.symbols('x y')
    M = smart_sympify(M_expr)
    N = smart_sympify(N_expr)
    intM = sp.integrate(M, x)
    d_intM_dy = sp.diff(intM, y)
    phi_prime = sp.simplify(N - d_intM_dy)
    phi = sp.integrate(phi_prime, y)
    u = intM + phi
    solution = sp.Eq(u, sp.Symbol('C'))
    return json.dumps({
        "intM": sp.latex(intM),
        "intM_str": str(intM),
        "d_intM_dy": sp.latex(d_intM_dy),
        "phi_prime": sp.latex(phi_prime),
        "phi_prime_str": str(phi_prime),
        "phi": sp.latex(phi),
        "phi_str": str(phi),
        "solution": sp.latex(solution),
        "solution_str": str(solution),
        "solution_u_str": str(u)
    })

def solve_with_integrating_factor(M_expr, N_expr, mu_str):
    x, y = sp.symbols('x y')
    M = smart_sympify(M_expr)
    N = smart_sympify(N_expr)
    mu = sp.sympify(mu_str)
    M_new = mu * M
    N_new = mu * N
    intM = sp.integrate(M_new, x)
    d_intM_dy = sp.diff(intM, y)
    phi_prime = sp.simplify(N_new - d_intM_dy)
    phi = sp.integrate(phi_prime, y)
    u = intM + phi
    solution = sp.Eq(u, sp.Symbol('C'))
    return json.dumps({
        "M_new": sp.latex(M_new),
        "N_new": sp.latex(N_new),
        "intM": sp.latex(intM),
        "intM_str": str(intM),
        "phi_prime": sp.latex(phi_prime),
        "phi_prime_str": str(phi_prime),
        "phi": sp.latex(phi),
        "phi_str": str(phi),
        "solution": sp.latex(solution),
        "solution_str": str(solution),
        "solution_u_str": str(u)
    })


def get_plot_data(u_expr_str, C_vals, x_min, x_max, num_points):
    x, y = sp.symbols('x y')
    try:
        u_expr = smart_sympify(u_expr_str)
    except Exception as e:
        return json.dumps({"error": str(e)})
        
    results = {}
    xs = np.linspace(x_min, x_max, num_points)
    
    for c in C_vals:
        try:
            # Solve u(x,y) = c for y
            sol_ys = sp.solve(sp.Eq(u_expr, c), y)
            branches = []
            for sol in sol_ys:
                try:
                    func = sp.lambdify(x, sol, 'numpy')
                    ys = func(xs)
                    # Filter out complex and infinite
                    # Note: lambdify with numpy might return complex numbers as objects
                    ys_numeric = np.array(ys, dtype=complex)
                    valid = (np.abs(np.imag(ys_numeric)) < 1e-6) & np.isfinite(ys_numeric)
                    if np.any(valid):
                        branches.append({
                            "x": xs[valid].tolist(),
                            "y": np.real(ys_numeric[valid]).astype(float).tolist()
                        })
                except:
                    continue
            results[str(c)] = branches
        except:
             results[str(c)] = []
    return json.dumps(results)
    `);
      
      pyodideInstance = pyodide;
      return pyodide;
    } catch (error) {
      console.error("Pyodide initialization failed:", error);
      initializationPromise = null; // Allow retry
      throw error;
    }
  })();

  return initializationPromise;
};
