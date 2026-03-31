import React from 'react';
import { render } from '@testing-library/react-native';
import AnswerOption from '../src/components/AnswerOption';
import { ThemeProvider } from '../src/context/ThemeContext';

describe('AnswerOption', () => {
  it('renders option text and letter', () => {
    const { getByText } = render(
      <ThemeProvider>
        <AnswerOption
          option="Genesis"
          index={0}
          selected={null}
          correctAnswer="Genesis"
          isTimeout={false}
          onSelect={() => {}}
        />
      </ThemeProvider>
    );
    expect(getByText('Genesis')).toBeTruthy();
    expect(getByText('A')).toBeTruthy();
  });
});
