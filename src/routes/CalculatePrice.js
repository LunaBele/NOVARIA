const express = require('express');
const ListCalculator = require('./Calc/Calculate.js');

function register(app) {
  app.get('/api/CalculatePrice', (req, res) => {
    const tool = req.query;

    if (!tool || typeof tool.Name !== 'string' || !tool.Weight) {
      return res.status(400).json({ error: 'Missing or invalid required parameters: Name (string), Weight' });
    }

    const weightValue = parseFloat(tool.Weight);
    if (isNaN(weightValue)) {
      return res.status(400).json({ error: 'Invalid Weight parameter, must be a number.' });
    }

    try {
      tool.Weight = { value: weightValue };
      tool.Variant = { value: tool.Variant || 'Normal' };

      if (tool.Mutation) {
        tool.attributes = tool.Mutation.split(',').map(m => m.trim());
      } else {
        tool.attributes = [];
      }

      const result = ListCalculator.calculateFruit(tool);
      return res.json({ value: result });
    } catch (error) {
      console.error("Error calculating fruit value:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
}

module.exports = { register };
