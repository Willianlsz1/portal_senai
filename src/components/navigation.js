'use strict';

function delegateNavigation(root, selector, callback) {
  if (!root) return () => {};

  const handler = event => {
    const trigger = event.target.closest(selector);
    if (!trigger || !root.contains(trigger)) return;
    callback(trigger, event);
  };

  root.addEventListener('click', handler);
  root.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    handler(event);
  });

  return () => root.removeEventListener('click', handler);
}

window.delegateNavigation = delegateNavigation;
