/**
 * MarkTag SDK Initialization
 * This file is loaded BEFORE React to ensure the queue is ready.
 * Placed in public/ so Vite copies it as-is without processing.
 */
(function () {
  // Step 1: Create the command queue
  window.mtrem = window.mtrem || [];

  // Step 2: Create the stub mtag function that queues all calls
  // The real SDK will replace this and drain the queue when it loads
  window.mtag = window.mtag || function () {
    window.mtrem.push(arguments);
  };

  // Step 3: Initialize the container
  window.mtag("init", "https://mtag.markopolo.ai?tagId=dxoDDL", { "consent": true });

  // Step 4: Fire initial ViewContent event
  window.mtag("event", { type: "ViewContent" });
})();
