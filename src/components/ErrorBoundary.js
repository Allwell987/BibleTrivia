import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
    this.handleRetry = this.handleRetry.bind(this);
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('Unhandled render error:', error);
  }

  handleRetry() {
    this.setState({ hasError: false });
    this.props.onRetry?.();
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Something went wrong</Text>
        <Text style={styles.subtitle}>Please try again.</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={this.handleRetry}
          accessibilityRole="button"
          accessibilityLabel="Retry app"
          accessibilityHint="Attempts to recover from an unexpected app error"
        >
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0D0A',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    color: '#F5EDD6',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: '#9E8E6A',
    fontSize: 14,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#C9A84C',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: {
    color: '#0F0D0A',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default ErrorBoundary;
