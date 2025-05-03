---
title: "Exercices: Séries numériques"
tags: ["mpsi-mathematiques","series-numeriques"]
---

# Exercices : Séries numériques

## Exercice 10.1 : Séries à termes positifs

1. **Convergence des séries de Riemann** : Montrer que la série $\sum_{n=1}^{\infty} \frac{1}{n^p}$ converge si et seulement si $p>1$.
2. **Comparaison de séries** : Montrer que si $\sum a_n$ et $\sum b_n$ sont deux séries à termes positifs telles que $a_n \leq b_n$ pour tout $n \geq N$, alors la convergence de $\sum b_n$ implique celle de $\sum a_n$.
3. **Série harmonique alternée** : Montrer que la série $\sum_{n=1}^{\infty} \frac{(-1)^{n+1}}{n}$ converge et trouver sa somme.
4. **Série de Bertrand** : Montrer que la série $\sum_{n=2}^{\infty} \frac{1}{n \log n}$ diverge.
5. **Série de Dirichlet** : Montrer que la série $\sum_{n=1}^{\infty} \frac{1}{n^s}$ converge pour $s>1$ et diverge pour $s\leq 1$.

## Exercice 10.2 : Séries absolument convergentes

1. **Critère de Cauchy** : Montrer que si $\sum |a_n|$ converge, alors $\sum a_n$ converge.
2. **Réarrangement des termes** : Montrer que si $\sum a_n$ est absolument convergente, alors toute permutation des termes de la série converge vers la même somme.
3. **Série de Fourier** : Montrer que la série $\sum_{n=1}^{\infty} \frac{\sin(nx)}{n}$ converge pour tout $x \in \mathbb{R} \setminus 2\pi\mathbb{Z}$.
4. **Série de Taylor** : Montrer que la série $\sum_{n=0}^{\infty} \frac{x^n}{n!}$ converge pour tout $x \in \mathbb{R}$ et que sa somme est $e^x$.
5. **Série de Laurent** : Montrer que la série $\sum_{n=-\infty}^{\infty} a_n z^n$ converge pour $z \in \mathbb{C}$ dans un anneau $r < |z| < R$.

## Exercice 10.3 : Séries semi-convergentes

1. **Série de Grandi** : Montrer que la série $1-1+1-1+\cdots$ diverge mais peut être sommée par la méthode de Césaro à $\frac{1}{2}$.
2. **Série de Leibniz** : Montrer que la série $\sum_{n=0}^{\infty} \frac{(-1)^n}{2n+1}$ converge vers $\frac{\pi}{4}$.
3. **Série de Dirichlet (alternée)** : Montrer que la série $\sum_{n=1}^{\infty} \frac{(-1)^n}{n^s}$ converge pour $s>0$.
4. **Série de Borel** : Montrer que la série $\sum_{n=0}^{\infty} \frac{x^n}{n!}$ converge pour tout $x \in \mathbb{C}$ et que sa somme est $e^x$.
5. **Série de Euler-Maclaurin** : Montrer que la série $\sum_{n=1}^{\infty} \frac{B_{2n}}{(2n)!} x^{2n-1}$ converge pour $|x|<2\pi$, où $B_{2n}$ sont les nombres de Bernoulli.

## Exercice 10.4 : Séries de puissances

1. **Rayon de convergence** : Trouver le rayon de convergence de la série $\sum_{n=0}^{\infty} n! x^n$.
2. **Série géométrique** : Montrer que la série $\sum_{n=0}^{\infty} x^n$ converge pour $|x|<1$ et que sa somme est $\frac{1}{1-x}$.
3. **Série exponentielle** : Montrer que la série $\sum_{n=0}^{\infty} \frac{x^n}{n!}$ converge pour tout $x \in \mathbb{R}$ et que sa somme est $e^x$.
4. **Série binomiale** : Montrer que la série $\sum_{n=0}^{\infty} \binom{x}{n}$ converge pour $|x|<1$ et que sa somme est $(1+x)^x$.
5. **Série de Lagrange** : Montrer que la série $\sum_{n=0}^{\infty} \frac{x^n}{n^2}$ converge pour $|x|<1$ et que sa somme est $\frac{\pi^2}{6}$.

## Exercice 10.5 : Séries de Fourier

1. **Série de Fourier d'une fonction paire** : Montrer que la série de Fourier de $f(x)=\cos(x)$ sur $[-\pi,\pi]$ est $\sum_{n=0}^{\infty} \frac{(-1)^n}{(2n)!} x^{2n}$.
2. **Série de Fourier d'une fonction impaire** : Montrer que la série de Fourier de $f(x)=\sin(x)$ sur $[-\pi,\pi]$ est $\sum_{n=0}^{\infty} \frac{(-1)^n}{(2n+1)!} x^{2n+1}$.
3. **Série de Fourier d'une fonction périodique** : Montrer que la série de Fourier de $f(x)=e^{ix}$ sur $[-\pi,\pi]$ est $\sum_{n=-\infty}^{\infty} \delta_{n,1} e^{inx}$, où $\delta_{n,1}$ est le symbole de Kronecker.
4. **Série de Fourier d'une fonction continue** : Montrer que la série de Fourier de $f(x)=x$ sur $[-\pi,\pi]$ est $\sum_{n=1}^{\infty} \frac{2(-1)^{n+1}}{n} \sin(nx)$.
5. **Série de Fourier d'une fonction discontinue** : Montrer que la série de Fourier de $f(x)=\mathrm{sgn}(x)$ sur $[-\pi,\pi]$ est $\sum_{n=0}^{\infty} \frac{4}{(2n+1)\pi} \sin((2n+1)x)$.
