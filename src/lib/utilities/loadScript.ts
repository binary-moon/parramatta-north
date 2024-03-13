export const loadScript = (url: string, callback: () => void): void => {
  let script = document.createElement('script');
  script.type = 'text/javascript';

  script.onload = function() {
    callback();
  };

  script.src = url;
  document.getElementsByTagName('head')[0].appendChild(script);
}