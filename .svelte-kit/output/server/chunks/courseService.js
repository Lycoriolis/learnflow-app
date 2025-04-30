const mockCourses = {};
mockCourses["mpsi-mathematiques"] = {
  id: "mpsi-mathematiques",
  title: "MPSI - Mathématiques (Classes Préparatoires)",
  description: "Comprehensive mathematics course covering the MPSI curriculum.",
  // Added description
  progress: Math.floor(Math.random() * 101),
  // Added placeholder progress
  modules: [
    {
      id: "semestre-1",
      title: "Semestre 1 : Fondements et Concepts de Base",
      lessons: [
        { id: "logique-raisonnement", title: "Logique et raisonnement" },
        { id: "ensembles-fonctions-relations", title: "Ensembles, fonctions et relations binaires" },
        { id: "sommations-produits", title: "Sommations et produits" },
        { id: "trigonometrie", title: "Trigonométrie" },
        { id: "nombres-complexes", title: "Nombres complexes" },
        { id: "fonctions-reelle", title: "Fonctions d’une variable réelle" },
        { id: "primitives-equadiff", title: "Primitives et équations différentielles linéaires" },
        { id: "nombres-reels", title: "Nombres réels" },
        { id: "suites", title: "Suites" },
        { id: "limites-continuites", title: "Limites et continuité des fonctions" },
        { id: "differentiabilite", title: "Dérivabilité des fonctions réelles" },
        { id: "convexite", title: "Convexité" },
        { id: "arithmetique-entiers", title: "Arithmétique dans l’ensemble des entiers" },
        { id: "structures-algebriques", title: "Structures algébriques usuelles" },
        { id: "matrices-systemes", title: "Calcul matriciel et systèmes linéaires" },
        { id: "polynomes", title: "Polynômes" },
        { id: "fractions-rationnelles", title: "Fractions rationnelles" }
      ]
    },
    {
      id: "semestre-2",
      title: "Semestre 2 : Approfondissements et Applications",
      lessons: [
        { id: "analyse-asymptotique", title: "Analyse asymptotique" },
        { id: "espaces-vectoriels", title: "Espaces vectoriels" },
        { id: "espaces-vectoriels-finidim", title: "Espaces vectoriels de dimension finie" },
        { id: "applications-lineaires", title: "Applications linéaires" },
        { id: "sous-espaces-affines", title: "Sous-espaces affines d’un espace vectoriel" },
        { id: "matrices-applications", title: "Matrices et applications linéaires" },
        { id: "changement-base", title: "Changement de base, équivalence et similarité" },
        { id: "groupe-symetrique-determinants", title: "Groupe symétrique et déterminants" },
        { id: "integration", title: "Intégration" },
        { id: "denombrement", title: "Dénombrement" },
        { id: "probabilites-variables", title: "Probabilités sur un univers fini, variables aléatoires et lois" },
        { id: "esperance-variance", title: "Espérance et variance" },
        { id: "prehilbert-reel", title: "Espaces préhilbertiens réels" },
        { id: "sommation-discrete", title: "Processus de sommation discrète" },
        { id: "fonctions-deux-variables", title: "Fonctions de deux variables" }
      ]
    }
  ]
};
mockCourses["intro-python"] = {
  id: "intro-python",
  title: "Introduction to Python Programming",
  description: "Learn the fundamentals of Python programming from scratch.",
  // Added description
  progress: Math.floor(Math.random() * 101),
  // Added placeholder progress
  modules: [
    {
      id: "basics",
      title: "Python Basics",
      lessons: [
        { id: "variables", title: "Variables and Data Types" },
        { id: "operators", title: "Operators" },
        { id: "control-flow", title: "Control Flow" }
      ]
    },
    {
      id: "functions-modules",
      title: "Functions and Modules",
      lessons: [
        { id: "defining-functions", title: "Defining Functions" },
        { id: "modules-packages", title: "Modules and Packages" }
      ]
    }
  ]
};
async function getCourse(id) {
  try {
    return Promise.resolve(mockCourses[id] || null);
  } catch (error) {
    console.error("Error loading course:", error);
    throw new Error("Failed to load course");
  }
}
export {
  getCourse as g
};
