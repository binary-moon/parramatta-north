export const updateVideoTags = (html: string): string => {
  if (typeof window !== "undefined") {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Remove all div.wp-video elements
    const wpVideoDivs = doc.querySelectorAll<HTMLDivElement>("div.wp-video");
    wpVideoDivs.forEach((div) => {
      const videoElement = div.querySelector("video");
      if (videoElement) {
        div.parentNode?.replaceChild(videoElement, div);
      }
    });

    // Remove IE9 specific tags
    const ie9Scripts = doc.querySelectorAll("script");
    ie9Scripts.forEach((script) => {
      if (script.textContent?.includes("document.createElement('video')")) {
        script.parentNode?.removeChild(script);
      }
    });

    const videoTags = doc.querySelectorAll<HTMLVideoElement>("video");
    videoTags.forEach((video) => {
      const width = video.getAttribute("width");
      const height = video.getAttribute("height");
      const mp4 = video.getAttribute("mp4");

      if (mp4) {
        const newVideoTag = document.createElement("video");
        if (width) newVideoTag.setAttribute("width", width);
        if (height) newVideoTag.setAttribute("height", height);
        newVideoTag.setAttribute("controls", "controls");
        newVideoTag.setAttribute("preload", "metadata");

        const sourceTag = document.createElement("source");
        sourceTag.setAttribute("src", `${mp4}#t=0.001`);
        sourceTag.setAttribute("type", "video/mp4");

        newVideoTag.appendChild(sourceTag);
        newVideoTag.appendChild(
          document.createTextNode(
            "Your browser does not support the video tag."
          )
        );

        video.parentNode?.replaceChild(newVideoTag, video);
      }
    });

    return doc.body.innerHTML;
  }

  return html;
};

export const decodeHtmlEntities = (text: string) => {
  if (typeof window === "undefined") {
    return "";
  }
  const textArea = document.createElement("textarea");
  textArea.innerHTML = text;
  return textArea.value;
};
