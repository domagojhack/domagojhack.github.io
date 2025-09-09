# Monte Carlo Simulation Task for Ecology with AI Agent

This task challenges you to use an AI agent, such as GitHub Copilot in Agent Mode within Visual Studio Code, to create a Monte Carlo simulation for an ecological problem: estimating the probability of species persistence in a habitat patch under random environmental fluctuations. This exercise is designed to help you leverage AI agents to solve a practical ecology problem, mirroring real-world applications in conservation and population dynamics.

## Task Overview

Your goal is to use a Monte Carlo method to simulate population dynamics of a species in a habitat patch, accounting for random environmental variations (e.g., rainfall affecting birth rates). The simulation will estimate the probability that the population survives (i.e., avoids extinction) over a specified time period. You’ll use Python, and the AI agent will assist in writing, debugging, and saving the results.

### Problem Statement

- **Objective**: Estimate the probability of a species’ population persisting (population > 0) after 100 years in a habitat patch, given stochastic birth and death rates influenced by environmental fluctuations.
- **Steps**:
  1. Model a population starting with `N = 100` individuals.
  2. Simulate 100 years, where each year:
     - Birth rate (`b`) is drawn randomly from a normal distribution (mean = 0.3, std = 0.05).
     - Death rate (`d`) is drawn randomly from a normal distribution (mean = 0.2, std = 0.05).
     - Update population: `N = N + N * (b - d)` (rounded to nearest integer).
     - Ensure `N` cannot go negative (set to 0 if it would).
  3. Run 10,000 simulations to estimate the proportion of scenarios where `N > 0` after 100 years.
  4. Save the persistence probability and number of simulations to a text file.
- **Output**: Save results to `species_persistence.txt` in the format: `Persistence Probability: <value>, Simulations: <n>`.
- **Libraries**: Use `numpy` for random number generation and file I/O for saving results.
- **Challenge**: Ensure the code is modular, with a function for the population simulation and another for saving results. Add comments for clarity and handle edge cases (e.g., negative birth/death rates).

### Suggested Prompt for AI Agent

To complete this task using an AI agent like GitHub Copilot in Agent Mode, open VS Code, create a new file (`species_persistence.py`), and use a prompt like this in the Copilot Chat view:

> Create a Python script `species_persistence.py` to estimate species persistence probability using a Monte Carlo method. Simulate a population starting at 100 individuals for 100 years, with birth rate (normal, mean=0.3, std=0.05) and death rate (normal, mean=0.2, std=0.05) drawn each year. Update population as N = N + N * (b - d), rounded, with N >= 0. Run 10,000 simulations and calculate the proportion where N > 0 at the end. Use numpy for random numbers. Save results to `species_persistence.txt` as "Persistence Probability: <value>, Simulations: <n>". Include modular functions for simulation and saving, with comments and error handling for file I/O.

### Expected Workflow with AI Agent

1. **Code Generation**: The AI agent should generate a script with:
   - A function `simulate_population(n_years, initial_pop)` to run one simulation.
   - A function `run_monte_carlo(n_sims, n_years, initial_pop)` to run multiple simulations and compute persistence probability.
   - A function `save_results(probability, n_sims)` to write results to a file.
   - Error handling for file operations and invalid rates (e.g., negative values).
2. **Dependency Management**: If `numpy` isn’t installed, the agent may suggest `pip install numpy` in the terminal.
3. **Debugging**: Use the Copilot Edits view to review changes. If errors occur (e.g., file path issues or negative rates), ask the agent to fix them with a prompt like: “Ensure birth and death rates are non-negative in `species_persistence.py`.”
4. **Testing**: Run the script in VS Code and check `species_persistence.txt`. The persistence probability should be a value between 0 and 1, likely around 0.8–0.9 given the parameters.

### Example Solution (For Reference)

While you should rely on the AI agent to generate the code, here’s a sample solution to guide your expectations:

```python
import numpy as np

def simulate_population(n_years, initial_pop):
    """Simulate population dynamics for n_years with stochastic birth/death rates."""
    pop = initial_pop
    for _ in range(n_years):
        # Draw birth and death rates from normal distributions
        b = max(0, np.random.normal(0.3, 0.05))  # Ensure non-negative
        d = max(0, np.random.normal(0.2, 0.05))
        # Update population
        pop = round(pop + pop * (b - d))
        pop = max(0, pop)  # Prevent negative population
        if pop == 0:
            break  # Extinction
    return pop

def run_monte_carlo(n_sims, n_years, initial_pop):
    """Run n_sims Monte Carlo simulations and calculate persistence probability."""
    survived = 0
    for _ in range(n_sims):
        final_pop = simulate_population(n_years, initial_pop)
        if final_pop > 0:
            survived += 1
    return survived / n_sims

def save_results(probability, n_sims, filename="species_persistence.txt"):
    """Save persistence probability and number of simulations to a file."""
    try:
        with open(filename, 'w') as f:
            f.write(f"Persistence Probability: {probability}, Simulations: {n_sims}")
        print(f"Results saved to {filename}")
    except IOError as e:
        print(f"Error saving file: {e}")

# Run simulation
n_simulations = 10000
n_years = 100
initial_population = 100
persistence_prob = run_monte_carlo(n_simulations, n_years, initial_population)
save_results(persistence_prob, n_simulations)
```

### Tips for Success

- **Clear Prompts**: Include specific parameters (e.g., `n_sims=10000`, file name, library) to guide the AI agent.
- **Verify Output**: Check `species_persistence.txt` to ensure the format is correct and the probability is reasonable.
- **Handle Edge Cases**: If the AI-generated code doesn’t account for negative rates, prompt: “Add max(0, rate) to birth and death rates.”
- **Experiment**: Try varying `n_years` or the mean/std of rates to explore how environmental variability affects persistence.

### Why This Task Matters for Ecology

This task reflects real-world ecological challenges, such as predicting species survival under climate variability or habitat disturbance. Monte Carlo methods are widely used in ecology to model population viability, assess extinction risks, and inform conservation strategies. By using an AI agent, you’ll learn to automate complex simulations, focus on interpreting ecological outcomes, and iterate efficiently—key skills for modern ecological research.

Try this task with your AI agent, and see how it helps you model species persistence in a dynamic environment!