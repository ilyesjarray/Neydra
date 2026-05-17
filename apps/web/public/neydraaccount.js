
    window.onerror = function (message, source, lineno, colno, error) {
      alert("JAVASCRIPT ERROR:\n" + message + "\nLine: " + lineno);
      return false;
    };
  