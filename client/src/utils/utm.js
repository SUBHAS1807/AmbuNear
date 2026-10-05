/**
 * UTM Campaign Parameter Extraction (Enhancement #14)
 * Parses UTM query parameters from URL safely without storing any PII.
 */
export const captureUtmParameters = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const utmFields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    const captured = {};
    let found = false;

    utmFields.forEach((field) => {
      const val = params.get(field);
      if (val) {
        captured[field] = val.substring(0, 50); // limit length
        found = true;
      }
    });

    if (found) {
      sessionStorage.setItem('ambunear_utm', JSON.stringify(captured));
    }
  } catch (e) {
    // Silent catch
  }
};

export const getSavedUtm = () => {
  try {
    const data = sessionStorage.getItem('ambunear_utm');
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};
