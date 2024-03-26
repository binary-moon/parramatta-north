export const loadScript = (url: string, callback: () => void): void => {
  // Check if the script already exists
  const existingScript = document.querySelector(`script[src="${url}"]`);

  if (existingScript) {
    // If the script already exists, check if it has loaded
    if (existingScript.getAttribute('data-loaded') === 'true') {
      // If the script has already loaded, call the callback immediately
      callback();
    } else {
      // If the script exists but hasn't loaded yet, wait for it to load
      existingScript.addEventListener('load', callback);
    }
  } else {
    // If the script doesn't exist, create a new script element
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.onload = function() {
      // Set a data attribute to indicate that the script has loaded
      script.setAttribute('data-loaded', 'true');
      callback();
    };
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
  }
};