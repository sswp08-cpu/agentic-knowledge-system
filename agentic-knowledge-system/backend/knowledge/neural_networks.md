# Neural Networks

Neural Networks are computing systems inspired by biological neural networks in the human brain, forming the foundation of [[Deep Learning]].

## Key Concepts

### Architecture
A neural network consists of layers of interconnected nodes (neurons):
- **Input Layer**: Receives raw data
- **Hidden Layers**: Process and transform data
- **Output Layer**: Produces final predictions

### How Neurons Work
Each neuron:
1. Receives inputs with associated weights
2. Computes weighted sum
3. Applies activation function
4. Passes output to next layer

### Activation Functions
- **ReLU**: f(x) = max(0, x) - most common
- **Sigmoid**: f(x) = 1/(1 + e^-x) - for binary outputs
- **Tanh**: f(x) = (e^x - e^-x)/(e^x + e^-x)
- **Softmax**: For multi-class classification

## Types of Neural Networks

### Feedforward Networks (FNN)
Information flows in one direction. Used for tabular data.

### Convolutional Neural Networks (CNN)
Specialized for image processing with convolutional layers. See [[Computer Vision]].

### Recurrent Neural Networks (RNN)
Process sequential data with memory. Used in [[Natural Language Processing]].

### Transformers
Attention-based architecture powering [[Large Language Models]].

## Training Process

1. **Forward Pass**: Input → Prediction
2. **Loss Calculation**: Compare prediction to actual
3. **Backpropagation**: Calculate gradients
4. **Weight Update**: Adjust weights via optimizer

## Key Hyperparameters
- Learning rate
- Batch size
- Number of layers/neurons
- Dropout rate
- Optimizer choice (Adam, SGD)

## Related Topics
- [[Machine Learning]]
- [[Deep Learning]]
- [[Transformers]]
- [[Backpropagation]]
- [[Gradient Descent]]

---
*Part of the Agentic Knowledge System*
