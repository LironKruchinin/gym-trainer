import { sanitizeInput } from './sanitize.util';

describe('sanitizeInput', () => {
  it('removes html tags and extra spaces', () => {
    expect(sanitizeInput('  <b>Hi</b> <script>evil()</script> ')).toBe('Hi');
  });
});
