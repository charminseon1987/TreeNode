import * as React from 'react';
import React__default, { useMemo, useCallback, useRef, useEffect, useState, useImperativeHandle, useContext, useReducer, createElement } from 'react';
import { Icon } from 'mendix/components/web/Icon';

var InteractionMode;
(function (InteractionMode) {
  InteractionMode["DoubleClickItemToExpand"] = "double-click-item-to-expand";
  InteractionMode["ClickItemToExpand"] = "click-item-to-expand";
  InteractionMode["ClickArrowToExpand"] = "click-arrow-to-expand";
})(InteractionMode || (InteractionMode = {}));

var __assign$b = undefined && undefined.__assign || function () {
  __assign$b = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign$b.apply(this, arguments);
};
var mergeInteractionManagers = function (main, fallback) {
  return {
    mode: main.mode,
    createInteractiveElementProps: function (item, treeId, actions, renderFlags) {
      return __assign$b(__assign$b({}, fallback.createInteractiveElementProps(item, treeId, actions, renderFlags)), main.createInteractiveElementProps(item, treeId, actions, renderFlags));
    }
  };
};

var isControlKey = function (e) {
  return e.ctrlKey || navigator.platform.toUpperCase().indexOf('MAC') >= 0 && e.metaKey;
};

var DoubleClickItemToExpandInteractionManager = /** @class */function () {
  function DoubleClickItemToExpandInteractionManager(environment) {
    this.mode = InteractionMode.DoubleClickItemToExpand;
    this.environment = environment;
  }
  DoubleClickItemToExpandInteractionManager.prototype.createInteractiveElementProps = function (item, treeId, actions, renderFlags) {
    var _this = this;
    return {
      onClick: function (e) {
        actions.focusItem();
        if (e.shiftKey) {
          actions.selectUpTo(!isControlKey(e));
        } else if (isControlKey(e)) {
          if (renderFlags.isSelected) {
            actions.unselectItem();
          } else {
            actions.addToSelectedItems();
          }
        } else {
          actions.selectItem();
        }
      },
      onDoubleClick: function () {
        actions.focusItem();
        actions.selectItem();
        if (item.isFolder) {
          actions.toggleExpandedState();
        }
        if (!item.isFolder || _this.environment.canInvokePrimaryActionOnItemContainer) {
          actions.primaryAction();
        }
      },
      onFocus: function () {
        actions.focusItem();
      },
      onDragStart: function (e) {
        e.dataTransfer.dropEffect = 'move';
        actions.startDragging();
      },
      onDragOver: function (e) {
        e.preventDefault(); // Allow drop
      },
      draggable: renderFlags.canDrag && !renderFlags.isRenaming,
      tabIndex: !renderFlags.isRenaming ? renderFlags.isFocused ? 0 : -1 : undefined
    };
  };
  return DoubleClickItemToExpandInteractionManager;
}();

var ClickItemToExpandInteractionManager = /** @class */function () {
  function ClickItemToExpandInteractionManager(environment) {
    this.mode = InteractionMode.ClickItemToExpand;
    this.environment = environment;
  }
  ClickItemToExpandInteractionManager.prototype.createInteractiveElementProps = function (item, treeId, actions, renderFlags) {
    var _this = this;
    return {
      onClick: function (e) {
        actions.focusItem();
        if (e.shiftKey) {
          actions.selectUpTo(!isControlKey(e));
        } else if (isControlKey(e)) {
          if (renderFlags.isSelected) {
            actions.unselectItem();
          } else {
            actions.addToSelectedItems();
          }
        } else {
          if (item.isFolder) {
            actions.toggleExpandedState();
          }
          actions.selectItem();
          if (!item.isFolder || _this.environment.canInvokePrimaryActionOnItemContainer) {
            actions.primaryAction();
          }
        }
      },
      onFocus: function () {
        actions.focusItem();
      },
      onDragStart: function (e) {
        e.dataTransfer.dropEffect = 'move';
        actions.startDragging();
      },
      onDragOver: function (e) {
        e.preventDefault(); // Allow drop
      },
      draggable: renderFlags.canDrag && !renderFlags.isRenaming,
      tabIndex: !renderFlags.isRenaming ? renderFlags.isFocused ? 0 : -1 : undefined
    };
  };
  return ClickItemToExpandInteractionManager;
}();

var ClickArrowToExpandInteractionManager = /** @class */function () {
  function ClickArrowToExpandInteractionManager(environment) {
    this.mode = InteractionMode.ClickItemToExpand;
    this.environment = environment;
  }
  ClickArrowToExpandInteractionManager.prototype.createInteractiveElementProps = function (item, treeId, actions, renderFlags) {
    var _this = this;
    return {
      onClick: function (e) {
        actions.focusItem();
        if (e.shiftKey) {
          actions.selectUpTo(!isControlKey(e));
        } else if (isControlKey(e)) {
          if (renderFlags.isSelected) {
            actions.unselectItem();
          } else {
            actions.addToSelectedItems();
          }
        } else {
          actions.selectItem();
          if (!item.isFolder || _this.environment.canInvokePrimaryActionOnItemContainer) {
            actions.primaryAction();
          }
        }
      },
      onFocus: function () {
        actions.focusItem();
      },
      onDragStart: function (e) {
        e.dataTransfer.dropEffect = 'move';
        actions.startDragging();
      },
      onDragOver: function (e) {
        e.preventDefault(); // Allow drop
      },
      draggable: renderFlags.canDrag && !renderFlags.isRenaming,
      tabIndex: !renderFlags.isRenaming ? renderFlags.isFocused ? 0 : -1 : undefined
    };
  };
  return ClickArrowToExpandInteractionManager;
}();

var buildInteractionMode = function (mode, environment) {
  switch (mode) {
    case InteractionMode.DoubleClickItemToExpand:
      return new DoubleClickItemToExpandInteractionManager(environment);
    case InteractionMode.ClickItemToExpand:
      return new ClickItemToExpandInteractionManager(environment);
    case InteractionMode.ClickArrowToExpand:
      return new ClickArrowToExpandInteractionManager(environment);
    default:
      throw Error("Unknown interaction mode ".concat(mode));
  }
};

var InteractionManagerContext = React.createContext(null);
var useInteractionManager = function () {
  return React.useContext(InteractionManagerContext);
};
var InteractionManagerProvider = function (_a) {
  var children = _a.children;
  var environment = useTreeEnvironment();
  var defaultInteractionMode = environment.defaultInteractionMode;
  var interactionManager = useMemo(function () {
    var _a;
    if (defaultInteractionMode && typeof defaultInteractionMode !== 'string') {
      if (defaultInteractionMode.extends) {
        return mergeInteractionManagers(defaultInteractionMode, buildInteractionMode(defaultInteractionMode.extends, environment));
      }
      return defaultInteractionMode;
    }
    return buildInteractionMode((_a = defaultInteractionMode) !== null && _a !== void 0 ? _a : InteractionMode.ClickItemToExpand, environment);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // TODO make sure that environment does not need to be refreshed
  return React.createElement(InteractionManagerContext.Provider, {
    value: interactionManager
  }, children);
};

var useCanDropAt = function () {
  var environment = useTreeEnvironment();
  return useCallback(function (draggingPosition, draggingItems) {
    if (draggingPosition.targetType === 'between-items') {
      if (!environment.canReorderItems) {
        return false;
      }
    } else if (draggingPosition.targetType === 'root') {
      if (!environment.canDropOnFolder) {
        return false;
      }
    } else {
      var resolvedItem = environment.items[draggingPosition.targetItem];
      if (!resolvedItem || !environment.canDropOnFolder && resolvedItem.isFolder || !environment.canDropOnNonFolder && !resolvedItem.isFolder || draggingItems.some(function (draggingItem) {
        return draggingItem.index === draggingPosition.targetItem;
      })) {
        return false;
      }
    }
    if (environment.canDropAt && (!draggingItems || !environment.canDropAt(draggingItems, draggingPosition))) {
      // setDraggingPosition(undefined);
      return false;
    }
    return true;
  }, [environment]);
};

var useGetGetParentOfLinearItem = function () {
  var environment = useTreeEnvironment();
  return useCallback(function (itemLinearIndex, treeId) {
    var linearItems = environment.linearItems[treeId];
    var depth = linearItems[itemLinearIndex].depth;
    var parentLinearIndex = itemLinearIndex;
    for (; !!linearItems[parentLinearIndex] && linearItems[parentLinearIndex].depth !== depth - 1; parentLinearIndex -= 1);
    var parent = linearItems[parentLinearIndex];
    if (!parent) {
      parent = {
        item: environment.trees[treeId].rootItem,
        depth: 0
      };
      parentLinearIndex = 0;
    }
    return {
      parent: parent,
      parentLinearIndex: parentLinearIndex
    };
  }, [environment.linearItems, environment.trees]);
};

/* eslint-disable no-continue */
var useGetViableDragPositions = function () {
  var environment = useTreeEnvironment();
  var getParentOfLinearItem = useGetGetParentOfLinearItem();
  var canDropAt = useCanDropAt();
  var isDescendant = useCallback(function (treeId, itemLinearIndex, potentialParents) {
    // based on DraggingPositionEvaluation.isDescendant()
    var _a = getParentOfLinearItem(itemLinearIndex, treeId),
      parent = _a.parent,
      parentLinearIndex = _a.parentLinearIndex;
    if (potentialParents.some(function (p) {
      return p.index === parent.item;
    })) return true;
    if (parent.depth === 0) return false;
    return isDescendant(treeId, parentLinearIndex, potentialParents);
  }, [getParentOfLinearItem]);
  return useCallback(function (treeId, draggingItems) {
    var _a, _b;
    var linearItems = environment.linearItems[treeId];
    var targets = [];
    var skipUntilDepthIsLowerThan = -1;
    for (var linearIndex = 0; linearIndex < linearItems.length;
    // eslint-disable-next-line no-plusplus
    linearIndex++) {
      var _c = linearItems[linearIndex],
        item = _c.item,
        depth = _c.depth;
      if (skipUntilDepthIsLowerThan !== -1 && depth > skipUntilDepthIsLowerThan) {
        continue;
      } else {
        skipUntilDepthIsLowerThan = -1;
      }
      var parent_1 = getParentOfLinearItem(linearIndex, treeId).parent;
      var childIndex = environment.items[parent_1.item].children.indexOf(item);
      if (isDescendant(treeId, linearIndex, draggingItems)) {
        skipUntilDepthIsLowerThan = depth + 1;
        continue;
      }
      var itemPosition = {
        targetType: 'item',
        parentItem: parent_1.item,
        targetItem: item,
        linearIndex: linearIndex,
        depth: depth,
        treeId: treeId
      };
      var topPosition = {
        targetType: 'between-items',
        parentItem: parent_1.item,
        linePosition: 'top',
        childIndex: childIndex,
        depth: depth,
        treeId: treeId,
        linearIndex: linearIndex
      };
      var bottomPosition = {
        targetType: 'between-items',
        parentItem: parent_1.item,
        linePosition: 'bottom',
        linearIndex: linearIndex + 1,
        childIndex: childIndex + 1,
        depth: depth,
        treeId: treeId
      };
      var skipTopPosition = depth === ((_b = (_a = linearItems[linearIndex - 1]) === null || _a === void 0 ? void 0 : _a.depth) !== null && _b !== void 0 ? _b : -1);
      if (!skipTopPosition && canDropAt(topPosition, draggingItems)) {
        targets.push(topPosition);
      }
      if (canDropAt(itemPosition, draggingItems)) {
        targets.push(itemPosition);
      }
      if (canDropAt(bottomPosition, draggingItems)) {
        targets.push(bottomPosition);
      }
    }
    return targets;
  }, [canDropAt, environment.items, environment.linearItems, getParentOfLinearItem, isDescendant]);
};

var __spreadArray$4 = undefined && undefined.__spreadArray || function (to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};
var useSideEffect = function (effect, deps, changeOn) {
  var previousRef = useRef();
  useEffect(function () {
    if (!previousRef.current) {
      previousRef.current = __spreadArray$4([], changeOn, true);
      effect();
    } else {
      var changed = previousRef.current.some(function (v, i) {
        return v !== changeOn[i];
      });
      if (changed) {
        previousRef.current = __spreadArray$4([], changeOn, true);
        effect();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, __spreadArray$4(__spreadArray$4([], deps, true), changeOn, true));
};

var __assign$a = undefined && undefined.__assign || function () {
  __assign$a = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign$a.apply(this, arguments);
};
var buildMapForTrees = function (treeIds, build) {
  return treeIds.map(function (id) {
    return [id, build(id)];
  }).reduce(function (a, _a) {
    var _b;
    var id = _a[0],
      obj = _a[1];
    return __assign$a(__assign$a({}, a), (_b = {}, _b[id] = obj, _b));
  }, {});
};
var getDocument = function () {
  return typeof document !== 'undefined' ? document : undefined;
};

/**
 * React hook that schedules a callback to be run "soon" and will cancel the
 * callback if it is still pending when the component is unmounted.
 *
 * @returns A function that can be used to schedule a deferred callback.
 */
function useCallSoon(dontClean) {
  if (dontClean === void 0) {
    dontClean = false;
  }
  var handleRef = useRef(new Array());
  useEffect(function () {
    if (dontClean) {
      return function () {};
    }
    var handles = handleRef.current;
    return function () {
      return handles.forEach(function (handle) {
        return cancelAnimationFrame(handle);
      });
    };
  }, [dontClean, handleRef]);
  return useCallback(function (callback) {
    var handle = requestAnimationFrame(function () {
      handleRef.current.splice(handleRef.current.indexOf(handle), 1);
      callback();
    });
    handleRef.current.push(handle);
  }, [handleRef]);
}

var useRefCopy = function (value) {
  var ref = useRef(value);
  ref.current = value;
  return ref;
};

var useStableHandler = function (handler) {
  var handlerRef = useRefCopy(handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    return handlerRef.current.apply(handlerRef, args);
  }, [handlerRef]);
};

var useGetOriginalItemOrder = function () {
  var env = useTreeEnvironment();
  return useStableHandler(function (treeId, items) {
    return items.map(function (item) {
      return [item, env.linearItems[treeId].findIndex(function (linearItem) {
        return linearItem.item === item.index;
      })];
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .sort(function (_a, _b) {
      _a[0];
        var aPos = _a[1];
      _b[0];
        var bPos = _b[1];
      return aPos - bPos;
    }).map(function (_a) {
      var item = _a[0];
      return item;
    });
  });
};

var computeItemHeight = function (treeId) {
  var _a;
  var firstItem = (_a = getDocument()) === null || _a === void 0 ? void 0 : _a.querySelector("[data-rct-tree=\"".concat(treeId, "\"] [data-rct-item-container=\"true\"]"));
  if (firstItem) {
    var style = getComputedStyle(firstItem);
    // top margin flows into the bottom margin of the previous item, so ignore it
    return firstItem.offsetHeight + Math.max(parseFloat(style.marginTop), parseFloat(style.marginBottom));
  }
  return 5;
};
var isOutsideOfContainer = function (e, treeBb) {
  return e.clientX <= treeBb.left || e.clientX >= treeBb.right || e.clientY <= treeBb.top || e.clientY >= treeBb.bottom;
};

var DraggingPositionEvaluation = /** @class */function () {
  function DraggingPositionEvaluation(env, e, treeId, hoveringPosition, draggingItems, getParentOfLinearItem) {
    this.env = env;
    this.e = e;
    this.treeId = treeId;
    this.linearIndex = hoveringPosition.linearIndex;
    this.offset = hoveringPosition.offset;
    this.indentation = hoveringPosition.indentation;
    this.targetItem = this.env.linearItems[this.treeId][this.linearIndex];
    this.getParentOfLinearItem = getParentOfLinearItem;
    this.draggingItems = draggingItems;
  }
  DraggingPositionEvaluation.prototype.getEmptyTreeDragPosition = function () {
    return {
      targetType: 'root',
      treeId: this.treeId,
      depth: 0,
      linearIndex: 0,
      targetItem: this.env.trees[this.treeId].rootItem
    };
  };
  /**
   * If reordering is not allowed, dragging on non-folder items redirects
   * the drag target to the parent of the target item.
   */
  DraggingPositionEvaluation.prototype.maybeRedirectToParent = function () {
    var redirectTargetToParent = !this.env.canReorderItems && !this.env.canDropOnNonFolder && !this.env.items[this.targetItem.item].isFolder;
    if (redirectTargetToParent) {
      var _a = this.getParentOfLinearItem(this.linearIndex, this.treeId),
        parentLinearIndex = _a.parentLinearIndex,
        parent_1 = _a.parent;
      this.targetItem = parent_1;
      this.linearIndex = parentLinearIndex;
    }
  };
  /**
   * If the item is the last in a group, and the drop is at the bottom,
   * the x-coordinate of the mouse allows to reparent upwards.
   */
  DraggingPositionEvaluation.prototype.maybeReparentUpwards = function () {
    var _a, _b;
    if (this.indentation === undefined) {
      return undefined;
    }
    var treeLinearItems = this.env.linearItems[this.treeId];
    var deepestDepth = treeLinearItems[this.linearIndex].depth;
    // Default to zero on last position to allow dropping on root when
    // dropping at bottom
    var legalDropDepthCount =
    // itemDepthDifferenceToNextItem/isLastInGroup
    deepestDepth - ((_b = (_a = treeLinearItems[this.linearIndex + 1]) === null || _a === void 0 ? void 0 : _a.depth) !== null && _b !== void 0 ? _b : 0);
    var canReparentUpwards = this.offset === 'bottom' && legalDropDepthCount > 0;
    if (!canReparentUpwards) {
      return undefined;
    }
    var droppingIndent = Math.max(deepestDepth - legalDropDepthCount, this.indentation);
    var newParent = {
      parentLinearIndex: this.linearIndex,
      parent: this.targetItem
    };
    var insertionItemAbove;
    for (var i = deepestDepth; i >= droppingIndent; i -= 1) {
      insertionItemAbove = newParent;
      newParent = this.getParentOfLinearItem(newParent.parentLinearIndex, this.treeId);
    }
    if (this.indentation === treeLinearItems[this.linearIndex].depth) {
      return undefined;
    }
    if (!insertionItemAbove) {
      return undefined;
    }
    var reparentedChildIndex = this.env.items[newParent.parent.item].children.indexOf(insertionItemAbove.parent.item) + 1;
    if (this.draggingItems && this.isDescendant(this.treeId, newParent.parentLinearIndex + 1, this.draggingItems)) {
      return undefined;
    }
    return {
      targetType: 'between-items',
      treeId: this.treeId,
      parentItem: newParent.parent.item,
      depth: droppingIndent,
      linearIndex: this.linearIndex + 1,
      childIndex: reparentedChildIndex,
      linePosition: 'bottom'
    };
  };
  /**
   * Don't allow to drop at bottom of an open folder, since that will place
   * it visually at a different position. Redirect the drag target to the
   * top of the folder contents in that case.
   */
  DraggingPositionEvaluation.prototype.maybeRedirectInsideOpenFolder = function () {
    var nextItem = this.env.linearItems[this.treeId][this.linearIndex + 1];
    var redirectInsideOpenFolder = !this.env.canDropBelowOpenFolders && nextItem && this.targetItem.depth === nextItem.depth - 1 && this.offset === 'bottom';
    if (redirectInsideOpenFolder) {
      this.targetItem = nextItem;
      this.linearIndex += 1;
      this.offset = 'top';
    }
  };
  /**
   * Inside a folder, only drop at bottom offset to make it visually
   * consistent. This also maps to bottom offset for items below open
   * subtrees, to keep the x-coordinate based dropping consistent (only
   * if indentation is defined).
   */
  DraggingPositionEvaluation.prototype.maybeMapToBottomOffset = function () {
    var priorItem = this.env.linearItems[this.treeId][this.linearIndex - 1];
    if (!priorItem || (priorItem === null || priorItem === void 0 ? void 0 : priorItem.depth) === undefined) return;
    var depthDistanceToPrior = priorItem.depth - this.targetItem.depth;
    if (this.offset === 'top' && (depthDistanceToPrior === 0 || depthDistanceToPrior > 0 && this.indentation !== undefined)) {
      this.offset = 'bottom';
      this.linearIndex -= 1;
      this.targetItem = this.env.linearItems[this.treeId][this.linearIndex];
    }
  };
  DraggingPositionEvaluation.prototype.canDropAtCurrentTarget = function () {
    var _this = this;
    var _a;
    var targetItemData = this.env.items[this.targetItem.item];
    if (!this.offset && !this.env.canDropOnNonFolder && !targetItemData.isFolder) {
      return false;
    }
    if (!this.offset && !this.env.canDropOnFolder && targetItemData.isFolder) {
      return false;
    }
    if (this.offset && !this.env.canReorderItems) {
      return false;
    }
    if ((_a = this.draggingItems) === null || _a === void 0 ? void 0 : _a.some(function (draggingItem) {
      return draggingItem.index === _this.targetItem.item;
    })) {
      return false;
    }
    return true;
  };
  DraggingPositionEvaluation.prototype.getDraggingPosition = function () {
    if (this.env.linearItems[this.treeId].length === 0) {
      return this.getEmptyTreeDragPosition();
    }
    if (!this.draggingItems || this.linearIndex < 0 || this.linearIndex >= this.env.linearItems[this.treeId].length) {
      return undefined;
    }
    this.maybeRedirectToParent();
    this.maybeRedirectInsideOpenFolder();
    this.maybeMapToBottomOffset();
    var reparented = this.maybeReparentUpwards();
    if (reparented) {
      return reparented;
    }
    if (this.areDraggingItemsDescendantOfTarget()) {
      return 'invalid';
    }
    if (!this.canDropAtCurrentTarget()) {
      return 'invalid';
    }
    var parent = this.getParentOfLinearItem(this.linearIndex, this.treeId).parent;
    var newChildIndex = this.env.items[parent.item].children.indexOf(this.targetItem.item) + (this.offset === 'top' ? 0 : 1);
    if (this.offset) {
      return {
        targetType: 'between-items',
        treeId: this.treeId,
        parentItem: parent.item,
        depth: this.targetItem.depth,
        linearIndex: this.linearIndex + (this.offset === 'top' ? 0 : 1),
        childIndex: newChildIndex,
        linePosition: this.offset
      };
    }
    return {
      targetType: 'item',
      treeId: this.treeId,
      parentItem: parent.item,
      targetItem: this.targetItem.item,
      depth: this.targetItem.depth,
      linearIndex: this.linearIndex
    };
  };
  DraggingPositionEvaluation.prototype.isDescendant = function (treeId, itemLinearIndex, potentialParents) {
    // console.log('descendant check', itemLinearIndex, potentialParents);
    var _a = this.getParentOfLinearItem(itemLinearIndex, treeId),
      parentLinearIndex = _a.parentLinearIndex,
      parent = _a.parent;
    if (potentialParents.some(function (p) {
      return p.index === parent.item;
    })) {
      return true;
    }
    if (parent.depth === 0) {
      return false;
    }
    return this.isDescendant(treeId, parentLinearIndex, potentialParents);
  };
  DraggingPositionEvaluation.prototype.areDraggingItemsDescendantOfTarget = function () {
    return this.draggingItems && this.isDescendant(this.treeId, this.linearIndex, this.draggingItems);
  };
  return DraggingPositionEvaluation;
}();

var useDraggingPosition = function () {
  var dragCode = useRef('initial');
  var _a = useState(undefined),
    draggingItems = _a[0],
    setDraggingItems = _a[1];
  var itemHeight = useRef(0);
  var env = useTreeEnvironment();
  var getParentOfLinearItem = useGetGetParentOfLinearItem();
  var isNewDragPosition = useStableHandler(function (e, treeId, hoveringPosition) {
    if (!hoveringPosition) {
      return false;
    }
    var offset = hoveringPosition.offset,
      linearIndex = hoveringPosition.linearIndex;
    var newDragCode = "".concat(treeId, "__").concat(linearIndex, "__").concat(offset !== null && offset !== void 0 ? offset : '', "__").concat(hoveringPosition.indentation);
    if (newDragCode !== dragCode.current) {
      dragCode.current = newDragCode;
      return true;
    }
    return false;
  });
  /**
   * Returns undefined for invalid drop targets, like outside the tree.
   */
  var getHoveringPosition = useStableHandler(function (e, treeId, containerRef) {
    if (!containerRef.current) {
      return undefined;
    }
    var treeBb = containerRef.current.getBoundingClientRect();
    if (isOutsideOfContainer(e, treeBb)) {
      return undefined;
    }
    var hoveringPosition = (e.clientY - treeBb.top) / itemHeight.current;
    var treeLinearItems = env.linearItems[treeId];
    var linearIndex = Math.min(Math.max(0, Math.floor(hoveringPosition)), treeLinearItems.length - 1);
    if (treeLinearItems.length === 0) {
      return {
        linearIndex: 0,
        offset: 'bottom',
        indentation: 0
      };
    }
    var targetLinearItem = treeLinearItems[linearIndex];
    var targetItem = env.items[targetLinearItem.item];
    var indentation = !env.renderDepthOffset ? undefined : Math.max(Math.floor((e.clientX - treeBb.left) / env.renderDepthOffset), 0);
    var offset;
    var lineThreshold = !env.canReorderItems ? 0 : (targetItem === null || targetItem === void 0 ? void 0 : targetItem.isFolder) && env.canDropOnFolder || env.canDropOnNonFolder ? 0.2 : 0.5;
    if (hoveringPosition - 0.5 >= treeLinearItems.length - 1) {
      // very bottom, always use offset "bottom"
      offset = 'bottom';
    } else if (hoveringPosition % 1 < lineThreshold) {
      offset = 'top';
    } else if (hoveringPosition % 1 > 1 - lineThreshold) {
      offset = 'bottom';
    }
    return {
      linearIndex: linearIndex,
      offset: offset,
      indentation: indentation
    };
  });
  // returning undefined means calling onDragAtPosition(undefined), returning a dropposition means calling onPerformDrag(dropposition)
  // TODO old function sometimes returned undefined when old state could be kept; is it okay to also return undefined to enter invalid drop state here? e.g. !this.draggingItems, !canDragAndDrop...
  var getDraggingPosition = useStableHandler(function (e, treeId, containerRef) {
    var hoveringPosition = getHoveringPosition(e, treeId, containerRef);
    if (!isNewDragPosition(e, treeId, hoveringPosition)) {
      return undefined;
    }
    if (!draggingItems || !env.canDragAndDrop || !hoveringPosition || e.clientX < 0 || e.clientY < 0) {
      return 'invalid';
    }
    return new DraggingPositionEvaluation(env, e, treeId, hoveringPosition, draggingItems, getParentOfLinearItem).getDraggingPosition();
  });
  var initiateDraggingPosition = useStableHandler(function (treeId, items) {
    setDraggingItems(items);
    dragCode.current = 'initial';
    itemHeight.current = computeItemHeight(treeId);
  });
  var resetDraggingPosition = useStableHandler(function () {
    setDraggingItems(undefined);
    dragCode.current = 'initial';
    itemHeight.current = 0;
  });
  return {
    initiateDraggingPosition: initiateDraggingPosition,
    resetDraggingPosition: resetDraggingPosition,
    draggingItems: draggingItems,
    getDraggingPosition: getDraggingPosition,
    itemHeight: itemHeight
  };
};

var DragAndDropContext = React.createContext(null);
var useDragAndDrop = function () {
  return React.useContext(DragAndDropContext);
};
var DragAndDropProvider = function (_a) {
  var children = _a.children;
  var environment = useTreeEnvironment();
  var _b = useState(false),
    isProgrammaticallyDragging = _b[0],
    setIsProgrammaticallyDragging = _b[1];
  var _c = useState({}),
    viableDragPositions = _c[0],
    setViableDragPositions = _c[1];
  var _d = useState(0),
    programmaticDragIndex = _d[0],
    setProgrammaticDragIndex = _d[1];
  var _e = useState(),
    draggingPosition = _e[0],
    setDraggingPosition = _e[1];
  var getViableDragPositions = useGetViableDragPositions();
  var callSoon = useCallSoon();
  var getOriginalItemOrder = useGetOriginalItemOrder();
  var _f = useDraggingPosition(),
    initiateDraggingPosition = _f.initiateDraggingPosition,
    resetDraggingPosition = _f.resetDraggingPosition,
    draggingItems = _f.draggingItems,
    getDraggingPosition = _f.getDraggingPosition,
    itemHeight = _f.itemHeight;
  var resetProgrammaticDragIndexForCurrentTree = useCallback(function (viableDragPositions, draggingItems) {
    var _a;
    if (environment.activeTreeId && ((_a = environment.viewState[environment.activeTreeId]) === null || _a === void 0 ? void 0 : _a.focusedItem) && environment.linearItems && draggingItems) {
      var focusItem_1 = environment.viewState[environment.activeTreeId].focusedItem;
      var treeDragPositions = getViableDragPositions(environment.activeTreeId, draggingItems);
      var newPos = treeDragPositions.findIndex(function (pos) {
        if (pos.targetType === 'item') {
          return pos.targetItem === focusItem_1;
        }
        if (pos.targetType === 'between-items') {
          return environment.items[pos.parentItem].children[pos.childIndex] === focusItem_1;
        }
        return false;
      });
      if (newPos) {
        setProgrammaticDragIndex(Math.min(newPos + 1, treeDragPositions.length - 1));
      } else {
        setProgrammaticDragIndex(0);
      }
    } else {
      setProgrammaticDragIndex(0);
    }
  }, [environment.activeTreeId, environment.items, environment.linearItems, environment.viewState, getViableDragPositions]);
  var resetState = useStableHandler(function () {
    setIsProgrammaticallyDragging(false);
    setViableDragPositions({});
    setProgrammaticDragIndex(0);
    setDraggingPosition(undefined);
    resetDraggingPosition();
  });
  useSideEffect(function () {
    if (environment.activeTreeId && environment.linearItems[environment.activeTreeId] && viableDragPositions[environment.activeTreeId]) {
      resetProgrammaticDragIndexForCurrentTree(viableDragPositions[environment.activeTreeId], draggingItems);
    }
  }, [draggingItems, environment.activeTreeId, environment.linearItems, resetProgrammaticDragIndexForCurrentTree, viableDragPositions], [environment.activeTreeId]);
  useSideEffect(function () {
    if (isProgrammaticallyDragging && environment.activeTreeId) {
      setDraggingPosition(viableDragPositions[environment.activeTreeId][programmaticDragIndex]);
    }
  }, [programmaticDragIndex, environment.activeTreeId, isProgrammaticallyDragging, viableDragPositions], [programmaticDragIndex, environment.activeTreeId]);
  var canDropAt = useCanDropAt();
  var performDrag = function (draggingPosition) {
    var _a;
    if (draggingItems && !canDropAt(draggingPosition, draggingItems)) {
      return;
    }
    setDraggingPosition(draggingPosition);
    environment.setActiveTree(draggingPosition.treeId);
    if (draggingItems && environment.activeTreeId !== draggingPosition.treeId) {
      // TODO maybe do only if draggingItems are different to selectedItems
      (_a = environment.onSelectItems) === null || _a === void 0 ? void 0 : _a.call(environment, draggingItems.map(function (item) {
        return item.index;
      }), draggingPosition.treeId);
    }
  };
  var onDragOverTreeHandler = useStableHandler(function (e, treeId, containerRef) {
    if (!draggingItems) return;
    var newDraggingPosition = getDraggingPosition(e, treeId, containerRef);
    if (!newDraggingPosition) return;
    if (newDraggingPosition === 'invalid') {
      setDraggingPosition(undefined);
      return;
    }
    performDrag(newDraggingPosition);
  });
  var onDragLeaveContainerHandler = useStableHandler(function (e, containerRef) {
    if (!containerRef.current) return;
    if (isOutsideOfContainer(e, containerRef.current.getBoundingClientRect())) {
      setDraggingPosition(undefined);
    }
  });
  var onDropHandler = useStableHandler(function () {
    if (!draggingItems || !draggingPosition || !environment.onDrop) {
      return;
    }
    environment.onDrop(draggingItems, draggingPosition);
    callSoon(function () {
      var _a;
      (_a = environment.onFocusItem) === null || _a === void 0 ? void 0 : _a.call(environment, draggingItems[0], draggingPosition.treeId);
      resetState();
    });
  });
  var onStartDraggingItems = useCallback(function (items, treeId) {
    var treeViableDragPositions = buildMapForTrees(environment.treeIds, function (treeId) {
      return getViableDragPositions(treeId, items);
    });
    initiateDraggingPosition(treeId, items);
    // TODO what if trees have different heights and drag target changes?
    setViableDragPositions(treeViableDragPositions);
    if (environment.activeTreeId) {
      resetProgrammaticDragIndexForCurrentTree(treeViableDragPositions[environment.activeTreeId], items);
    }
  }, [environment.activeTreeId, environment.treeIds, getViableDragPositions, initiateDraggingPosition, resetProgrammaticDragIndexForCurrentTree]);
  var startProgrammaticDrag = useCallback(function () {
    var _a, _b, _c;
    if (!environment.canDragAndDrop) {
      return;
    }
    if (environment.activeTreeId) {
      var draggingItems_1 = (_b = (_a = environment.viewState[environment.activeTreeId]) === null || _a === void 0 ? void 0 : _a.selectedItems) !== null && _b !== void 0 ? _b : [(_c = environment.viewState[environment.activeTreeId]) === null || _c === void 0 ? void 0 : _c.focusedItem];
      if (draggingItems_1.length === 0 || draggingItems_1[0] === undefined) {
        return;
      }
      var resolvedDraggingItems = getOriginalItemOrder(environment.activeTreeId, draggingItems_1.map(function (id) {
        return environment.items[id];
      }));
      if (environment.canDrag && !environment.canDrag(resolvedDraggingItems)) {
        return;
      }
      onStartDraggingItems(resolvedDraggingItems, environment.activeTreeId);
      setTimeout(function () {
        setIsProgrammaticallyDragging(true);
        // Needs to be done after onStartDraggingItems was called, so that viableDragPositions is populated
      });
    }
  }, [environment, getOriginalItemOrder, onStartDraggingItems]);
  var abortProgrammaticDrag = useCallback(function () {
    resetState();
  }, [resetState]);
  var completeProgrammaticDrag = useCallback(function () {
    onDropHandler();
    resetState();
  }, [onDropHandler, resetState]);
  var programmaticDragUp = useCallback(function () {
    setProgrammaticDragIndex(function (oldIndex) {
      return Math.max(0, oldIndex - 1);
    });
  }, []);
  var programmaticDragDown = useCallback(function () {
    if (environment.activeTreeId) {
      setProgrammaticDragIndex(function (oldIndex) {
        return Math.min(viableDragPositions[environment.activeTreeId].length, oldIndex + 1);
      });
    }
  }, [environment.activeTreeId, viableDragPositions]);
  var dnd = useMemo(function () {
    return {
      onStartDraggingItems: onStartDraggingItems,
      startProgrammaticDrag: startProgrammaticDrag,
      abortProgrammaticDrag: abortProgrammaticDrag,
      completeProgrammaticDrag: completeProgrammaticDrag,
      programmaticDragUp: programmaticDragUp,
      programmaticDragDown: programmaticDragDown,
      draggingItems: draggingItems,
      draggingPosition: draggingPosition,
      itemHeight: itemHeight.current,
      isProgrammaticallyDragging: isProgrammaticallyDragging,
      onDragOverTreeHandler: onDragOverTreeHandler,
      onDragLeaveContainerHandler: onDragLeaveContainerHandler,
      viableDragPositions: viableDragPositions
    };
  }, [abortProgrammaticDrag, completeProgrammaticDrag, draggingItems, draggingPosition, isProgrammaticallyDragging, itemHeight, onDragOverTreeHandler, onDragLeaveContainerHandler, onStartDraggingItems, programmaticDragDown, programmaticDragUp, startProgrammaticDrag, viableDragPositions]);
  useEffect(function () {
    window.addEventListener('dragend', resetState);
    window.addEventListener('drop', onDropHandler);
    return function () {
      window.removeEventListener('dragend', resetState);
      window.removeEventListener('drop', onDropHandler);
    };
  }, [onDropHandler, resetState]);
  return React.createElement(DragAndDropContext.Provider, {
    value: dnd
  }, children);
};

var __assign$9 = undefined && undefined.__assign || function () {
  __assign$9 = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign$9.apply(this, arguments);
};
var useCreatedEnvironmentRef = function (ref, actions) {
  var environment = useTreeEnvironment();
  var dnd = useDragAndDrop();
  useImperativeHandle(ref, function () {
    return __assign$9(__assign$9(__assign$9({}, actions), environment), {
      treeEnvironmentContext: environment,
      dragAndDropContext: dnd
    });
  });
};

var waitFor = function (check, intervalMs, timeoutMs) {
  if (intervalMs === void 0) {
    intervalMs = 50;
  }
  if (timeoutMs === void 0) {
    timeoutMs = 10000;
  }
  return new Promise(function (resolve) {
    if (check()) {
      resolve();
    }
    var complete;
    var interval = setInterval(function () {
      if (check()) {
        complete();
      }
    }, intervalMs);
    var timeout = setTimeout(function () {
      complete();
    }, timeoutMs);
    complete = function () {
      clearInterval(interval);
      clearTimeout(timeout);
      resolve();
    };
  });
};

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = undefined && undefined.__generator || function (thisArg, body) {
  var _ = {
      label: 0,
      sent: function () {
        if (t[0] & 1) throw t[1];
        return t[1];
      },
      trys: [],
      ops: []
    },
    f,
    y,
    t,
    g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;
  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };
        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};
var __spreadArray$3 = undefined && undefined.__spreadArray || function (to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};
var EnvironmentActionsContext$1 = React.createContext(null);
var useEnvironmentActions = function () {
  return React.useContext(EnvironmentActionsContext$1);
};
var recursiveExpand = function (itemId, items, onExpand) {
  return __awaiter(void 0, void 0, void 0, function () {
    var _loop_1, _i, _a, childId;
    var _b, _c, _d;
    return __generator(this, function (_e) {
      _loop_1 = function (childId) {
        waitFor(function () {
          var _a;
          return !!((_a = items.current) === null || _a === void 0 ? void 0 : _a[childId]);
        }).then(function () {
          var _a;
          var item = (_a = items.current) === null || _a === void 0 ? void 0 : _a[childId];
          if (item === null || item === void 0 ? void 0 : item.isFolder) {
            onExpand(item);
            recursiveExpand(childId, items, onExpand);
          }
        });
      };
      for (_i = 0, _a = (_d = (_c = (_b = items.current) === null || _b === void 0 ? void 0 : _b[itemId]) === null || _c === void 0 ? void 0 : _c.children) !== null && _d !== void 0 ? _d : []; _i < _a.length; _i++) {
        childId = _a[_i];
        _loop_1(childId);
      }
      return [2 /*return*/];
    });
  });
};
var EnvironmentActionsProvider = React.forwardRef(function (props, ref) {
  var _a = useTreeEnvironment(),
    onCollapseItem = _a.onCollapseItem,
    items = _a.items,
    trees = _a.trees,
    viewState = _a.viewState,
    onExpandItem = _a.onExpandItem,
    onFocusItem = _a.onFocusItem,
    setActiveTree = _a.setActiveTree,
    onRenameItem = _a.onRenameItem,
    onSelectItems = _a.onSelectItems,
    onPrimaryAction = _a.onPrimaryAction,
    linearItems = _a.linearItems;
  var _b = useDragAndDrop(),
    abortProgrammaticDrag = _b.abortProgrammaticDrag,
    completeProgrammaticDrag = _b.completeProgrammaticDrag,
    programmaticDragDown = _b.programmaticDragDown,
    programmaticDragUp = _b.programmaticDragUp,
    startProgrammaticDrag = _b.startProgrammaticDrag;
  var itemsRef = useRefCopy(items);
  // TODO replace callbacks with stable handlers
  var collapseItem = useCallback(function (itemId, treeId) {
    onCollapseItem === null || onCollapseItem === void 0 ? void 0 : onCollapseItem(items[itemId], treeId);
  }, [items, onCollapseItem]);
  var expandItem = useCallback(function (itemId, treeId) {
    onExpandItem === null || onExpandItem === void 0 ? void 0 : onExpandItem(items[itemId], treeId);
  }, [items, onExpandItem]);
  var focusItem = useCallback(function (itemId, treeId, setDomFocus) {
    if (setDomFocus === void 0) {
      setDomFocus = true;
    }
    onFocusItem === null || onFocusItem === void 0 ? void 0 : onFocusItem(items[itemId], treeId, setDomFocus);
  }, [items, onFocusItem]);
  var focusTree = useCallback(function (treeId, autoFocus) {
    if (autoFocus === void 0) {
      autoFocus = true;
    }
    setActiveTree(treeId, autoFocus);
  }, [setActiveTree]);
  var moveFocusDown = useCallback(function (treeId) {
    var treeLinearItems = linearItems[treeId];
    var currentFocusIndex = treeLinearItems.findIndex(function (_a) {
      var _b;
      var item = _a.item;
      return item === ((_b = viewState[treeId]) === null || _b === void 0 ? void 0 : _b.focusedItem);
    });
    var newIndex = currentFocusIndex !== undefined ? Math.min(treeLinearItems.length - 1, currentFocusIndex + 1) : 0;
    var newItem = items[treeLinearItems[newIndex].item];
    onFocusItem === null || onFocusItem === void 0 ? void 0 : onFocusItem(newItem, treeId);
  }, [items, linearItems, onFocusItem, viewState]);
  var moveFocusUp = useCallback(function (treeId) {
    var treeLinearItems = linearItems[treeId];
    var currentFocusIndex = treeLinearItems.findIndex(function (_a) {
      var _b;
      var item = _a.item;
      return item === ((_b = viewState[treeId]) === null || _b === void 0 ? void 0 : _b.focusedItem);
    });
    var newIndex = currentFocusIndex !== undefined ? Math.max(0, currentFocusIndex - 1) : 0;
    var newItem = items[treeLinearItems[newIndex].item];
    onFocusItem === null || onFocusItem === void 0 ? void 0 : onFocusItem(newItem, treeId);
  }, [items, linearItems, onFocusItem, viewState]);
  var renameItem = useCallback(function (itemId, name, treeId) {
    onRenameItem === null || onRenameItem === void 0 ? void 0 : onRenameItem(items[itemId], name, treeId);
  }, [items, onRenameItem]);
  var selectItems = useCallback(function (itemsIds, treeId) {
    onSelectItems === null || onSelectItems === void 0 ? void 0 : onSelectItems(itemsIds, treeId);
  }, [onSelectItems]);
  var toggleItemExpandedState = useCallback(function (itemId, treeId) {
    var _a, _b;
    if ((_b = (_a = viewState[treeId]) === null || _a === void 0 ? void 0 : _a.expandedItems) === null || _b === void 0 ? void 0 : _b.includes(itemId)) {
      onCollapseItem === null || onCollapseItem === void 0 ? void 0 : onCollapseItem(items[itemId], treeId);
    } else {
      onExpandItem === null || onExpandItem === void 0 ? void 0 : onExpandItem(items[itemId], treeId);
    }
  }, [items, onCollapseItem, onExpandItem, viewState]);
  var toggleItemSelectStatus = useCallback(function (itemId, treeId) {
    var _a, _b, _c, _d, _e;
    if ((_b = (_a = viewState[treeId]) === null || _a === void 0 ? void 0 : _a.selectedItems) === null || _b === void 0 ? void 0 : _b.includes(itemId)) {
      onSelectItems === null || onSelectItems === void 0 ? void 0 : onSelectItems((_d = (_c = viewState[treeId].selectedItems) === null || _c === void 0 ? void 0 : _c.filter(function (item) {
        return item !== itemId;
      })) !== null && _d !== void 0 ? _d : [], treeId);
    } else {
      onSelectItems === null || onSelectItems === void 0 ? void 0 : onSelectItems(__spreadArray$3(__spreadArray$3([], (_e = viewState[treeId].selectedItems) !== null && _e !== void 0 ? _e : [], true), [itemId], false), treeId);
    }
  }, [onSelectItems, viewState]);
  var invokePrimaryAction = useCallback(function (itemId, treeId) {
    onPrimaryAction === null || onPrimaryAction === void 0 ? void 0 : onPrimaryAction(items[itemId], treeId);
  }, [items, onPrimaryAction]);
  var expandSubsequently = useCallback(function (treeId, itemIds) {
    return __awaiter(void 0, void 0, void 0, function () {
      var current, rest;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            current = itemIds[0], rest = itemIds.slice(1);
            return [4 /*yield*/, waitFor(function () {
              var _a;
              return !!((_a = itemsRef.current) === null || _a === void 0 ? void 0 : _a[current]);
            }).then(function () {
              var item = itemsRef.current[current];
              if (!item) {
                return Promise.resolve();
              }
              onExpandItem === null || onExpandItem === void 0 ? void 0 : onExpandItem(item, treeId);
              if (rest.length > 0) {
                return expandSubsequently(treeId, rest);
              }
              return Promise.resolve();
            })];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  }, [itemsRef, onExpandItem]);
  var expandAll = useCallback(function (treeId) {
    return __awaiter(void 0, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, recursiveExpand(trees[treeId].rootItem, itemsRef, function (item) {
              return onExpandItem === null || onExpandItem === void 0 ? void 0 : onExpandItem(item, treeId);
            })];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  }, [itemsRef, onExpandItem, trees]);
  var collapseAll = useCallback(function (treeId) {
    var _a, _b;
    for (var _i = 0, _c = (_b = (_a = viewState[treeId]) === null || _a === void 0 ? void 0 : _a.expandedItems) !== null && _b !== void 0 ? _b : []; _i < _c.length; _i++) {
      var itemId = _c[_i];
      onCollapseItem === null || onCollapseItem === void 0 ? void 0 : onCollapseItem(items[itemId], treeId);
    }
  }, [items, onCollapseItem, viewState]);
  // TODO change environment childs to use actions rather than output events where possible
  var actions = useMemo(function () {
    return {
      collapseItem: collapseItem,
      expandItem: expandItem,
      focusItem: focusItem,
      focusTree: focusTree,
      moveFocusDown: moveFocusDown,
      moveFocusUp: moveFocusUp,
      renameItem: renameItem,
      selectItems: selectItems,
      toggleItemExpandedState: toggleItemExpandedState,
      toggleItemSelectStatus: toggleItemSelectStatus,
      invokePrimaryAction: invokePrimaryAction,
      expandAll: expandAll,
      expandSubsequently: expandSubsequently,
      collapseAll: collapseAll,
      abortProgrammaticDrag: abortProgrammaticDrag,
      completeProgrammaticDrag: completeProgrammaticDrag,
      moveProgrammaticDragPositionDown: programmaticDragDown,
      moveProgrammaticDragPositionUp: programmaticDragUp,
      startProgrammaticDrag: startProgrammaticDrag
    };
  }, [collapseItem, expandItem, focusItem, focusTree, moveFocusDown, moveFocusUp, renameItem, selectItems, toggleItemExpandedState, toggleItemSelectStatus, invokePrimaryAction, expandAll, expandSubsequently, collapseAll, abortProgrammaticDrag, completeProgrammaticDrag, programmaticDragDown, programmaticDragUp, startProgrammaticDrag]);
  useCreatedEnvironmentRef(ref, actions);
  return React.createElement(EnvironmentActionsContext$1.Provider, {
    value: actions
  }, props.children);
});

var scrollIntoView = function (element) {
  var _a, _b, _c, _d;
  if (!element) {
    return;
  }
  if (element.scrollIntoViewIfNeeded) {
    element.scrollIntoViewIfNeeded();
  } else {
    var boundingBox = element.getBoundingClientRect();
    var isElementInViewport = boundingBox.top >= 0 && boundingBox.left >= 0 && boundingBox.bottom <= (window.innerHeight || !!((_b = (_a = getDocument()) === null || _a === void 0 ? void 0 : _a.documentElement) === null || _b === void 0 ? void 0 : _b.clientHeight)) && boundingBox.right <= (window.innerWidth || !!((_d = (_c = getDocument()) === null || _c === void 0 ? void 0 : _c.documentElement) === null || _d === void 0 ? void 0 : _d.clientWidth));
    if (!isElementInViewport) {
      element.scrollIntoView();
    }
  }
};

var __assign$8 = undefined && undefined.__assign || function () {
  __assign$8 = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign$8.apply(this, arguments);
};
var cx = function () {
  var classNames = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    classNames[_i] = arguments[_i];
  }
  return classNames.filter(function (cn) {
    return !!cn;
  }).join(' ');
};
var createDefaultRenderers = function (renderDepthOffset, rtl) {
  return {
    renderItemTitle: function (_a) {
      var title = _a.title,
        context = _a.context,
        info = _a.info;
      if (!info.isSearching || !context.isSearchMatching) {
        return title;
      }
      var startIndex = title.toLowerCase().indexOf(info.search.toLowerCase());
      return React__default.createElement(React__default.Fragment, null, startIndex > 0 && React__default.createElement("span", null, title.slice(0, startIndex)), React__default.createElement("span", {
        className: "rct-tree-item-search-highlight"
      }, title.slice(startIndex, startIndex + info.search.length)), startIndex + info.search.length < title.length && React__default.createElement("span", null, title.slice(startIndex + info.search.length, title.length)));
    },
    renderItemArrow: function (_a) {
      var item = _a.item,
        context = _a.context;
      return (
        // Icons from https://blueprintjs.com/docs/#icons
        React__default.createElement("div", __assign$8({
          className: cx(item.isFolder && 'rct-tree-item-arrow-isFolder', context.isExpanded && 'rct-tree-item-arrow-expanded', 'rct-tree-item-arrow')
        }, context.arrowProps), item.isFolder && (context.isExpanded ? React__default.createElement("svg", {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          xmlnsXlink: "http://www.w3.org/1999/xlink",
          x: "0px",
          y: "0px",
          viewBox: "0 0 16 16",
          enableBackground: "new 0 0 16 16",
          xmlSpace: "preserve"
        }, React__default.createElement("g", null, React__default.createElement("g", null, React__default.createElement("path", {
          fillRule: "evenodd",
          clipRule: "evenodd",
          d: "M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z",
          className: "rct-tree-item-arrow-path"
        })))) : React__default.createElement("svg", {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          xmlnsXlink: "http://www.w3.org/1999/xlink",
          x: "0px",
          y: "0px",
          viewBox: "0 0 16 16",
          enableBackground: "new 0 0 16 16",
          xmlSpace: "preserve"
        }, React__default.createElement("g", null, React__default.createElement("g", null, React__default.createElement("path", {
          fillRule: "evenodd",
          clipRule: "evenodd",
          d: "M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z",
          className: "rct-tree-item-arrow-path"
        }))))))
      );
    },
    renderItem: function (_a) {
      var item = _a.item,
        depth = _a.depth,
        children = _a.children,
        title = _a.title,
        context = _a.context,
        arrow = _a.arrow;
      var InteractiveComponent = context.isRenaming ? 'div' : 'button';
      var type = context.isRenaming ? undefined : 'button';
      // TODO have only root li component create all the classes
      return React__default.createElement("li", __assign$8({}, context.itemContainerWithChildrenProps, {
        className: cx('rct-tree-item-li', item.isFolder && 'rct-tree-item-li-isFolder', context.isSelected && 'rct-tree-item-li-selected', context.isExpanded && 'rct-tree-item-li-expanded', context.isFocused && 'rct-tree-item-li-focused', context.isDraggingOver && 'rct-tree-item-li-dragging-over', context.isSearchMatching && 'rct-tree-item-li-search-match')
      }), React__default.createElement("div", __assign$8({}, context.itemContainerWithoutChildrenProps, {
        style: {
          '--depthOffset': "".concat((depth + 1) * renderDepthOffset, "px")
        },
        className: cx('rct-tree-item-title-container', item.isFolder && 'rct-tree-item-title-container-isFolder', context.isSelected && 'rct-tree-item-title-container-selected', context.isExpanded && 'rct-tree-item-title-container-expanded', context.isFocused && 'rct-tree-item-title-container-focused', context.isDraggingOver && 'rct-tree-item-title-container-dragging-over', context.isSearchMatching && 'rct-tree-item-title-container-search-match')
      }), arrow, React__default.createElement(InteractiveComponent, __assign$8({
        type: type
      }, context.interactiveElementProps, {
        className: cx('rct-tree-item-button', item.isFolder && 'rct-tree-item-button-isFolder', context.isSelected && 'rct-tree-item-button-selected', context.isExpanded && 'rct-tree-item-button-expanded', context.isFocused && 'rct-tree-item-button-focused', context.isDraggingOver && 'rct-tree-item-button-dragging-over', context.isSearchMatching && 'rct-tree-item-button-search-match')
      }), title)), children);
    },
    renderRenameInput: function (_a) {
      var inputProps = _a.inputProps,
        inputRef = _a.inputRef,
        submitButtonProps = _a.submitButtonProps,
        submitButtonRef = _a.submitButtonRef,
        formProps = _a.formProps;
      return React__default.createElement("form", __assign$8({}, formProps, {
        className: "rct-tree-item-renaming-form"
      }), React__default.createElement("input", __assign$8({}, inputProps, {
        ref: inputRef,
        className: "rct-tree-item-renaming-input"
      })), React__default.createElement("input", __assign$8({}, submitButtonProps, {
        ref: submitButtonRef,
        type: "submit",
        className: "rct-tree-item-renaming-submit-button",
        value: "\uD83D\uDDF8"
      })));
    },
    renderTreeContainer: function (_a) {
      var children = _a.children,
        containerProps = _a.containerProps,
        info = _a.info;
      return React__default.createElement("div", {
        className: cx('rct-tree-root', info.isFocused && 'rct-tree-root-focus', info.isRenaming && 'rct-tree-root-renaming', info.areItemsSelected && 'rct-tree-root-itemsselected', rtl && 'rct-rtl')
      }, React__default.createElement("div", __assign$8({}, containerProps, {
        style: __assign$8({
          minHeight: '30px'
        }, containerProps.style)
      }), children));
    },
    renderItemsContainer: function (_a) {
      var children = _a.children,
        containerProps = _a.containerProps;
      return React__default.createElement("ul", __assign$8({}, containerProps, {
        className: "rct-tree-items-container"
      }), children);
    },
    renderDragBetweenLine: function (_a) {
      var draggingPosition = _a.draggingPosition,
        lineProps = _a.lineProps;
      return React__default.createElement("div", __assign$8({}, lineProps, {
        style: {
          left: "".concat(draggingPosition.depth * renderDepthOffset, "px")
        },
        className: cx('rct-tree-drag-between-line', draggingPosition.targetType === 'between-items' && draggingPosition.linePosition === 'top' && 'rct-tree-drag-between-line-top', draggingPosition.targetType === 'between-items' && draggingPosition.linePosition === 'bottom' && 'rct-tree-drag-between-line-bottom')
      }));
    },
    renderSearchInput: function (_a) {
      var inputProps = _a.inputProps;
      return React__default.createElement("div", {
        className: cx('rct-tree-search-input-container')
      }, React__default.createElement("span", {
        className: "rct-tree-input-icon"
      }), React__default.createElement("input", __assign$8({}, inputProps, {
        className: cx('rct-tree-search-input')
      })));
    },
    renderLiveDescriptorContainer: function (_a) {
      var tree = _a.tree,
        children = _a.children;
      return React__default.createElement("div", {
        id: "rct-livedescription-".concat(tree.treeId),
        style: {
          clip: 'rect(0 0 0 0)',
          clipPath: 'inset(50%)',
          height: '1px',
          overflow: 'hidden',
          position: 'absolute',
          whiteSpace: 'nowrap',
          width: '1px'
        }
      }, children);
    },
    renderDepthOffset: renderDepthOffset
  };
};

var useRenderers = function (_a) {
  var renderItem = _a.renderItem,
    renderItemTitle = _a.renderItemTitle,
    renderItemArrow = _a.renderItemArrow,
    renderRenameInput = _a.renderRenameInput,
    renderItemsContainer = _a.renderItemsContainer,
    renderTreeContainer = _a.renderTreeContainer,
    renderDragBetweenLine = _a.renderDragBetweenLine,
    renderSearchInput = _a.renderSearchInput,
    renderLiveDescriptorContainer = _a.renderLiveDescriptorContainer,
    renderDepthOffset = _a.renderDepthOffset;
  var defaultRenderers = useMemo(function () {
    return createDefaultRenderers(renderDepthOffset !== null && renderDepthOffset !== void 0 ? renderDepthOffset : 10);
  }, [renderDepthOffset]);
  var customRenderers = {
    renderItem: renderItem,
    renderItemTitle: renderItemTitle,
    renderItemArrow: renderItemArrow,
    renderRenameInput: renderRenameInput,
    renderItemsContainer: renderItemsContainer,
    renderTreeContainer: renderTreeContainer,
    renderDragBetweenLine: renderDragBetweenLine,
    renderSearchInput: renderSearchInput,
    renderLiveDescriptorContainer: renderLiveDescriptorContainer,
    renderDepthOffset: renderDepthOffset
  };
  var renderers = Object.entries(defaultRenderers).reduce(function (acc, _a) {
    var key = _a[0],
      value = _a[1];
    var keyMapped = key;
    if (customRenderers[keyMapped]) {
      acc[keyMapped] = customRenderers[keyMapped];
    } else {
      acc[keyMapped] = value;
    }
    return acc;
  }, {});
  renderers.renderItem.displayName = 'RenderItem';
  renderers.renderItemTitle.displayName = 'RenderItemTitle';
  renderers.renderItemArrow.displayName = 'RenderItemArrow';
  renderers.renderRenameInput.displayName = 'RenderRenameInput';
  renderers.renderItemsContainer.displayName = 'RenderItemsContainer';
  renderers.renderTreeContainer.displayName = 'RenderTreeContainer';
  renderers.renderDragBetweenLine.displayName = 'RenderDragBetweenLine';
  renderers.renderSearchInput.displayName = 'RenderSearchInput';
  return renderers;
};

var getItemsLinearly = function (rootItem, viewState, items, depth) {
  var _a, _b, _c;
  if (depth === void 0) {
    depth = 0;
  }
  var itemIds = [];
  for (var _i = 0, _d = (_b = (_a = items[rootItem]) === null || _a === void 0 ? void 0 : _a.children) !== null && _b !== void 0 ? _b : []; _i < _d.length; _i++) {
    var itemId = _d[_i];
    var item = items[itemId];
    itemIds.push({
      item: itemId,
      depth: depth
    });
    if (item && item.isFolder && !!item.children && ((_c = viewState.expandedItems) === null || _c === void 0 ? void 0 : _c.includes(itemId))) {
      itemIds.push.apply(itemIds, getItemsLinearly(itemId, viewState, items, depth + 1));
    }
  }
  return itemIds;
};

var __assign$7 = undefined && undefined.__assign || function () {
  __assign$7 = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign$7.apply(this, arguments);
};
var __rest = undefined && undefined.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
var useControlledTreeEnvironmentProps = function (_a) {
  var onExpandItemProp = _a.onExpandItem,
    onCollapseProp = _a.onCollapseItem,
    onDropProp = _a.onDrop,
    props = __rest(_a, ["onExpandItem", "onCollapseItem", "onDrop"]);
  var _b = useState({}),
    trees = _b[0],
    setTrees = _b[1];
  var _c = useState(),
    activeTreeId = _c[0],
    setActiveTreeId = _c[1];
  var treeIds = useMemo(function () {
    return Object.keys(trees);
  }, [trees]);
  var onFocusItem = props.onFocusItem,
    autoFocus = props.autoFocus,
    onRegisterTree = props.onRegisterTree,
    onUnregisterTree = props.onUnregisterTree,
    items = props.items,
    viewState = props.viewState;
  var onFocusItemRef = useRefCopy(onFocusItem);
  var viewStateRef = useRefCopy(viewState);
  var linearItems = useMemo(function () {
    return buildMapForTrees(treeIds, function (treeId) {
      var _a;
      return getItemsLinearly(trees[treeId].rootItem, (_a = viewState[treeId]) !== null && _a !== void 0 ? _a : {}, items);
    });
  }, [trees, items, treeIds, viewState]);
  var onFocusItemHandler = useCallback(function (item, treeId, setDomFocus) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    if (setDomFocus === void 0) {
      setDomFocus = true;
    }
    if ((autoFocus !== null && autoFocus !== void 0 ? autoFocus : true) && setDomFocus) {
      var newItem = (_b = (_a = getDocument()) === null || _a === void 0 ? void 0 : _a.querySelector("[data-rct-tree=\"".concat(treeId, "\"] [data-rct-item-id=\"").concat(item.index, "\"]"))) !== null && _b !== void 0 ? _b : (_c = getDocument()) === null || _c === void 0 ? void 0 : _c.querySelector("[data-rct-tree=\"".concat(treeId, "\"] [data-rct-item-id]"));
      if (((_f = (_e = (_d = getDocument()) === null || _d === void 0 ? void 0 : _d.activeElement) === null || _e === void 0 ? void 0 : _e.attributes.getNamedItem('data-rct-search-input')) === null || _f === void 0 ? void 0 : _f.value) !== 'true') {
        // Move DOM focus to item if the current focus is not on the search input
        (_g = newItem === null || newItem === void 0 ? void 0 : newItem.focus) === null || _g === void 0 ? void 0 : _g.call(newItem);
      } else {
        // Otherwise just manually scroll into view
        scrollIntoView(newItem);
      }
    }
    if (((_h = viewStateRef.current[treeId]) === null || _h === void 0 ? void 0 : _h.focusedItem) === item.index) {
      return;
    }
    (_j = onFocusItemRef.current) === null || _j === void 0 ? void 0 : _j.call(onFocusItemRef, item, treeId);
  }, [autoFocus, onFocusItemRef, viewStateRef]);
  var registerTree = useCallback(function (tree) {
    setTrees(function (trees) {
      var _a;
      return __assign$7(__assign$7({}, trees), (_a = {}, _a[tree.treeId] = tree, _a));
    });
    onRegisterTree === null || onRegisterTree === void 0 ? void 0 : onRegisterTree(tree);
  }, [onRegisterTree]);
  var unregisterTree = useCallback(function (treeId) {
    onUnregisterTree === null || onUnregisterTree === void 0 ? void 0 : onUnregisterTree(trees[treeId]);
    delete trees[treeId];
    setTrees(trees);
  }, [onUnregisterTree, trees]);
  var onCollapseItem = useCallback(function (item, treeId) {
    onCollapseProp === null || onCollapseProp === void 0 ? void 0 : onCollapseProp(item, treeId);
    setTrees(function (trees) {
      return trees;
    });
  }, [onCollapseProp]);
  var onExpandItem = useCallback(function (item, treeId) {
    onExpandItemProp === null || onExpandItemProp === void 0 ? void 0 : onExpandItemProp(item, treeId);
    setTrees(function (trees) {
      return trees;
    });
  }, [onExpandItemProp]);
  var onDrop = useCallback(function (items, target) {
    onDropProp === null || onDropProp === void 0 ? void 0 : onDropProp(items, target);
    setTrees(function (trees) {
      return trees;
    });
  }, [onDropProp]);
  var focusTree = useCallback(function (treeId) {
    var _a, _b;
    var focusItem = (_a = getDocument()) === null || _a === void 0 ? void 0 : _a.querySelector("[data-rct-tree=\"".concat(treeId, "\"] [data-rct-item-focus=\"true\"]"));
    (_b = focusItem === null || focusItem === void 0 ? void 0 : focusItem.focus) === null || _b === void 0 ? void 0 : _b.call(focusItem);
  }, []);
  var setActiveTree = useCallback(function (treeIdOrSetStateFunction, autoFocusTree) {
    if (autoFocusTree === void 0) {
      autoFocusTree = true;
    }
    var maybeFocusTree = function (treeId) {
      var _a, _b;
      if (autoFocusTree && (autoFocus !== null && autoFocus !== void 0 ? autoFocus : true) && treeId && !((_b = (_a = getDocument()) === null || _a === void 0 ? void 0 : _a.querySelector("[data-rct-tree=\"".concat(treeId, "\"]"))) === null || _b === void 0 ? void 0 : _b.contains(document.activeElement))) {
        focusTree(treeId);
      }
    };
    if (typeof treeIdOrSetStateFunction === 'function') {
      setActiveTreeId(function (oldValue) {
        var treeId = treeIdOrSetStateFunction(oldValue);
        if (treeId !== oldValue) {
          maybeFocusTree(treeId);
        }
        return treeId;
      });
    } else {
      var treeId = treeIdOrSetStateFunction;
      setActiveTreeId(treeId);
      maybeFocusTree(treeId);
    }
  }, [autoFocus, focusTree]);
  var renderers = useRenderers(props);
  return __assign$7(__assign$7(__assign$7({}, renderers), props), {
    onFocusItem: onFocusItemHandler,
    registerTree: registerTree,
    unregisterTree: unregisterTree,
    onExpandItem: onExpandItem,
    onCollapseItem: onCollapseItem,
    onDrop: onDrop,
    setActiveTree: setActiveTree,
    treeIds: treeIds,
    trees: trees,
    activeTreeId: activeTreeId,
    linearItems: linearItems
  });
};

var __assign$6 = undefined && undefined.__assign || function () {
  __assign$6 = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign$6.apply(this, arguments);
};
var TreeEnvironmentContext = React.createContext(null);
var useTreeEnvironment = function () {
  return useContext(TreeEnvironmentContext);
};
var ControlledTreeEnvironment = React.forwardRef(function (props, ref) {
  var _a, _b, _c;
  var environmentContextProps = useControlledTreeEnvironmentProps(props);
  var viewState = props.viewState;
  // Make sure that every tree view state has a focused item
  for (var _i = 0, _d = Object.keys(environmentContextProps.trees); _i < _d.length; _i++) {
    var treeId = _d[_i];
    // TODO if the focus item is dragged out of the tree and is not within the expanded items
    // TODO of that tree, the tree does not show any focus item anymore.
    // Fix: use linear items to see if focus item is visible, and reset if not. Only refresh that
    // information when the viewstate changes
    if (!((_a = viewState[treeId]) === null || _a === void 0 ? void 0 : _a.focusedItem) && environmentContextProps.trees[treeId]) {
      viewState[treeId] = __assign$6(__assign$6({}, viewState[treeId]), {
        focusedItem: (_c = (_b = props.items[environmentContextProps.trees[treeId].rootItem]) === null || _b === void 0 ? void 0 : _b.children) === null || _c === void 0 ? void 0 : _c[0]
      });
    }
  }
  return React.createElement(TreeEnvironmentContext.Provider, {
    value: environmentContextProps
  }, React.createElement(InteractionManagerProvider, null, React.createElement(DragAndDropProvider, null, React.createElement(EnvironmentActionsProvider, {
    ref: ref
  }, props.children))));
});

var DragBetweenLine = function (_a) {
  var _b;
  var treeId = _a.treeId;
  var _c = useDragAndDrop(),
    draggingPosition = _c.draggingPosition,
    itemHeight = _c.itemHeight;
  var renderers = useTree().renderers;
  var shouldDisplay = draggingPosition && draggingPosition.targetType === 'between-items' && draggingPosition.treeId === treeId;
  if (!shouldDisplay) {
    return null;
  }
  var lineProps = {
    onDragOver: function (e) {
      return e.preventDefault();
    } // Allow dropping
  };
  return React.createElement("div", {
    style: {
      position: 'absolute',
      left: '0',
      right: '0',
      top: "".concat(((_b = draggingPosition === null || draggingPosition === void 0 ? void 0 : draggingPosition.linearIndex) !== null && _b !== void 0 ? _b : 0) * itemHeight, "px")
    }
  }, renderers.renderDragBetweenLine({
    draggingPosition: draggingPosition,
    lineProps: lineProps
  }));
};

var useHtmlElementEventListener = function (element, type, listener) {
  var stableListener = useStableHandler(listener);
  useEffect(function () {
    if (element) {
      element.addEventListener(type, stableListener);
      return function () {
        return element.removeEventListener(type, stableListener);
      };
    }
    return function () {};
  }, [element, stableListener, type]);
};

var useFocusWithin = function (element, onFocusIn, onFocusOut) {
  var _a = useState(false),
    focusWithin = _a[0],
    setFocusWithin = _a[1];
  var isLoosingFocusFlag = useRef(false);
  var callSoon = useCallSoon();
  useHtmlElementEventListener(element, 'focusin', function () {
    if (!focusWithin) {
      setFocusWithin(true);
      onFocusIn === null || onFocusIn === void 0 ? void 0 : onFocusIn();
    }
    if (isLoosingFocusFlag.current) {
      isLoosingFocusFlag.current = false;
    }
  });
  useHtmlElementEventListener(element, 'focusout', function () {
    isLoosingFocusFlag.current = true;
    callSoon(function () {
      if (isLoosingFocusFlag.current && !(element === null || element === void 0 ? void 0 : element.contains(document.activeElement))) {
        onFocusOut === null || onFocusOut === void 0 ? void 0 : onFocusOut();
        isLoosingFocusFlag.current = false;
        setFocusWithin(false);
      }
    });
  });
  return focusWithin;
};

var useKey = function (key, onHit, active) {
  useHtmlElementEventListener(getDocument(), 'keydown', function (e) {
    if (!active) {
      return;
    }
    if (active && key.toLowerCase() === e.key.toLowerCase()) {
      onHit(e);
    }
  });
};

var defaultKeyboardBindings = {
  expandSiblings: ['control+*'],
  moveFocusToFirstItem: ['home'],
  moveFocusToLastItem: ['end'],
  primaryAction: ['enter'],
  renameItem: ['f2'],
  abortRenameItem: ['escape'],
  toggleSelectItem: ['control+space'],
  abortSearch: ['escape', 'enter'],
  startSearch: [],
  selectAll: ['control+a'],
  startProgrammaticDnd: ['control+d'],
  completeProgrammaticDnd: ['enter'],
  abortProgrammaticDnd: ['escape']
};

var __assign$5 = undefined && undefined.__assign || function () {
  __assign$5 = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign$5.apply(this, arguments);
};
var useKeyboardBindings = function () {
  var environment = useTreeEnvironment();
  return useMemo(function () {
    if (environment.keyboardBindings) {
      return __assign$5(__assign$5({}, defaultKeyboardBindings), environment.keyboardBindings);
    }
    return defaultKeyboardBindings;
  }, [environment.keyboardBindings]);
};

var elementsThatCanTakeText = ['input', 'textarea'];
var useHotkey = function (combinationName, onHit, active, activatableWhileFocusingInput) {
  if (activatableWhileFocusingInput === void 0) {
    activatableWhileFocusingInput = false;
  }
  var pressedKeys = useRef([]);
  var keyboardBindings = useKeyboardBindings();
  var callSoon = useCallSoon();
  var possibleCombinations = useMemo(function () {
    return keyboardBindings[combinationName].map(function (combination) {
      return combination.split('+');
    });
  }, [combinationName, keyboardBindings]);
  useHtmlElementEventListener(getDocument(), 'keydown', function (e) {
    var _a;
    if (active === false) {
      return;
    }
    if ((elementsThatCanTakeText.includes((_a = e.target.tagName) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || e.target.isContentEditable) && !activatableWhileFocusingInput) {
      // Skip if an input is selected
      return;
    }
    if (!pressedKeys.current.includes(e.key)) {
      pressedKeys.current.push(e.key);
      var pressedKeysLowercase_1 = pressedKeys.current.map(function (key) {
        return key.toLowerCase();
      });
      var partialMatch = possibleCombinations.map(function (combination) {
        return pressedKeysLowercase_1.map(function (key) {
          return combination.includes(key.toLowerCase());
        }).reduce(function (a, b) {
          return a && b;
        }, true);
      }).reduce(function (a, b) {
        return a || b;
      }, false);
      if (partialMatch) {
        if (pressedKeys.current.length > 1 || !/^[a-zA-Z]$/.test(e.key)) {
          // Prevent default, but not if this is the first input and a letter (which should trigger a search)
          e.preventDefault();
        }
      }
    }
  });
  useHtmlElementEventListener(getDocument(), 'keyup', function (e) {
    if (active === false) {
      return;
    }
    var pressedKeysLowercase = pressedKeys.current.map(function (key) {
      return key.toLowerCase();
    });
    var match = possibleCombinations.map(function (combination) {
      return combination.map(function (key) {
        return pressedKeysLowercase.includes(key.toLowerCase());
      }).reduce(function (a, b) {
        return a && b;
      }, true);
    }).reduce(function (a, b) {
      return a || b;
    }, false);
    if (match) {
      callSoon(function () {
        return onHit(e);
      });
    }
    pressedKeys.current = pressedKeys.current.filter(function (key) {
      return key !== e.key;
    });
  });
};

var useViewState = function () {
  var _a;
  var treeId = useTree().treeId;
  var viewState = useTreeEnvironment().viewState;
  return (_a = viewState[treeId]) !== null && _a !== void 0 ? _a : {};
};

var useLinearItems = function (treeId) {
  return useTreeEnvironment().linearItems[treeId];
};

var useMoveFocusToIndex = function () {
  var treeId = useTree().treeId;
  var _a = useTreeEnvironment(),
    onFocusItem = _a.onFocusItem,
    items = _a.items;
  var linearItems = useLinearItems(treeId);
  var viewState = useViewState();
  return useStableHandler(function (computeNewIndex) {
    var _a;
    var currentIndex = (_a = linearItems.findIndex(function (item) {
      return item.item === viewState.focusedItem;
    })) !== null && _a !== void 0 ? _a : 0;
    var newIndex = computeNewIndex(currentIndex, linearItems);
    var newIndexBounded = Math.max(0, Math.min(linearItems.length - 1, newIndex));
    var newFocusItem = items[linearItems[newIndexBounded].item];
    onFocusItem === null || onFocusItem === void 0 ? void 0 : onFocusItem(newFocusItem, treeId);
    return newFocusItem;
  });
};

var __spreadArray$2 = undefined && undefined.__spreadArray || function (to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};
var usePrevious = function (value) {
  var ref = useRef({
    target: value,
    previous: undefined
  });
  if (ref.current.target !== value) {
    ref.current.previous = ref.current.target;
    ref.current.target = value;
  }
  return ref.current.previous;
};
var useSelectUpTo = function (startingAt) {
  var viewState = useViewState();
  var treeId = useTree().treeId;
  var linearItems = useLinearItems(treeId);
  var onSelectItems = useTreeEnvironment().onSelectItems;
  var focusedItemPrevious = usePrevious(viewState.focusedItem);
  return useCallback(function (item, overrideOldSelection) {
    var _a, _b;
    if (overrideOldSelection === void 0) {
      overrideOldSelection = false;
    }
    var itemIndex = item.index;
    var selectMergedItems = function (oldSelection, newSelection) {
      var merged = __spreadArray$2(__spreadArray$2([], overrideOldSelection ? [] : oldSelection, true), newSelection.filter(function (i) {
        return overrideOldSelection || !oldSelection.includes(i);
      }), true);
      onSelectItems === null || onSelectItems === void 0 ? void 0 : onSelectItems(merged, treeId);
    };
    if (viewState && viewState.selectedItems && viewState.selectedItems.length > 0) {
      // Depending on whether focusItem() or selectUpTo() was called first, which item was the last focused item depends
      var lastFocus_1 = viewState.focusedItem === itemIndex ? focusedItemPrevious : viewState.focusedItem;
      var selectionStart = startingAt === 'last-focus' ? linearItems.findIndex(function (linearItem) {
        return lastFocus_1 === linearItem.item;
      }) : linearItems.findIndex(function (linearItem) {
        var _a;
        return (_a = viewState.selectedItems) === null || _a === void 0 ? void 0 : _a.includes(linearItem.item);
      });
      var selectionEnd = linearItems.findIndex(function (linearItem) {
        return linearItem.item === itemIndex;
      });
      if (selectionStart < selectionEnd) {
        var selection = linearItems.slice(selectionStart, selectionEnd + 1).map(function (_a) {
          var item = _a.item;
          return item;
        });
        selectMergedItems((_a = viewState.selectedItems) !== null && _a !== void 0 ? _a : [], selection);
      } else {
        var selection = linearItems.slice(selectionEnd, selectionStart + 1).map(function (_a) {
          var item = _a.item;
          return item;
        });
        selectMergedItems((_b = viewState.selectedItems) !== null && _b !== void 0 ? _b : [], selection);
      }
    } else {
      onSelectItems === null || onSelectItems === void 0 ? void 0 : onSelectItems([itemIndex], treeId);
    }
  }, [viewState, onSelectItems, treeId, startingAt, linearItems, focusedItemPrevious]);
};

var __spreadArray$1 = undefined && undefined.__spreadArray || function (to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};
var useTreeKeyboardBindings = function () {
  var _a;
  var environment = useTreeEnvironment();
  var _b = useTree(),
    treeId = _b.treeId,
    setRenamingItem = _b.setRenamingItem,
    setSearch = _b.setSearch,
    renamingItem = _b.renamingItem;
  var linearItems = useLinearItems(treeId);
  var dnd = useDragAndDrop();
  var viewState = useViewState();
  var moveFocusToIndex = useMoveFocusToIndex();
  var selectUpTo = useSelectUpTo('first-selected');
  var isActiveTree = environment.activeTreeId === treeId;
  var isRenaming = !!renamingItem;
  var disableArrowKeys = environment.disableArrowKeys;
  var enableArrowKeys = !disableArrowKeys && isActiveTree && !isRenaming;
  useKey('arrowdown', function (e) {
    e.preventDefault();
    if (dnd.isProgrammaticallyDragging) {
      dnd.programmaticDragDown();
    } else {
      var newFocusItem = moveFocusToIndex(function (currentIndex) {
        return currentIndex + 1;
      });
      if (e.shiftKey) {
        selectUpTo(newFocusItem);
      }
    }
  }, enableArrowKeys);
  useKey('arrowup', function (e) {
    e.preventDefault();
    if (dnd.isProgrammaticallyDragging) {
      dnd.programmaticDragUp();
    } else {
      var newFocusItem = moveFocusToIndex(function (currentIndex) {
        return currentIndex - 1;
      });
      if (e.shiftKey) {
        selectUpTo(newFocusItem);
      }
    }
  }, enableArrowKeys);
  useHotkey('moveFocusToFirstItem', function (e) {
    e.preventDefault();
    moveFocusToIndex(function () {
      return 0;
    });
  }, isActiveTree && !dnd.isProgrammaticallyDragging && !isRenaming);
  useHotkey('moveFocusToLastItem', function (e) {
    e.preventDefault();
    moveFocusToIndex(function (currentIndex, linearItems) {
      return linearItems.length - 1;
    });
  }, isActiveTree && !dnd.isProgrammaticallyDragging && !isRenaming);
  useKey('arrowright', function (e) {
    e.preventDefault();
    moveFocusToIndex(function (currentIndex, linearItems) {
      var _a, _b;
      var item = environment.items[linearItems[currentIndex].item];
      if (item.isFolder) {
        if ((_a = viewState.expandedItems) === null || _a === void 0 ? void 0 : _a.includes(item.index)) {
          return currentIndex + 1;
        }
        (_b = environment.onExpandItem) === null || _b === void 0 ? void 0 : _b.call(environment, item, treeId);
      }
      return currentIndex;
    });
  }, enableArrowKeys && !dnd.isProgrammaticallyDragging);
  useKey('arrowleft', function (e) {
    e.preventDefault();
    moveFocusToIndex(function (currentIndex, linearItems) {
      var _a, _b;
      var item = environment.items[linearItems[currentIndex].item];
      var itemDepth = linearItems[currentIndex].depth;
      if (item.isFolder && ((_a = viewState.expandedItems) === null || _a === void 0 ? void 0 : _a.includes(item.index))) {
        (_b = environment.onCollapseItem) === null || _b === void 0 ? void 0 : _b.call(environment, item, treeId);
      } else if (itemDepth > 0) {
        var parentIndex = currentIndex;
        for (parentIndex; linearItems[parentIndex].depth !== itemDepth - 1; parentIndex -= 1);
        return parentIndex;
      }
      return currentIndex;
    });
  }, enableArrowKeys && !dnd.isProgrammaticallyDragging);
  useHotkey('primaryAction', function (e) {
    var _a, _b;
    e.preventDefault();
    if (viewState.focusedItem !== undefined) {
      (_a = environment.onSelectItems) === null || _a === void 0 ? void 0 : _a.call(environment, [viewState.focusedItem], treeId);
      (_b = environment.onPrimaryAction) === null || _b === void 0 ? void 0 : _b.call(environment, environment.items[viewState.focusedItem], treeId);
    }
  }, isActiveTree && !dnd.isProgrammaticallyDragging && !isRenaming);
  useHotkey('toggleSelectItem', function (e) {
    var _a, _b, _c;
    e.preventDefault();
    if (viewState.focusedItem !== undefined) {
      if (viewState.selectedItems && viewState.selectedItems.includes(viewState.focusedItem)) {
        (_a = environment.onSelectItems) === null || _a === void 0 ? void 0 : _a.call(environment, viewState.selectedItems.filter(function (item) {
          return item !== viewState.focusedItem;
        }), treeId);
      } else {
        (_b = environment.onSelectItems) === null || _b === void 0 ? void 0 : _b.call(environment, __spreadArray$1(__spreadArray$1([], (_c = viewState.selectedItems) !== null && _c !== void 0 ? _c : [], true), [viewState.focusedItem], false), treeId);
      }
    }
  }, isActiveTree && !dnd.isProgrammaticallyDragging && !isRenaming);
  useHotkey('selectAll', function (e) {
    var _a;
    e.preventDefault();
    (_a = environment.onSelectItems) === null || _a === void 0 ? void 0 : _a.call(environment, linearItems.map(function (_a) {
      var item = _a.item;
      return item;
    }), treeId);
  }, isActiveTree && !dnd.isProgrammaticallyDragging && !isRenaming);
  useHotkey('renameItem', function (e) {
    var _a;
    if (viewState.focusedItem === undefined) {
      return;
    }
    e.preventDefault();
    var item = environment.items[viewState.focusedItem];
    if (item.canRename === false) {
      return;
    }
    (_a = environment.onStartRenamingItem) === null || _a === void 0 ? void 0 : _a.call(environment, item, treeId);
    setRenamingItem(item.index);
  }, isActiveTree && ((_a = environment.canRename) !== null && _a !== void 0 ? _a : true) && !isRenaming);
  useHotkey('startSearch', function (e) {
    var _a, _b;
    e.preventDefault();
    setSearch('');
    (_b = (_a = document.querySelector('[data-rct-search-input="true"]')) === null || _a === void 0 ? void 0 : _a.focus) === null || _b === void 0 ? void 0 : _b.call(_a);
  }, isActiveTree && !dnd.isProgrammaticallyDragging && !isRenaming);
  useHotkey('startProgrammaticDnd', function (e) {
    e.preventDefault();
    dnd.startProgrammaticDrag();
  }, isActiveTree && !isRenaming);
  useHotkey('completeProgrammaticDnd', function (e) {
    e.preventDefault();
    dnd.completeProgrammaticDrag();
  }, isActiveTree && dnd.isProgrammaticallyDragging && !isRenaming);
  useHotkey('abortProgrammaticDnd', function (e) {
    e.preventDefault();
    dnd.abortProgrammaticDrag();
  }, isActiveTree && dnd.isProgrammaticallyDragging && !isRenaming);
};

var defaultMatcher = function (search, item, itemTitle) {
  return itemTitle.toLowerCase().includes(search.toLowerCase());
};

var useSearchMatchFocus = function () {
  var _a = useTreeEnvironment(),
    doesSearchMatchItem = _a.doesSearchMatchItem,
    items = _a.items,
    getItemTitle = _a.getItemTitle,
    onFocusItem = _a.onFocusItem;
  var _b = useTree(),
    search = _b.search,
    treeId = _b.treeId;
  var linearItems = useLinearItems(treeId);
  var callSoon = useCallSoon();
  useSideEffect(function () {
    if (search && search.length > 0) {
      callSoon(function () {
        var focusItem = linearItems.find(function (_a) {
          var item = _a.item;
          return (doesSearchMatchItem !== null && doesSearchMatchItem !== void 0 ? doesSearchMatchItem : defaultMatcher)(search, items[item], getItemTitle(items[item]));
        });
        if (focusItem) {
          onFocusItem === null || onFocusItem === void 0 ? void 0 : onFocusItem(items[focusItem.item], treeId);
        }
      });
    }
  }, [doesSearchMatchItem, getItemTitle, linearItems, items, onFocusItem, search, treeId, callSoon], [search]);
};

var __assign$4 = undefined && undefined.__assign || function () {
  __assign$4 = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign$4.apply(this, arguments);
};
var SearchInput = function (_a) {
  var _b;
  var containerRef = _a.containerRef;
  var _c = useTree(),
    search = _c.search,
    setSearch = _c.setSearch,
    treeId = _c.treeId,
    renderers = _c.renderers,
    renamingItem = _c.renamingItem;
  var environment = useTreeEnvironment();
  useViewState();
  var isActiveTree = environment.activeTreeId === treeId;
  var callSoon = useCallSoon();
  useSearchMatchFocus();
  var clearSearch = function () {
    var _a, _b, _c;
    setSearch(null);
    if ((_a = environment.autoFocus) !== null && _a !== void 0 ? _a : true) {
      // Refocus item in tree
      // TODO move logic as reusable method into tree or tree environment
      var focusItem = (_b = getDocument()) === null || _b === void 0 ? void 0 : _b.querySelector("[data-rct-tree=\"".concat(treeId, "\"] [data-rct-item-focus=\"true\"]"));
      (_c = focusItem === null || focusItem === void 0 ? void 0 : focusItem.focus) === null || _c === void 0 ? void 0 : _c.call(focusItem);
    }
  };
  useHotkey('abortSearch', function () {
    // Without the callSoon, hitting enter to abort
    // and then moving focus weirdly moves the selected item along
    // with the focused item.
    callSoon(function () {
      clearSearch();
    });
  }, isActiveTree && search !== null, true);
  useHtmlElementEventListener(containerRef, 'keydown', function (e) {
    var _a, _b;
    var unicode = e.key.charCodeAt(0);
    if (((_a = environment.canSearch) !== null && _a !== void 0 ? _a : true) && ((_b = environment.canSearchByStartingTyping) !== null && _b !== void 0 ? _b : true) && isActiveTree && search === null && !renamingItem && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey && (unicode >= 48 && unicode <= 57 ||
    // number
    // (unicode >= 65 && unicode <= 90) || // uppercase letter
    unicode >= 97 && unicode <= 122) // lowercase letter
    ) {
      setSearch('');
    }
  });
  if (!((_b = environment.canSearch) !== null && _b !== void 0 ? _b : true) || search === null) {
    return null;
  }
  return renderers.renderSearchInput({
    inputProps: __assign$4({
      value: search,
      onChange: function (e) {
        return setSearch(e.target.value);
      },
      onBlur: function () {
        clearSearch();
      },
      ref: function (el) {
        var _a;
        (_a = el === null || el === void 0 ? void 0 : el.focus) === null || _a === void 0 ? void 0 : _a.call(el);
      },
      'aria-label': 'Search for items'
    }, {
      'data-rct-search-input': 'true'
    })
  });
};

var defaultLiveDescriptors = {
  introduction: "\n    <p>Accessibility guide for tree {treeLabel}.</p>\n    <p>\n      Navigate the tree with the arrow keys. Common tree hotkeys apply. Further keybindings are available:\n    </p>\n    <ul>\n      <li>{keybinding:primaryAction} to execute primary action on focused item</li>\n      <li>{keybinding:renameItem} to start renaming the focused item</li>\n      <li>{keybinding:abortRenameItem} to abort renaming an item</li>\n      <li>{keybinding:startProgrammaticDnd} to start dragging selected items</li>\n    </ul>\n  ",
  renamingItem: "\n    <p>Renaming the item {renamingItem}.</p>\n    <p>Use the keybinding {keybinding:abortRenameItem} to abort renaming.</p>\n  ",
  searching: "\n    <p>Searching</p>\n  ",
  programmaticallyDragging: "\n    <p>Dragging items {dragItems}.</p>\n    <p>Press the arrow keys to move the drag target.</p>\n    <p>Press {keybinding:completeProgrammaticDnd} to drop or {keybinding:abortProgrammaticDnd} to abort.</p>\n  ",
  programmaticallyDraggingTarget: "\n    <p>Drop target is {dropTarget}.</p>\n  "
};

var resolveLiveDescriptor = function (descriptor, environment, dnd, tree, keyboardBindings) {
  var getItemTitle = function (index) {
    return environment.getItemTitle(environment.items[index]);
  };
  return descriptor.replace(/({[^\s}]+)}/g, function (variableNameWithBrackets) {
    var _a, _b, _c;
    var variableName = variableNameWithBrackets.slice(1, -1);
    switch (variableName) {
      case 'treeLabel':
        return (_a = tree.treeLabel) !== null && _a !== void 0 ? _a : '';
      case 'renamingItem':
        return tree.renamingItem ? getItemTitle(tree.renamingItem) : 'None';
      case 'dragItems':
        return (_c = (_b = dnd.draggingItems) === null || _b === void 0 ? void 0 : _b.map(function (item) {
          return environment.getItemTitle(item);
        }).join(', ')) !== null && _c !== void 0 ? _c : 'None';
      case 'dropTarget':
        {
          if (!dnd.draggingPosition) {
            return 'None';
          }
          if (dnd.draggingPosition.targetType === 'item' || dnd.draggingPosition.targetType === 'root') {
            return "within ".concat(getItemTitle(dnd.draggingPosition.targetItem));
          }
          var parentItem = environment.items[dnd.draggingPosition.parentItem];
          var parentTitle = environment.getItemTitle(parentItem);
          if (dnd.draggingPosition.childIndex === 0) {
            return "within ".concat(parentTitle, " at the start");
          }
          return "within ".concat(parentTitle, " after ").concat(getItemTitle(parentItem.children[dnd.draggingPosition.childIndex - 1]));
        }
      default:
        if (variableName.startsWith('keybinding:')) {
          return keyboardBindings[variableName.slice(11)][0];
        }
        throw Error("Unknown live descriptor variable {".concat(variableName, "}"));
    }
  });
};

var LiveWrapper = function (_a) {
  var children = _a.children,
    live = _a.live;
  return React.createElement("div", {
    "aria-live": live,
    dangerouslySetInnerHTML: {
      __html: children
    }
  });
};
var LiveDescription = function () {
  var env = useTreeEnvironment();
  var tree = useTree();
  var dnd = useDragAndDrop();
  var keys = useKeyboardBindings();
  var descriptors = useMemo(function () {
    var _a;
    return (_a = env.liveDescriptors) !== null && _a !== void 0 ? _a : defaultLiveDescriptors;
  }, [env.liveDescriptors]);
  var MainWrapper = tree.renderers.renderLiveDescriptorContainer;
  if (tree.treeInformation.isRenaming) {
    return React.createElement(MainWrapper, {
      tree: tree
    }, React.createElement(LiveWrapper, {
      live: "polite"
    }, resolveLiveDescriptor(descriptors.renamingItem, env, dnd, tree, keys)));
  }
  if (tree.treeInformation.isSearching) {
    return React.createElement(MainWrapper, {
      tree: tree
    }, React.createElement(LiveWrapper, {
      live: "polite"
    }, resolveLiveDescriptor(descriptors.searching, env, dnd, tree, keys)));
  }
  if (tree.treeInformation.isProgrammaticallyDragging) {
    return React.createElement(MainWrapper, {
      tree: tree
    }, React.createElement(LiveWrapper, {
      live: "polite"
    }, resolveLiveDescriptor(descriptors.programmaticallyDragging, env, dnd, tree, keys)), React.createElement(LiveWrapper, {
      live: "assertive"
    }, resolveLiveDescriptor(descriptors.programmaticallyDraggingTarget, env, dnd, tree, keys)));
  }
  return React.createElement(MainWrapper, {
    tree: tree
  }, React.createElement(LiveWrapper, {
    live: "off"
  }, resolveLiveDescriptor(descriptors.introduction, env, dnd, tree, keys)));
};

var MaybeLiveDescription = function () {
  var _a;
  var env = useTreeEnvironment();
  if (!((_a = env.showLiveDescription) !== null && _a !== void 0 ? _a : true)) {
    return null;
  }
  return React.createElement(LiveDescription, null);
};

var __assign$3 = undefined && undefined.__assign || function () {
  __assign$3 = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign$3.apply(this, arguments);
};
var TreeManager = function () {
  var _a = useTree(),
    treeId = _a.treeId,
    rootItem = _a.rootItem,
    renderers = _a.renderers,
    treeInformation = _a.treeInformation;
  var environment = useTreeEnvironment();
  var containerRef = useRef();
  var dnd = useDragAndDrop();
  useTreeKeyboardBindings();
  useFocusWithin(containerRef.current, function () {
    environment.setActiveTree(treeId);
  }, function () {
    environment.setActiveTree(function (oldTreeId) {
      return oldTreeId === treeId ? undefined : oldTreeId;
    });
  });
  var rootChildren = environment.items[rootItem].children;
  var treeChildren = React.createElement(React.Fragment, null, React.createElement(MaybeLiveDescription, null), React.createElement(TreeItemChildren, {
    depth: 0,
    parentId: rootItem
  }, rootChildren !== null && rootChildren !== void 0 ? rootChildren : []), React.createElement(DragBetweenLine, {
    treeId: treeId
  }), React.createElement(SearchInput, {
    containerRef: containerRef.current
  }));
  var containerProps = __assign$3({
    onDragOver: function (e) {
      e.preventDefault(); // Allow drop. Also implicitly set by items, but needed here as well for dropping on empty space
      dnd.onDragOverTreeHandler(e, treeId, containerRef);
    },
    onDragLeave: function (e) {
      dnd.onDragLeaveContainerHandler(e, containerRef);
    },
    onMouseDown: function () {
      return dnd.abortProgrammaticDrag();
    },
    ref: containerRef,
    style: {
      position: 'relative'
    },
    role: 'tree',
    'aria-label': !treeInformation.treeLabelledBy ? treeInformation.treeLabel : undefined,
    'aria-labelledby': treeInformation.treeLabelledBy
  }, {
    'data-rct-tree': treeId
  });
  return renderers.renderTreeContainer({
    children: treeChildren,
    info: treeInformation,
    containerProps: containerProps
  });
};

var useCreatedTreeInformation = function (tree, renamingItem, search) {
  var _a;
  var environment = useTreeEnvironment();
  var dnd = useDragAndDrop();
  var selectedItems = (_a = environment.viewState[tree.treeId]) === null || _a === void 0 ? void 0 : _a.selectedItems;
  return useMemo(function () {
    var _a, _b;
    return {
      isFocused: environment.activeTreeId === tree.treeId,
      isRenaming: !!renamingItem,
      areItemsSelected: ((_a = selectedItems === null || selectedItems === void 0 ? void 0 : selectedItems.length) !== null && _a !== void 0 ? _a : 0) > 0,
      isSearching: search !== null,
      search: search,
      isProgrammaticallyDragging: (_b = dnd.isProgrammaticallyDragging) !== null && _b !== void 0 ? _b : false,
      treeId: tree.treeId,
      rootItem: tree.rootItem,
      treeLabel: tree.treeLabel,
      treeLabelledBy: tree.treeLabelledBy
    };
  }, [environment.activeTreeId, tree.treeId, tree.rootItem, tree.treeLabel, tree.treeLabelledBy, renamingItem, selectedItems === null || selectedItems === void 0 ? void 0 : selectedItems.length, search, dnd.isProgrammaticallyDragging]);
};

var __assign$2 = undefined && undefined.__assign || function () {
  __assign$2 = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign$2.apply(this, arguments);
};
var useCreatedTreeRef = function (ref, actions) {
  var environment = useTreeEnvironment();
  var tree = useTree();
  var dnd = useDragAndDrop();
  useImperativeHandle(ref, function () {
    return __assign$2(__assign$2(__assign$2({}, actions), {
      treeEnvironmentContext: environment,
      dragAndDropContext: dnd,
      treeContext: tree
    }), tree.treeInformation);
  });
};

var EnvironmentActionsContext = React.createContext(null);
var TreeActionsProvider = React.forwardRef(function (props, ref) {
  useTreeEnvironment();
  var tree = useTree();
  useDragAndDrop();
  var envActions = useEnvironmentActions();
  // TODO change tree childs to use actions rather than output events where possible
  // TODO maybe replace with stable handlers
  var actions = useMemo(function () {
    return {
      abortRenamingItem: function () {
        tree.setRenamingItem(null);
      },
      abortSearch: function () {
        tree.setSearch(null);
      },
      collapseItem: function (itemId) {
        envActions.collapseItem(itemId, tree.treeId);
      },
      completeRenamingItem: function () {
        // TODO
      },
      expandItem: function (itemId) {
        envActions.expandItem(itemId, tree.treeId);
      },
      focusItem: function (itemId, setDomFocus) {
        if (setDomFocus === void 0) {
          setDomFocus = true;
        }
        envActions.focusItem(itemId, tree.treeId, setDomFocus);
      },
      focusTree: function (autoFocus) {
        if (autoFocus === void 0) {
          autoFocus = true;
        }
        envActions.focusTree(tree.treeId, autoFocus);
      },
      invokePrimaryAction: function (itemId) {
        envActions.invokePrimaryAction(itemId, tree.treeId);
      },
      moveFocusDown: function () {
        envActions.moveFocusDown(tree.treeId);
      },
      moveFocusUp: function () {
        envActions.moveFocusUp(tree.treeId);
      },
      renameItem: function (itemId, name) {
        envActions.renameItem(itemId, name, tree.treeId);
      },
      selectItems: function (itemsIds) {
        envActions.selectItems(itemsIds, tree.treeId);
      },
      setSearch: function (search) {
        tree.setSearch(search);
      },
      startRenamingItem: function (itemId) {
        tree.setRenamingItem(itemId);
      },
      stopRenamingItem: function () {
        tree.setRenamingItem(null);
      },
      toggleItemExpandedState: function (itemId) {
        envActions.toggleItemExpandedState(itemId, tree.treeId);
      },
      toggleItemSelectStatus: function (itemId) {
        envActions.toggleItemSelectStatus(itemId, tree.treeId);
      },
      expandAll: function () {
        envActions.expandAll(tree.treeId);
      },
      collapseAll: function () {
        envActions.collapseAll(tree.treeId);
      },
      expandSubsequently: function (itemIds) {
        return envActions.expandSubsequently(tree.treeId, itemIds);
      }
    };
  }, [envActions, tree]);
  useCreatedTreeRef(ref, actions);
  return React.createElement(EnvironmentActionsContext.Provider, {
    value: actions
  }, props.children);
});

var __assign$1 = undefined && undefined.__assign || function () {
  __assign$1 = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign$1.apply(this, arguments);
};
var TreeContext = React.createContext(null); // TODO default value
var useTree = function () {
  return useContext(TreeContext);
};
var Tree = React.forwardRef(function (props, ref) {
  var _a;
  var environment = useTreeEnvironment();
  var renderers = useMemo(function () {
    return __assign$1(__assign$1({}, environment), props);
  }, [props, environment]);
  var _b = useState(null),
    search = _b[0],
    setSearch = _b[1];
  var _c = useState(null),
    renamingItem = _c[0],
    setRenamingItem = _c[1];
  var rootItem = environment.items[props.rootItem];
  var viewState = environment.viewState[props.treeId];
  useEffect(function () {
    environment.registerTree({
      treeId: props.treeId,
      rootItem: props.rootItem
    });
    return function () {
      return environment.unregisterTree(props.treeId);
    };
    // TODO should be able to remove soon, and add environment.registerTree, environment.unregisterTree as deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.treeId, props.rootItem]);
  var treeInformation = useCreatedTreeInformation(props, renamingItem, search);
  var treeContextProps = useMemo(function () {
    return {
      treeId: props.treeId,
      rootItem: props.rootItem,
      treeLabel: props.treeLabel,
      treeLabelledBy: props.treeLabelledBy,
      getItemsLinearly: function () {
        return getItemsLinearly(props.rootItem, viewState !== null && viewState !== void 0 ? viewState : {}, environment.items);
      },
      treeInformation: treeInformation,
      search: search,
      setSearch: setSearch,
      renamingItem: renamingItem,
      setRenamingItem: setRenamingItem,
      renderers: renderers
    };
  }, [environment.items, props.rootItem, props.treeId, props.treeLabel, props.treeLabelledBy, renamingItem, renderers, search, treeInformation, viewState]);
  if (rootItem === undefined) {
    (_a = environment.onMissingItems) === null || _a === void 0 ? void 0 : _a.call(environment, [props.rootItem]);
    return null;
  }
  return React.createElement(TreeContext.Provider, {
    value: treeContextProps
  }, React.createElement(TreeActionsProvider, {
    ref: ref
  }, React.createElement(TreeManager, null)));
});

var TreeItemChildren = function (props) {
  var _a = useTree(),
    renderers = _a.renderers,
    treeInformation = _a.treeInformation;
  var childElements = [];
  for (var _i = 0, _b = props.children; _i < _b.length; _i++) {
    var child = _b[_i];
    childElements.push(React__default.createElement(TreeItemElement, {
      key: child,
      itemIndex: child,
      depth: props.depth
    }));
  }
  if (childElements.length === 0) {
    return null;
  }
  var containerProps = {
    role: props.depth !== 0 ? 'group' : undefined
  };
  return renderers.renderItemsContainer({
    children: childElements,
    info: treeInformation,
    containerProps: containerProps,
    depth: props.depth,
    parentId: props.parentId
  });
};

var __assign = undefined && undefined.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
var __spreadArray = undefined && undefined.__spreadArray || function (to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};
// TODO restructure file. Everything into one hook file without helper methods, let all props be generated outside (InteractionManager and AccessibilityPropsManager), ...
var useTreeItemRenderContext = function (item) {
  var _a, _b, _c, _d;
  var _e = useTree(),
    treeId = _e.treeId,
    search = _e.search,
    renamingItem = _e.renamingItem,
    setRenamingItem = _e.setRenamingItem;
  var environment = useTreeEnvironment();
  var interactionManager = useInteractionManager();
  var dnd = useDragAndDrop();
  var selectUpTo = useSelectUpTo('last-focus');
  var itemTitle = item && environment.getItemTitle(item);
  var getOriginalItemOrder = useGetOriginalItemOrder();
  var isSearchMatching = useMemo(function () {
    var _a;
    return search === null || search.length === 0 || !item || !itemTitle ? false : ((_a = environment.doesSearchMatchItem) !== null && _a !== void 0 ? _a : defaultMatcher)(search, item, itemTitle);
  }, [search, item, itemTitle, environment.doesSearchMatchItem]);
  var isSelected = item && ((_b = (_a = environment.viewState[treeId]) === null || _a === void 0 ? void 0 : _a.selectedItems) === null || _b === void 0 ? void 0 : _b.includes(item.index));
  var isExpanded = item && ((_d = (_c = environment.viewState[treeId]) === null || _c === void 0 ? void 0 : _c.expandedItems) === null || _d === void 0 ? void 0 : _d.includes(item.index));
  var isRenaming = item && renamingItem === item.index;
  return useMemo(function () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    if (!item) {
      return undefined;
    }
    var viewState = environment.viewState[treeId];
    var currentlySelectedItems = ((_b = (_a = viewState === null || viewState === void 0 ? void 0 : viewState.selectedItems) === null || _a === void 0 ? void 0 : _a.map(function (item) {
      return environment.items[item];
    })) !== null && _b !== void 0 ? _b : (viewState === null || viewState === void 0 ? void 0 : viewState.focusedItem) ? [environment.items[viewState === null || viewState === void 0 ? void 0 : viewState.focusedItem]] : []).filter(function (item) {
      return !!item;
    });
    var isItemPartOfSelectedItems = !!currentlySelectedItems.find(function (selectedItem) {
      return selectedItem.index === item.index;
    });
    var canDragCurrentlySelectedItems = currentlySelectedItems && ((_d = (_c = environment.canDrag) === null || _c === void 0 ? void 0 : _c.call(environment, currentlySelectedItems)) !== null && _d !== void 0 ? _d : true) && currentlySelectedItems.map(function (item) {
      var _a;
      return (_a = item.canMove) !== null && _a !== void 0 ? _a : true;
    }).reduce(function (a, b) {
      return a && b;
    }, true);
    var canDragThisItem = ((_f = (_e = environment.canDrag) === null || _e === void 0 ? void 0 : _e.call(environment, [item])) !== null && _f !== void 0 ? _f : true) && ((_g = item.canMove) !== null && _g !== void 0 ? _g : true);
    var canDrag = environment.canDragAndDrop && (isItemPartOfSelectedItems && canDragCurrentlySelectedItems || !isItemPartOfSelectedItems && canDragThisItem);
    var canDropOn = environment.canDragAndDrop && !!((_j = (_h = dnd.viableDragPositions) === null || _h === void 0 ? void 0 : _h[treeId]) === null || _j === void 0 ? void 0 : _j.find(function (position) {
      return position.targetType === 'item' && position.targetItem === item.index;
    }));
    var actions = {
      // TODO disable most actions during rename
      primaryAction: function () {
        var _a;
        (_a = environment.onPrimaryAction) === null || _a === void 0 ? void 0 : _a.call(environment, environment.items[item.index], treeId);
      },
      collapseItem: function () {
        var _a;
        (_a = environment.onCollapseItem) === null || _a === void 0 ? void 0 : _a.call(environment, item, treeId);
      },
      expandItem: function () {
        var _a;
        (_a = environment.onExpandItem) === null || _a === void 0 ? void 0 : _a.call(environment, item, treeId);
      },
      toggleExpandedState: function () {
        var _a, _b;
        if (isExpanded) {
          (_a = environment.onCollapseItem) === null || _a === void 0 ? void 0 : _a.call(environment, item, treeId);
        } else {
          (_b = environment.onExpandItem) === null || _b === void 0 ? void 0 : _b.call(environment, item, treeId);
        }
      },
      selectItem: function () {
        var _a;
        (_a = environment.onSelectItems) === null || _a === void 0 ? void 0 : _a.call(environment, [item.index], treeId);
      },
      addToSelectedItems: function () {
        var _a, _b;
        (_a = environment.onSelectItems) === null || _a === void 0 ? void 0 : _a.call(environment, __spreadArray(__spreadArray([], (_b = viewState === null || viewState === void 0 ? void 0 : viewState.selectedItems) !== null && _b !== void 0 ? _b : [], true), [item.index], false), treeId);
      },
      unselectItem: function () {
        var _a, _b, _c;
        (_a = environment.onSelectItems) === null || _a === void 0 ? void 0 : _a.call(environment, (_c = (_b = viewState === null || viewState === void 0 ? void 0 : viewState.selectedItems) === null || _b === void 0 ? void 0 : _b.filter(function (id) {
          return id !== item.index;
        })) !== null && _c !== void 0 ? _c : [], treeId);
      },
      selectUpTo: function (overrideOldSelection) {
        selectUpTo(item, overrideOldSelection);
      },
      startRenamingItem: function () {
        setRenamingItem(item.index);
      },
      stopRenamingItem: function () {
        setRenamingItem(null);
      },
      focusItem: function (setDomFocus) {
        var _a;
        if (setDomFocus === void 0) {
          setDomFocus = true;
        }
        (_a = environment.onFocusItem) === null || _a === void 0 ? void 0 : _a.call(environment, item, treeId, setDomFocus);
      },
      startDragging: function () {
        var _a, _b;
        var selectedItems = (_a = viewState === null || viewState === void 0 ? void 0 : viewState.selectedItems) !== null && _a !== void 0 ? _a : [];
        if (!selectedItems.includes(item.index)) {
          selectedItems = [item.index];
          (_b = environment.onSelectItems) === null || _b === void 0 ? void 0 : _b.call(environment, selectedItems, treeId);
        }
        if (canDrag) {
          var orderedItems = getOriginalItemOrder(treeId, selectedItems.map(function (id) {
            return environment.items[id];
          }));
          dnd.onStartDraggingItems(orderedItems, treeId);
        }
      }
    };
    var renderFlags = {
      isSelected: isSelected,
      isExpanded: isExpanded,
      isFocused: (viewState === null || viewState === void 0 ? void 0 : viewState.focusedItem) === item.index,
      isRenaming: isRenaming,
      isDraggingOver: dnd.draggingPosition && dnd.draggingPosition.targetType === 'item' && dnd.draggingPosition.targetItem === item.index && dnd.draggingPosition.treeId === treeId,
      isDraggingOverParent: false,
      isSearchMatching: isSearchMatching,
      canDrag: canDrag,
      canDropOn: canDropOn
    };
    var interactiveElementProps = __assign(__assign({}, interactionManager.createInteractiveElementProps(item, treeId, actions, renderFlags, viewState)), {
      'data-rct-item-interactive': true,
      'data-rct-item-focus': renderFlags.isFocused ? 'true' : 'false',
      'data-rct-item-id': item.index
    });
    var itemContainerWithoutChildrenProps = __assign({}, {
      'data-rct-item-container': 'true'
    });
    var itemContainerWithChildrenProps = {
      role: 'treeitem',
      'aria-selected': renderFlags.isSelected,
      'aria-expanded': item.isFolder ? renderFlags.isExpanded ? 'true' : 'false' : undefined
    };
    var arrowProps = {
      onClick: function () {
        if (item.isFolder) {
          actions.toggleExpandedState();
        }
        actions.selectItem();
      },
      onFocus: function () {
        actions.focusItem();
      },
      onDragOver: function (e) {
        e.preventDefault(); // Allow drop
      },
      'aria-hidden': true,
      tabIndex: -1
    };
    var viewStateFlags = !viewState ? {} : Object.entries(viewState).reduce(function (acc, _a) {
      var key = _a[0],
        value = _a[1];
      acc[key] = Array.isArray(value) ? value.includes(item.index) : value === item.index;
      return acc;
    }, {});
    return __assign(__assign(__assign({}, actions), renderFlags), {
      interactiveElementProps: interactiveElementProps,
      itemContainerWithChildrenProps: itemContainerWithChildrenProps,
      itemContainerWithoutChildrenProps: itemContainerWithoutChildrenProps,
      arrowProps: arrowProps,
      viewStateFlags: viewStateFlags
    });
  }, [item, environment, treeId, dnd, isSelected, isExpanded, isRenaming, isSearchMatching, interactionManager, selectUpTo, setRenamingItem, getOriginalItemOrder]);
};

var TreeItemRenamingInput = function (props) {
  var _a = useTree(),
    renderers = _a.renderers,
    treeInformation = _a.treeInformation,
    setRenamingItem = _a.setRenamingItem,
    treeId = _a.treeId;
  var environment = useTreeEnvironment();
  var inputRef = useRef(null);
  var submitButtonRef = useRef(null);
  var item = environment.items[props.itemIndex];
  var _b = useState(environment.getItemTitle(item)),
    title = _b[0],
    setTitle = _b[1];
  var callSoon = useCallSoon(true);
  var abort = function () {
    var _a;
    (_a = environment.onAbortRenamingItem) === null || _a === void 0 ? void 0 : _a.call(environment, item, treeInformation.treeId);
    setRenamingItem(null);
    callSoon(function () {
      environment.setActiveTree(treeId);
    });
  };
  var confirm = function () {
    var _a;
    (_a = environment.onRenameItem) === null || _a === void 0 ? void 0 : _a.call(environment, item, title, treeInformation.treeId);
    setRenamingItem(null);
    callSoon(function () {
      environment.setActiveTree(treeId);
    });
  };
  useSideEffect(function () {
    var _a, _b, _c, _d;
    environment.setActiveTree(treeId);
    if ((_a = environment.autoFocus) !== null && _a !== void 0 ? _a : true) {
      (_b = inputRef.current) === null || _b === void 0 ? void 0 : _b.select();
      (_d = (_c = inputRef.current) === null || _c === void 0 ? void 0 : _c.focus) === null || _d === void 0 ? void 0 : _d.call(_c);
    }
  }, [environment, treeId], []);
  useHotkey('abortRenameItem', function () {
    abort();
  }, true, true);
  var inputProps = {
    value: title,
    onChange: function (e) {
      setTitle(e.target.value);
    },
    onBlur: function (e) {
      if (!e.relatedTarget || e.relatedTarget !== submitButtonRef.current) {
        abort();
      }
    },
    'aria-label': 'New item name',
    tabIndex: 0
  };
  var submitButtonProps = {
    onClick: function (e) {
      e.stopPropagation();
      confirm();
    }
  };
  var formProps = {
    onSubmit: function (e) {
      e.preventDefault();
      confirm();
    }
  };
  return renderers.renderRenameInput({
    item: item,
    inputRef: inputRef,
    submitButtonProps: submitButtonProps,
    submitButtonRef: submitButtonRef,
    formProps: formProps,
    inputProps: inputProps
  });
};

var TreeItemElement = function (props) {
  var _a, _b, _c, _d;
  var _e = useState(false),
    hasBeenRequested = _e[0],
    setHasBeenRequested = _e[1];
  var _f = useTree(),
    renderers = _f.renderers,
    treeInformation = _f.treeInformation,
    renamingItem = _f.renamingItem;
  var environment = useTreeEnvironment();
  var viewState = useViewState();
  var item = environment.items[props.itemIndex];
  var isExpanded = useMemo(function () {
    var _a;
    return (_a = viewState.expandedItems) === null || _a === void 0 ? void 0 : _a.includes(props.itemIndex);
  }, [props.itemIndex, viewState.expandedItems]);
  var renderContext = useTreeItemRenderContext(item);
  if (item === undefined || renderContext === undefined) {
    if (!hasBeenRequested) {
      setHasBeenRequested(true);
      (_a = environment.onMissingItems) === null || _a === void 0 ? void 0 : _a.call(environment, [props.itemIndex]);
    }
    return null;
  }
  var shouldRenderChildren = (_c = (_b = environment.shouldRenderChildren) === null || _b === void 0 ? void 0 : _b.call(environment, item, renderContext)) !== null && _c !== void 0 ? _c : item.isFolder && isExpanded;
  var children = item.children && shouldRenderChildren && React__default.createElement(TreeItemChildren, {
    depth: props.depth + 1,
    parentId: props.itemIndex
  }, item.children);
  var title = environment.getItemTitle(item);
  var titleComponent = renamingItem === props.itemIndex ? React__default.createElement(TreeItemRenamingInput, {
    itemIndex: props.itemIndex
  }) : renderers.renderItemTitle({
    info: treeInformation,
    context: renderContext,
    title: title,
    item: item
  });
  var arrowComponent = renderers.renderItemArrow({
    info: treeInformation,
    context: renderContext,
    item: environment.items[props.itemIndex]
  });
  return (_d = renderers.renderItem({
    item: environment.items[props.itemIndex],
    depth: props.depth,
    title: titleComponent,
    arrow: arrowComponent,
    context: renderContext,
    info: treeInformation,
    children: children
  })) !== null && _d !== void 0 ? _d : null; // Type to use AllTreeRenderProps
};

function treeDataReducer(treeData, action) {
  switch (action.type) {
    case "reload":
      {
        return {
          ...treeData,
          data: action.data
        };
      }
    case "update":
      {
        const result = {
          ...treeData
        };
        result.data = {
          ...result.data,
          ...action.data
        };
        if (action.deletedNodeIDs) {
          for (const deletedNodeID of action.deletedNodeIDs.split(",")) {
            delete result.data[deletedNodeID];
          }
        }
        return result;
      }
    case "setDataChangedDate":
      {
        return {
          ...treeData,
          dataChangedDate: action.dataChangedDate
        };
      }
    default:
      {
        throw Error("Unknown action: " + action.type);
      }
  }
}

/* eslint-disable no-trailing-spaces */
/* eslint-disable comma-spacing */
/* eslint-disable prettier/prettier */

// 폴더 및 파일 아이콘 컴포넌트 추가
const FolderIcon = ({
  isOpen
}) => createElement("span", {
  className: "folder-icon"
}, isOpen ? createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  width: "16",
  height: "16",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, createElement("path", {
  d: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2v11z"
}), createElement("line", {
  x1: "9",
  y1: "14",
  x2: "15",
  y2: "14"
})) : createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  width: "16",
  height: "16",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, createElement("path", {
  d: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2v11z"
})));
const FileIcon = ({
  fileType
}) => {
  // 파일 타입에 따라 다른 아이콘 표시
  const getFileIcon = () => {
    switch (fileType) {
      case 'pptx':
        return createElement("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          width: "16",
          height: "16",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "#FF5733",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }, createElement("path", {
          d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
        }), createElement("polyline", {
          points: "14 2 14 8 20 8"
        }), createElement("text", {
          x: "8",
          y: "19",
          fontSize: "8",
          fill: "#FF5733"
        }, "PPT"));
      case 'xlsx':
        return createElement("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          width: "16",
          height: "16",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "#2E7D32",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }, createElement("path", {
          d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
        }), createElement("polyline", {
          points: "14 2 14 8 20 8"
        }), createElement("text", {
          x: "9",
          y: "19",
          fontSize: "8",
          fill: "#2E7D32"
        }, "XL"));
      case 'docx':
        return createElement("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          width: "16",
          height: "16",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "#2196F3",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }, createElement("path", {
          d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
        }), createElement("polyline", {
          points: "14 2 14 8 20 8"
        }), createElement("text", {
          x: "9",
          y: "19",
          fontSize: "8",
          fill: "#2196F3"
        }, "DOC"));
      case 'pdf':
        return createElement("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          width: "16",
          height: "16",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "#F44336",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }, createElement("path", {
          d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
        }), createElement("polyline", {
          points: "14 2 14 8 20 8"
        }), createElement("text", {
          x: "8",
          y: "19",
          fontSize: "8",
          fill: "#F44336"
        }, "PDF"));
      default:
        return createElement("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          width: "16",
          height: "16",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }, createElement("path", {
          d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
        }), createElement("polyline", {
          points: "14 2 14 8 20 8"
        }));
    }
  };
  return createElement("span", {
    className: "file-icon"
  }, getFileIcon());
};
function TreeContainer({
  dataChangedDate,
  serviceUrl,
  widgetName,
  widgetClassName,
  toggleExpandedIconOnly,
  allowNodeRename,
  allowDragReordering,
  allowDragMove,
  collapseAllButtonIcon,
  collapseAllButtonCaption,
  collapseAllButtonClass,
  showExpandAllButton,
  expandAllButtonIcon,
  expandAllButtonCaption,
  expandAllButtonClass,
  onSelectionChanged,
  onMissingNodes,
  onNodeRenamed,
  onDrop,
  logMessageToConsole,
  logToConsole,
  dumpServiceResponseInConsole
}) {
  const [treeData, dispatch] = useReducer(treeDataReducer, null);
  const [focusedItem, setFocusedItem] = useState();
  const [expandedItems, setExpandedItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  // 여기에 renderItemTitle 함수를 추가
  const renderItemTitle = item => {
    const fileExtension = item.data.name ? item.data.name.split('.').pop().toLowerCase() : '';
    return createElement("div", {
      className: "tree-item-content"
    }, item.isFolder ? createElement(FolderIcon, {
      isOpen: expandedItems.includes(item.index)
    }) : createElement(FileIcon, {
      fileType: fileExtension
    }), createElement("span", {
      className: "item-text"
    }, item.data.name));
  };
  console.log("treeData", treeData);
  console.dir("treeData", treeData);
  const onSelectionChangedHandler = useCallback(items => {
    const selectedIDs = items.join(",");
    if (logToConsole) {
      logMessageToConsole("onSelectionChangedHandler called for items " + selectedIDs);
    }

    // Set the new selection on the state
    setSelectedItems(items);

    // Call handler with item IDs joined into one string
    onSelectionChanged(selectedIDs);
  }, [logMessageToConsole, logToConsole, onSelectionChanged]);

  // 확장 아이템 아이콘 핸들러
  const onExpandItemHandler = useCallback(item => {
    if (logToConsole) {
      logMessageToConsole("onExpandItemHandler: called for item " + item.index);
    }
    // First set the state so the tree renders the expanded item
    setExpandedItems([...expandedItems, item.index]);

    // The library has a missing child item callback but it does not work very well.
    // Item indeed has children
    if (item.children && item.children.length) {
      const firstChildID = item.children[0];
      // Request child nodes if not already available
      if (!treeData.data[firstChildID]) {
        // Call handler with expanded item ID and its child IDs
        const requestedIDs = item.index + "," + item.children.join(",");
        if (logToConsole) {
          logMessageToConsole("onExpandItemHandler: request items " + requestedIDs);
        }
        onMissingNodes(requestedIDs);
      }
    }
  }, [expandedItems, logMessageToConsole, logToConsole, onMissingNodes, treeData?.data]);

  // 축소 진행
  const onCollapseAllButtonClick = useCallback(() => {
    setExpandedItems([]); // 축소 시키니깐 확장되는건 없으니 빈 배열의 값으로 설정정
  }, []);

  // 확장 진행
  const onExpandAllButtonClick = useCallback(() => {
    const expandableItemIDs = [];
    for (const itemID in treeData.data) {
      if (treeData.data[itemID].children) {
        expandableItemIDs.push(itemID);
      }
    }
    setExpandedItems(expandableItemIDs);
  }, [treeData?.data]);

  // tree속성내 node의 이름 설정
  const onRenameNodeHandler = useCallback((item, newName) => {
    onNodeRenamed(item.index, newName);
  }, [onNodeRenamed]);

  // 마우스 드랍이벤트
  const onDropHandler = useCallback((items, target) => {
    const draggedItemIDs = items.reduce((accumulator, item) => {
      if (accumulator) {
        return accumulator + "," + item.index;
      } else {
        return item.index;
      }
    }, null);
    if (logToConsole) {
      logMessageToConsole("onDropHandler: items " + draggedItemIDs + " dragged, drop info: " + JSON.stringify(target));
    }
    onDrop(draggedItemIDs, target);
  }, [logMessageToConsole, logToConsole, onDrop]);

  // 마우스 드래그 이벤트 (result : true || false)
  const canDragHandler = useCallback(items => {
    if (!items || items.length === 0) {
      return true;
    }
    if (items.length === 1) {
      return items[0].canMove;
    }
    const firstParentID = items[0].data.parentID;
    return items.every(item => item.data.parentID === firstParentID && item.canMove);
  }, []);
  const canDropAtHandler = useCallback((items, target) => {
    const targetNodeID = target.targetType === "between-items" ? target.parentItem : target.targetItem;
    const targetNode = treeData.data[targetNodeID];

    // Target does not specify accepted drag types so anything is allowed
    if (!targetNode.data.acceptDragTypes) {
      return true;
    }

    // Item can be dropped at the target if it has a drag type and the target accepts it.
    // Note that the includes function is case sensitive!
    // For performance, no case conversion is done, this is up to the developer that uses this widget.
    return items.every(item => !!item.data.dragType && targetNode.data.acceptDragTypes.includes(item.data.dragType));
  }, [treeData?.data]);
  useEffect(() => {
    console.log("이거 통과합니까?");
    const processDataFromService = data => {
      console.log("야 이거 데이터냐?data", data);
      console.dir("야 이거 데이터냐?data", data);
      //ResponseNodes를 nodes로 매핑 

      if (data.ResponseNodes) {
        data.nodes = Array.isArray(data.ResponseNodes) ? data.ResponseNodes : typeof data.ResponseNodes === 'object' ? Object.values(data.ResponseNodes) : [];
      }
      // 매핑 후 확인
      console.log("매핑 후 nodes:", data.nodes);
      console.log("nodes는 배열?", Array.isArray(data.nodes));
      const createTreeDataObject = () => {
        if (!data || !data.nodes || !Array.isArray(data.nodes)) {
          console.error("data.nodes가 배열이 아닙니다. ", data);
          return {};
        }
        const newTreeData = {};
        for (const node of data.nodes) {
          console.log("nodes", node);
          console.dir("node", node);
          const nodeData = {
            index: node.index,
            isFolder: !!node.children,
            canMove: node.canMove,
            canRename: node.canRename,
            data: {
              name: node.name,
              parentID: node.parentID
            }
          };
          // Convert children from comma separated value into array
          if (node.children) {
            nodeData.children = node.children.split(",");
          }
          // Only include the drag/drop settings if they are set. Keeps node data object as small as possible
          if (node.dragType) {
            nodeData.data.dragType = node.dragType;
          }
          if (node.acceptDragTypes) {
            nodeData.data.acceptDragTypes = node.acceptDragTypes;
          }
          newTreeData[node.index] = nodeData;
        }
        console.log("야 이거 새로운 트리냐?", newTreeData);
        return newTreeData;
      };
      const reloadTree = () => {
        const newTreeData = createTreeDataObject();
        console.log("야 나와라 newTreeData", newTreeData);
        dispatch({
          type: "reload",
          data: newTreeData
        });
      };
      const updateTree = () => {
        const newTreeData = createTreeDataObject();
        dispatch({
          type: "update",
          data: newTreeData,
          deletedNodeIDs: data.deletedNodeIDs
        });
      };
      if (logToConsole) {
        if (data.nodes) {
          logMessageToConsole("Received " + data.nodes.length + " nodes, action: " + data.action);
        } else {
          logMessageToConsole("Received no nodes, action: " + data.action);
        }
        if (dumpServiceResponseInConsole) {
          logMessageToConsole("Received service response:");
          console.info(JSON.stringify(data));
        }
      }
      switch (data.action) {
        case "reload":
          reloadTree();
          break;
        case "update":
          updateTree();
          break;
        case "focus":
          // No specific logic, focus is handled whenever the focusNodeID is returned. Focus action is added to allow setting focus only.
          break;
        case "none":
          break;
        default:
          console.warn(" React complex tree unknown action: " + data.action);
          break;
      }
      // Focus and select item if requested.
      if (data.focusNodeID) {
        if (logToConsole) {
          logMessageToConsole("Set focus to " + data.focusNodeID);
        }
        setFocusedItem(data.focusNodeID);
        setSelectedItems([data.focusNodeID]);
      }

      // Expand items if requested.
      if (data.expandItemIDs) {
        const expandItemIDArray = data.expandItemIDs.split(",");
        if (data.resetExpandedItems) {
          // Only expand the requested items
          if (logToConsole) {
            logMessageToConsole("Expand only items " + data.expandItemIDs);
          }
          setExpandedItems(expandItemIDArray);
        } else {
          // Expand the requested items in addition to any already expanded items
          if (logToConsole) {
            logMessageToConsole("Expand items " + data.expandItemIDs);
          }
          setExpandedItems([...expandedItems, ...expandItemIDArray]);
        }
      } else {
        if (data.resetExpandedItems) {
          // Clear expanded state, causing all nodes to be collapsed
          if (logToConsole) {
            logMessageToConsole("Reset expanded state, collapse all nodes");
          }
          setExpandedItems([]);
        }
      }
    };
    if (dataChangedDate) {
      if (logToConsole) {
        logMessageToConsole("Data changed date: " + dataChangedDate);
      }
    } else {
      if (logToConsole) {
        logMessageToConsole("Data changed date not set");
      }
      return;
    }

    // Even though the dependencies did not change, the effect got called way too often.
    // Double checked by logging the dependencies and comparing them as mentioned in the React useEffect documentation.
    // Keep track of dataChangedDate in the reducer and only call the service if the date really is different.
    if (dataChangedDate.getTime() === treeData?.dataChangedDate.getTime()) {
      if (logToConsole) {
        logMessageToConsole("Data changed date still the same");
      }
      return;
    }
    if (logToConsole) {
      logMessageToConsole("Data changed date changed");
    }
    dispatch({
      type: "setDataChangedDate",
      dataChangedDate: dataChangedDate
    });
    let serviceUrlLocal = serviceUrl;
    if (serviceUrlLocal) {
      if (!treeData?.data) {
        if (logToConsole) {
          logMessageToConsole("No tree data, request full reload");
        }
        if (serviceUrlLocal.includes("?")) {
          serviceUrlLocal += "&";
        } else {
          serviceUrlLocal += "?";
        }
        serviceUrlLocal += "fullreload=true";
      }
      if (logToConsole) {
        logMessageToConsole("Call service using URL: " + serviceUrlLocal);
      }
    } else {
      if (logToConsole) {
        logMessageToConsole("Service URL has no value");
      }
      return;
    }
    console.log("야 미친인간아 이렇게 살거야?", window.mx.session);
    const token = window.mx.session.getConfig("csrftoken");
    console.log("token", token);
    window.fetch(serviceUrlLocal, {
      credentials: "include",
      headers: {
        "X-Csrf-Token": token,
        Accept: "application/json"
      }
    }).then(response => {
      console.log("response 이거 확인한다 조심해라");
      if (response.ok) {
        response.json().then(data => {
          console.log("이거 통과합니까? response냐");
          processDataFromService(data);
          console.log("createTreeDataObject에 전달된 데이터:", JSON.stringify(data, null, 2));
          console.log("data", data);
        });
      } else {
        console.error("Call to URL " + serviceUrlLocal + " failed: " + response.statusText);
      }
    });
  }, [dataChangedDate, serviceUrl, logMessageToConsole, logToConsole, dumpServiceResponseInConsole, treeData, expandedItems]);
  const className = "react-complex-tree-widget " + widgetClassName;
  if (!treeData?.data) {
    console.log("트리데이터 통과여부 확인중입니다");
    if (logToConsole) {
      logMessageToConsole("No tree data");
    }
    console.log("className", className);
    console.log("!treeData?.data", !treeData?.data);
    return createElement("div", {
      className: className + " nodata"
    });
  }
  const treeName = "tree-" + widgetName;
  const interactionMode = toggleExpandedIconOnly ? "click-arrow-to-expand" : "click-item-to-expand";
  console.log("트리 데이터 CHILD 이름", treeName);
  console.log("트리 데이터 CHILD 값", treeData?.data);
  return createElement("div", {
    className: className
  }, createElement("div", {
    className: "tree-widget-button-container"
  }, createElement("button", {
    id: "buttonCollapseAll",
    className: collapseAllButtonClass,
    onClick: onCollapseAllButtonClick
  }, collapseAllButtonIcon && createElement(Icon, {
    icon: collapseAllButtonIcon
  }), createElement("span", null, collapseAllButtonCaption ? collapseAllButtonCaption : "")), showExpandAllButton && createElement("button", {
    id: "buttonExpandAll",
    className: expandAllButtonClass,
    onClick: onExpandAllButtonClick
  }, expandAllButtonIcon && createElement(Icon, {
    icon: expandAllButtonIcon
  }), createElement("span", null, expandAllButtonCaption ? expandAllButtonCaption : ""))), createElement(ControlledTreeEnvironment, {
    items: treeData.data,
    getItemTitle: renderItemTitle
    // {item => item.data.name}
    ,
    viewState: {
      [treeName]: {
        focusedItem,
        expandedItems,
        selectedItems
      }
    },
    defaultInteractionMode: interactionMode,
    canRename: allowNodeRename,
    canDragAndDrop: allowDragReordering || allowDragMove,
    canReorderItems: allowDragReordering,
    canDropOnFolder: allowDragMove,
    canDropOnNonFolder: allowDragMove,
    onFocusItem: item => setFocusedItem(item.index),
    onExpandItem: onExpandItemHandler,
    onCollapseItem: item => setExpandedItems(expandedItems.filter(expandedItemIndex => expandedItemIndex !== item.index)),
    onSelectItems: onSelectionChangedHandler,
    onRenameItem: onRenameNodeHandler,
    canDrag: canDragHandler,
    canDropAt: canDropAtHandler,
    onDrop: onDropHandler
  }, createElement(Tree, {
    treeId: treeName,
    rootItem: "root"
  })));
}

/* eslint-disable no-trailing-spaces */
/* eslint-disable prettier/prettier */
function ReactComplexTreeWidget(props) {
  const logMessageToConsole = useCallback(message => {
    console.info(props.name + " " + new Date().toISOString() + " " + message);
  }, [props.name]);
  const {
    onSelectionChangedAction,
    selectedNodeIDsAttr
  } = props;
  const onSelectionChangedHandler = useCallback(selectedItemIDs => {
    if (selectedNodeIDsAttr && selectedNodeIDsAttr.status === "available") {
      if (selectedNodeIDsAttr.readOnly) {
        console.warn("ReactComplexTreeWidget: Selected node IDs attribute is readonly");
      } else {
        selectedNodeIDsAttr.setValue(selectedItemIDs);
      }
    }
    if (onSelectionChangedAction && onSelectionChangedAction.canExecute && !onSelectionChangedAction.isExecuting) {
      onSelectionChangedAction.execute();
    }
  }, [onSelectionChangedAction, selectedNodeIDsAttr]);
  const {
    onMissingNodesAction,
    missingNodeIDsAttr
  } = props;
  const onMissingNodesHandler = useCallback(missingItemIDs => {
    if (missingNodeIDsAttr && missingNodeIDsAttr.status === "available") {
      if (missingNodeIDsAttr.readOnly) {
        console.warn("ReactComplexTreeWidget: Missing node IDs attribute is readonly");
      } else {
        missingNodeIDsAttr.setValue(missingItemIDs);
      }
    }
    if (onMissingNodesAction && onMissingNodesAction.canExecute && !onMissingNodesAction.isExecuting) {
      onMissingNodesAction.execute();
    }
  }, [missingNodeIDsAttr, onMissingNodesAction]);
  const {
    onNodeRenamedAction,
    renamedNodeIDAttr,
    newNodeNameAttr
  } = props;
  const onNodeRenamedHandler = useCallback((nodeID, newName) => {
    if (renamedNodeIDAttr && renamedNodeIDAttr.status === "available") {
      if (renamedNodeIDAttr.readOnly) {
        console.warn("ReactComplexTreeWidget: Event node ID attribute is readonly");
      } else {
        renamedNodeIDAttr.setValue(nodeID);
      }
    }
    if (newNodeNameAttr && newNodeNameAttr.status === "available") {
      if (newNodeNameAttr.readOnly) {
        console.warn("ReactComplexTreeWidget: Event node ID attribute is readonly");
      } else {
        newNodeNameAttr.setValue(newName);
      }
    }
    if (onNodeRenamedAction && onNodeRenamedAction.canExecute && !onNodeRenamedAction.isExecuting) {
      onNodeRenamedAction.execute();
    }
  }, [renamedNodeIDAttr, newNodeNameAttr, onNodeRenamedAction]);
  // 드래그 앤 드랍
  const {
    onDropAction,
    draggedNodeIDsAttr,
    dropTargetAttr
  } = props;
  const onDropHandler = useCallback((droppedNodeIDs, target) => {
    if (draggedNodeIDsAttr && draggedNodeIDsAttr.status === "available") {
      if (draggedNodeIDsAttr.readOnly) {
        console.warn("ReactComplexTreeWidget: Dragged node IDs attribute is readonly");
      } else {
        draggedNodeIDsAttr.setValue(droppedNodeIDs);
      }
    }
    if (dropTargetAttr && dropTargetAttr.status === "available") {
      if (dropTargetAttr.readOnly) {
        console.warn("ReactComplexTreeWidget: Drop target ID attribute is readonly");
      } else {
        dropTargetAttr.setValue(JSON.stringify(target));
      }
    }
    if (onDropAction && onDropAction.canExecute && !onDropAction.isExecuting) {
      onDropAction.execute();
    }
  }, [draggedNodeIDsAttr, dropTargetAttr, onDropAction]);
  console.log("이건 테스트 입니다. 우두머리", props);
  console.log("이건 테스트 입니다. 이름", props.name);
  console.log("이건 테스트 입니다. 변경되는 데이터", props.dataChangeDateAttr);
  console.log("이건 테스트 입니다. 드래그 움직임", props.allowDragMove);
  console.log("이건 테스트 입니다. 아이콘 토글 클릭릭", props.toggleExpandedIconOnly);
  return createElement(TreeContainer, {
    dataChangedDate: props.dataChangeDateAttr.value,
    serviceUrl: props.serviceUrl.value,
    widgetName: props.name,
    widgetClassName: props.class,
    toggleExpandedIconOnly: props.toggleExpandedIconOnly,
    allowNodeRename: props.allowNodeRename,
    allowDragReordering: props.allowDragReordering,
    allowDragMove: props.allowDragMove,
    collapseAllButtonIcon: props.collapseAllButtonIcon?.value,
    collapseAllButtonCaption: props.collapseAllButtonCaption?.value,
    collapseAllButtonClass: props.collapseAllButtonClass,
    showExpandAllButton: !!props.showExpandAllButton?.value,
    expandAllButtonIcon: props.expandAllButtonIcon?.value,
    expandAllButtonCaption: props.expandAllButtonCaption?.value,
    expandAllButtonClass: props.expandAllButtonClass,
    onSelectionChanged: onSelectionChangedHandler,
    onMissingNodes: onMissingNodesHandler,
    onNodeRenamed: onNodeRenamedHandler,
    onDrop: onDropHandler,
    logMessageToConsole: logMessageToConsole,
    logToConsole: props.logToConsole,
    dumpServiceResponseInConsole: props.dumpServiceResponseInConsole
  });
}

export { ReactComplexTreeWidget };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVhY3RDb21wbGV4VHJlZVdpZGdldC5tanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1jb21wbGV4LXRyZWUvbGliL2VzbS90eXBlcy5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1jb21wbGV4LXRyZWUvbGliL2VzbS9jb250cm9sbGVkRW52aXJvbm1lbnQvbWVyZ2VJbnRlcmFjdGlvbk1hbmFnZXJzLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWNvbXBsZXgtdHJlZS9saWIvZXNtL2lzQ29udHJvbEtleS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1jb21wbGV4LXRyZWUvbGliL2VzbS9pbnRlcmFjdGlvbk1vZGUvRG91YmxlQ2xpY2tJdGVtVG9FeHBhbmRJbnRlcmFjdGlvbk1hbmFnZXIuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtY29tcGxleC10cmVlL2xpYi9lc20vaW50ZXJhY3Rpb25Nb2RlL0NsaWNrSXRlbVRvRXhwYW5kSW50ZXJhY3Rpb25NYW5hZ2VyLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWNvbXBsZXgtdHJlZS9saWIvZXNtL2ludGVyYWN0aW9uTW9kZS9DbGlja0Fycm93VG9FeHBhbmRJbnRlcmFjdGlvbk1hbmFnZXIuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtY29tcGxleC10cmVlL2xpYi9lc20vY29udHJvbGxlZEVudmlyb25tZW50L2J1aWxkSW50ZXJhY3Rpb25Nb2RlLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWNvbXBsZXgtdHJlZS9saWIvZXNtL2NvbnRyb2xsZWRFbnZpcm9ubWVudC9JbnRlcmFjdGlvbk1hbmFnZXJQcm92aWRlci5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1jb21wbGV4LXRyZWUvbGliL2VzbS9kcmFnL3VzZUNhbkRyb3BBdC5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1jb21wbGV4LXRyZWUvbGliL2VzbS9kcmFnL3VzZUdldFBhcmVudE9mTGluZWFySXRlbS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1jb21wbGV4LXRyZWUvbGliL2VzbS9kcmFnL3VzZUdldFZpYWJsZURyYWdQb3NpdGlvbnMuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtY29tcGxleC10cmVlL2xpYi9lc20vdXNlU2lkZUVmZmVjdC5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1jb21wbGV4LXRyZWUvbGliL2VzbS91dGlscy5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1jb21wbGV4LXRyZWUvbGliL2VzbS91c2VDYWxsU29vbi5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1jb21wbGV4LXRyZWUvbGliL2VzbS91c2VSZWZDb3B5LmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWNvbXBsZXgtdHJlZS9saWIvZXNtL3VzZVN0YWJsZUhhbmRsZXIuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtY29tcGxleC10cmVlL2xpYi9lc20vdXNlR2V0T3JpZ2luYWxJdGVtT3JkZXIuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtY29tcGxleC10cmVlL2xpYi9lc20vY29udHJvbGxlZEVudmlyb25tZW50L2xheW91dFV0aWxzLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWNvbXBsZXgtdHJlZS9saWIvZXNtL2RyYWcvRHJhZ2dpbmdQb3NpdGlvbkV2YWx1YXRpb24uanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtY29tcGxleC10cmVlL2xpYi9lc20vZHJhZy91c2VEcmFnZ2luZ1Bvc2l0aW9uLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWNvbXBsZXgtdHJlZS9saWIvZXNtL2RyYWcvRHJhZ0FuZERyb3BQcm92aWRlci5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1jb21wbGV4LXRyZWUvbGliL2VzbS9lbnZpcm9ubWVudEFjdGlvbnMvdXNlQ3JlYXRlZEVudmlyb25tZW50UmVmLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWNvbXBsZXgtdHJlZS9saWIvZXNtL3dhaXRGb3IuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtY29tcGxleC10cmVlL2xpYi9lc20vZW52aXJvbm1lbnRBY3Rpb25zL0Vudmlyb25tZW50QWN0aW9uc1Byb3ZpZGVyLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWNvbXBsZXgtdHJlZS9saWIvZXNtL3RyZWUvc2Nyb2xsSW50b1ZpZXcuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtY29tcGxleC10cmVlL2xpYi9lc20vcmVuZGVyZXJzL2NyZWF0ZURlZmF1bHRSZW5kZXJlcnMuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtY29tcGxleC10cmVlL2xpYi9lc20vcmVuZGVyZXJzL3VzZVJlbmRlcmVycy5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1jb21wbGV4LXRyZWUvbGliL2VzbS90cmVlL2dldEl0ZW1zTGluZWFybHkuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtY29tcGxleC10cmVlL2xpYi9lc20vY29udHJvbGxlZEVudmlyb25tZW50L3VzZUNvbnRyb2xsZWRUcmVlRW52aXJvbm1lbnRQcm9wcy5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1jb21wbGV4LXRyZWUvbGliL2VzbS9jb250cm9sbGVkRW52aXJvbm1lbnQvQ29udHJvbGxlZFRyZWVFbnZpcm9ubWVudC5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1jb21wbGV4LXRyZWUvbGliL2VzbS90cmVlL0RyYWdCZXR3ZWVuTGluZS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1jb21wbGV4LXRyZWUvbGliL2VzbS91c2VIdG1sRWxlbWVudEV2ZW50TGlzdGVuZXIuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtY29tcGxleC10cmVlL2xpYi9lc20vdHJlZS91c2VGb2N1c1dpdGhpbi5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1jb21wbGV4LXRyZWUvbGliL2VzbS9ob3RrZXlzL3VzZUtleS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1jb21wbGV4LXRyZWUvbGliL2VzbS9ob3RrZXlzL2RlZmF1bHRLZXlib2FyZEJpbmRpbmdzLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWNvbXBsZXgtdHJlZS9saWIvZXNtL2hvdGtleXMvdXNlS2V5Ym9hcmRCaW5kaW5ncy5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1jb21wbGV4LXRyZWUvbGliL2VzbS9ob3RrZXlzL3VzZUhvdGtleS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1jb21wbGV4LXRyZWUvbGliL2VzbS90cmVlL3VzZVZpZXdTdGF0ZS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1jb21wbGV4LXRyZWUvbGliL2VzbS9jb250cm9sbGVkRW52aXJvbm1lbnQvdXNlTGluZWFySXRlbXMuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtY29tcGxleC10cmVlL2xpYi9lc20vdHJlZS91c2VNb3ZlRm9jdXNUb0luZGV4LmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWNvbXBsZXgtdHJlZS9saWIvZXNtL3RyZWUvdXNlU2VsZWN0VXBUby5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1jb21wbGV4LXRyZWUvbGliL2VzbS90cmVlL3VzZVRyZWVLZXlib2FyZEJpbmRpbmdzLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWNvbXBsZXgtdHJlZS9saWIvZXNtL3NlYXJjaC9kZWZhdWx0TWF0Y2hlci5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1jb21wbGV4LXRyZWUvbGliL2VzbS9zZWFyY2gvdXNlU2VhcmNoTWF0Y2hGb2N1cy5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1jb21wbGV4LXRyZWUvbGliL2VzbS9zZWFyY2gvU2VhcmNoSW5wdXQuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtY29tcGxleC10cmVlL2xpYi9lc20vdHJlZS9kZWZhdWx0TGl2ZURlc2NyaXB0b3JzLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWNvbXBsZXgtdHJlZS9saWIvZXNtL3RyZWUvcmVzb2x2ZUxpdmVEZXNjcmlwdG9yLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWNvbXBsZXgtdHJlZS9saWIvZXNtL3RyZWUvTGl2ZURlc2NyaXB0aW9uLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWNvbXBsZXgtdHJlZS9saWIvZXNtL3RyZWUvTWF5YmVMaXZlRGVzY3JpcHRpb24uanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtY29tcGxleC10cmVlL2xpYi9lc20vdHJlZS9UcmVlTWFuYWdlci5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1jb21wbGV4LXRyZWUvbGliL2VzbS90cmVlL3VzZUNyZWF0ZWRUcmVlSW5mb3JtYXRpb24uanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtY29tcGxleC10cmVlL2xpYi9lc20vdHJlZUFjdGlvbnMvdXNlQ3JlYXRlZFRyZWVSZWYuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtY29tcGxleC10cmVlL2xpYi9lc20vdHJlZUFjdGlvbnMvVHJlZUFjdGlvbnNQcm92aWRlci5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1jb21wbGV4LXRyZWUvbGliL2VzbS90cmVlL1RyZWUuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtY29tcGxleC10cmVlL2xpYi9lc20vdHJlZUl0ZW0vVHJlZUl0ZW1DaGlsZHJlbi5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1jb21wbGV4LXRyZWUvbGliL2VzbS90cmVlSXRlbS91c2VUcmVlSXRlbVJlbmRlckNvbnRleHQuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtY29tcGxleC10cmVlL2xpYi9lc20vdHJlZUl0ZW0vVHJlZUl0ZW1SZW5hbWluZ0lucHV0LmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWNvbXBsZXgtdHJlZS9saWIvZXNtL3RyZWVJdGVtL1RyZWVJdGVtRWxlbWVudC5qcyIsIi4uLy4uLy4uLy4uLy4uL3NyYy91dGlscy90cmVlRGF0YVJlZHVjZXIuanMiLCIuLi8uLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50cy9UcmVlQ29udGFpbmVyLmpzeCIsIi4uLy4uLy4uLy4uLy4uL3NyYy9SZWFjdENvbXBsZXhUcmVlV2lkZ2V0LmpzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgdmFyIEludGVyYWN0aW9uTW9kZTtcbihmdW5jdGlvbiAoSW50ZXJhY3Rpb25Nb2RlKSB7XG4gICAgSW50ZXJhY3Rpb25Nb2RlW1wiRG91YmxlQ2xpY2tJdGVtVG9FeHBhbmRcIl0gPSBcImRvdWJsZS1jbGljay1pdGVtLXRvLWV4cGFuZFwiO1xuICAgIEludGVyYWN0aW9uTW9kZVtcIkNsaWNrSXRlbVRvRXhwYW5kXCJdID0gXCJjbGljay1pdGVtLXRvLWV4cGFuZFwiO1xuICAgIEludGVyYWN0aW9uTW9kZVtcIkNsaWNrQXJyb3dUb0V4cGFuZFwiXSA9IFwiY2xpY2stYXJyb3ctdG8tZXhwYW5kXCI7XG59KShJbnRlcmFjdGlvbk1vZGUgfHwgKEludGVyYWN0aW9uTW9kZSA9IHt9KSk7XG4iLCJ2YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxuICAgICAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0O1xuICAgIH07XG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuZXhwb3J0IHZhciBtZXJnZUludGVyYWN0aW9uTWFuYWdlcnMgPSBmdW5jdGlvbiAobWFpbiwgZmFsbGJhY2spIHsgcmV0dXJuICh7XG4gICAgbW9kZTogbWFpbi5tb2RlLFxuICAgIGNyZWF0ZUludGVyYWN0aXZlRWxlbWVudFByb3BzOiBmdW5jdGlvbiAoaXRlbSwgdHJlZUlkLCBhY3Rpb25zLCByZW5kZXJGbGFncykgeyByZXR1cm4gKF9fYXNzaWduKF9fYXNzaWduKHt9LCBmYWxsYmFjay5jcmVhdGVJbnRlcmFjdGl2ZUVsZW1lbnRQcm9wcyhpdGVtLCB0cmVlSWQsIGFjdGlvbnMsIHJlbmRlckZsYWdzKSksIG1haW4uY3JlYXRlSW50ZXJhY3RpdmVFbGVtZW50UHJvcHMoaXRlbSwgdHJlZUlkLCBhY3Rpb25zLCByZW5kZXJGbGFncykpKTsgfSxcbn0pOyB9O1xuIiwiZXhwb3J0IHZhciBpc0NvbnRyb2xLZXkgPSBmdW5jdGlvbiAoZSkge1xuICAgIHJldHVybiBlLmN0cmxLZXkgfHxcbiAgICAgICAgKG5hdmlnYXRvci5wbGF0Zm9ybS50b1VwcGVyQ2FzZSgpLmluZGV4T2YoJ01BQycpID49IDAgJiYgZS5tZXRhS2V5KTtcbn07XG4iLCJpbXBvcnQgeyBJbnRlcmFjdGlvbk1vZGUsIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgaXNDb250cm9sS2V5IH0gZnJvbSAnLi4vaXNDb250cm9sS2V5JztcbnZhciBEb3VibGVDbGlja0l0ZW1Ub0V4cGFuZEludGVyYWN0aW9uTWFuYWdlciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBEb3VibGVDbGlja0l0ZW1Ub0V4cGFuZEludGVyYWN0aW9uTWFuYWdlcihlbnZpcm9ubWVudCkge1xuICAgICAgICB0aGlzLm1vZGUgPSBJbnRlcmFjdGlvbk1vZGUuRG91YmxlQ2xpY2tJdGVtVG9FeHBhbmQ7XG4gICAgICAgIHRoaXMuZW52aXJvbm1lbnQgPSBlbnZpcm9ubWVudDtcbiAgICB9XG4gICAgRG91YmxlQ2xpY2tJdGVtVG9FeHBhbmRJbnRlcmFjdGlvbk1hbmFnZXIucHJvdG90eXBlLmNyZWF0ZUludGVyYWN0aXZlRWxlbWVudFByb3BzID0gZnVuY3Rpb24gKGl0ZW0sIHRyZWVJZCwgYWN0aW9ucywgcmVuZGVyRmxhZ3MpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9uQ2xpY2s6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgYWN0aW9ucy5mb2N1c0l0ZW0oKTtcbiAgICAgICAgICAgICAgICBpZiAoZS5zaGlmdEtleSkge1xuICAgICAgICAgICAgICAgICAgICBhY3Rpb25zLnNlbGVjdFVwVG8oIWlzQ29udHJvbEtleShlKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGlzQ29udHJvbEtleShlKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVuZGVyRmxhZ3MuaXNTZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9ucy51bnNlbGVjdEl0ZW0oKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbnMuYWRkVG9TZWxlY3RlZEl0ZW1zKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbnMuc2VsZWN0SXRlbSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvbkRvdWJsZUNsaWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgYWN0aW9ucy5mb2N1c0l0ZW0oKTtcbiAgICAgICAgICAgICAgICBhY3Rpb25zLnNlbGVjdEl0ZW0oKTtcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5pc0ZvbGRlcikge1xuICAgICAgICAgICAgICAgICAgICBhY3Rpb25zLnRvZ2dsZUV4cGFuZGVkU3RhdGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFpdGVtLmlzRm9sZGVyIHx8XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmVudmlyb25tZW50LmNhbkludm9rZVByaW1hcnlBY3Rpb25Pbkl0ZW1Db250YWluZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9ucy5wcmltYXJ5QWN0aW9uKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uRm9jdXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBhY3Rpb25zLmZvY3VzSXRlbSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uRHJhZ1N0YXJ0OiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGUuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSAnbW92ZSc7XG4gICAgICAgICAgICAgICAgYWN0aW9ucy5zdGFydERyYWdnaW5nKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25EcmFnT3ZlcjogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7IC8vIEFsbG93IGRyb3BcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkcmFnZ2FibGU6IHJlbmRlckZsYWdzLmNhbkRyYWcgJiYgIXJlbmRlckZsYWdzLmlzUmVuYW1pbmcsXG4gICAgICAgICAgICB0YWJJbmRleDogIXJlbmRlckZsYWdzLmlzUmVuYW1pbmdcbiAgICAgICAgICAgICAgICA/IHJlbmRlckZsYWdzLmlzRm9jdXNlZFxuICAgICAgICAgICAgICAgICAgICA/IDBcbiAgICAgICAgICAgICAgICAgICAgOiAtMVxuICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgICB9O1xuICAgIH07XG4gICAgcmV0dXJuIERvdWJsZUNsaWNrSXRlbVRvRXhwYW5kSW50ZXJhY3Rpb25NYW5hZ2VyO1xufSgpKTtcbmV4cG9ydCB7IERvdWJsZUNsaWNrSXRlbVRvRXhwYW5kSW50ZXJhY3Rpb25NYW5hZ2VyIH07XG4iLCJpbXBvcnQgeyBJbnRlcmFjdGlvbk1vZGUsIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgaXNDb250cm9sS2V5IH0gZnJvbSAnLi4vaXNDb250cm9sS2V5JztcbnZhciBDbGlja0l0ZW1Ub0V4cGFuZEludGVyYWN0aW9uTWFuYWdlciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDbGlja0l0ZW1Ub0V4cGFuZEludGVyYWN0aW9uTWFuYWdlcihlbnZpcm9ubWVudCkge1xuICAgICAgICB0aGlzLm1vZGUgPSBJbnRlcmFjdGlvbk1vZGUuQ2xpY2tJdGVtVG9FeHBhbmQ7XG4gICAgICAgIHRoaXMuZW52aXJvbm1lbnQgPSBlbnZpcm9ubWVudDtcbiAgICB9XG4gICAgQ2xpY2tJdGVtVG9FeHBhbmRJbnRlcmFjdGlvbk1hbmFnZXIucHJvdG90eXBlLmNyZWF0ZUludGVyYWN0aXZlRWxlbWVudFByb3BzID0gZnVuY3Rpb24gKGl0ZW0sIHRyZWVJZCwgYWN0aW9ucywgcmVuZGVyRmxhZ3MpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9uQ2xpY2s6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgYWN0aW9ucy5mb2N1c0l0ZW0oKTtcbiAgICAgICAgICAgICAgICBpZiAoZS5zaGlmdEtleSkge1xuICAgICAgICAgICAgICAgICAgICBhY3Rpb25zLnNlbGVjdFVwVG8oIWlzQ29udHJvbEtleShlKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGlzQ29udHJvbEtleShlKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVuZGVyRmxhZ3MuaXNTZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9ucy51bnNlbGVjdEl0ZW0oKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbnMuYWRkVG9TZWxlY3RlZEl0ZW1zKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLmlzRm9sZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb25zLnRvZ2dsZUV4cGFuZGVkU3RhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBhY3Rpb25zLnNlbGVjdEl0ZW0oKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpdGVtLmlzRm9sZGVyIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5lbnZpcm9ubWVudC5jYW5JbnZva2VQcmltYXJ5QWN0aW9uT25JdGVtQ29udGFpbmVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb25zLnByaW1hcnlBY3Rpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvbkZvY3VzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgYWN0aW9ucy5mb2N1c0l0ZW0oKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvbkRyYWdTdGFydDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBlLmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gJ21vdmUnO1xuICAgICAgICAgICAgICAgIGFjdGlvbnMuc3RhcnREcmFnZ2luZygpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uRHJhZ092ZXI6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpOyAvLyBBbGxvdyBkcm9wXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZHJhZ2dhYmxlOiByZW5kZXJGbGFncy5jYW5EcmFnICYmICFyZW5kZXJGbGFncy5pc1JlbmFtaW5nLFxuICAgICAgICAgICAgdGFiSW5kZXg6ICFyZW5kZXJGbGFncy5pc1JlbmFtaW5nXG4gICAgICAgICAgICAgICAgPyByZW5kZXJGbGFncy5pc0ZvY3VzZWRcbiAgICAgICAgICAgICAgICAgICAgPyAwXG4gICAgICAgICAgICAgICAgICAgIDogLTFcbiAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIHJldHVybiBDbGlja0l0ZW1Ub0V4cGFuZEludGVyYWN0aW9uTWFuYWdlcjtcbn0oKSk7XG5leHBvcnQgeyBDbGlja0l0ZW1Ub0V4cGFuZEludGVyYWN0aW9uTWFuYWdlciB9O1xuIiwiaW1wb3J0IHsgSW50ZXJhY3Rpb25Nb2RlLCB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGlzQ29udHJvbEtleSB9IGZyb20gJy4uL2lzQ29udHJvbEtleSc7XG52YXIgQ2xpY2tBcnJvd1RvRXhwYW5kSW50ZXJhY3Rpb25NYW5hZ2VyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENsaWNrQXJyb3dUb0V4cGFuZEludGVyYWN0aW9uTWFuYWdlcihlbnZpcm9ubWVudCkge1xuICAgICAgICB0aGlzLm1vZGUgPSBJbnRlcmFjdGlvbk1vZGUuQ2xpY2tJdGVtVG9FeHBhbmQ7XG4gICAgICAgIHRoaXMuZW52aXJvbm1lbnQgPSBlbnZpcm9ubWVudDtcbiAgICB9XG4gICAgQ2xpY2tBcnJvd1RvRXhwYW5kSW50ZXJhY3Rpb25NYW5hZ2VyLnByb3RvdHlwZS5jcmVhdGVJbnRlcmFjdGl2ZUVsZW1lbnRQcm9wcyA9IGZ1bmN0aW9uIChpdGVtLCB0cmVlSWQsIGFjdGlvbnMsIHJlbmRlckZsYWdzKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBvbkNsaWNrOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGFjdGlvbnMuZm9jdXNJdGVtKCk7XG4gICAgICAgICAgICAgICAgaWYgKGUuc2hpZnRLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9ucy5zZWxlY3RVcFRvKCFpc0NvbnRyb2xLZXkoZSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChpc0NvbnRyb2xLZXkoZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlbmRlckZsYWdzLmlzU2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbnMudW5zZWxlY3RJdGVtKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb25zLmFkZFRvU2VsZWN0ZWRJdGVtcygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhY3Rpb25zLnNlbGVjdEl0ZW0oKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpdGVtLmlzRm9sZGVyIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5lbnZpcm9ubWVudC5jYW5JbnZva2VQcmltYXJ5QWN0aW9uT25JdGVtQ29udGFpbmVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb25zLnByaW1hcnlBY3Rpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvbkZvY3VzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgYWN0aW9ucy5mb2N1c0l0ZW0oKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvbkRyYWdTdGFydDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBlLmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gJ21vdmUnO1xuICAgICAgICAgICAgICAgIGFjdGlvbnMuc3RhcnREcmFnZ2luZygpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uRHJhZ092ZXI6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpOyAvLyBBbGxvdyBkcm9wXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZHJhZ2dhYmxlOiByZW5kZXJGbGFncy5jYW5EcmFnICYmICFyZW5kZXJGbGFncy5pc1JlbmFtaW5nLFxuICAgICAgICAgICAgdGFiSW5kZXg6ICFyZW5kZXJGbGFncy5pc1JlbmFtaW5nXG4gICAgICAgICAgICAgICAgPyByZW5kZXJGbGFncy5pc0ZvY3VzZWRcbiAgICAgICAgICAgICAgICAgICAgPyAwXG4gICAgICAgICAgICAgICAgICAgIDogLTFcbiAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIHJldHVybiBDbGlja0Fycm93VG9FeHBhbmRJbnRlcmFjdGlvbk1hbmFnZXI7XG59KCkpO1xuZXhwb3J0IHsgQ2xpY2tBcnJvd1RvRXhwYW5kSW50ZXJhY3Rpb25NYW5hZ2VyIH07XG4iLCJpbXBvcnQgeyBJbnRlcmFjdGlvbk1vZGUgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBEb3VibGVDbGlja0l0ZW1Ub0V4cGFuZEludGVyYWN0aW9uTWFuYWdlciB9IGZyb20gJy4uL2ludGVyYWN0aW9uTW9kZS9Eb3VibGVDbGlja0l0ZW1Ub0V4cGFuZEludGVyYWN0aW9uTWFuYWdlcic7XG5pbXBvcnQgeyBDbGlja0l0ZW1Ub0V4cGFuZEludGVyYWN0aW9uTWFuYWdlciB9IGZyb20gJy4uL2ludGVyYWN0aW9uTW9kZS9DbGlja0l0ZW1Ub0V4cGFuZEludGVyYWN0aW9uTWFuYWdlcic7XG5pbXBvcnQgeyBDbGlja0Fycm93VG9FeHBhbmRJbnRlcmFjdGlvbk1hbmFnZXIgfSBmcm9tICcuLi9pbnRlcmFjdGlvbk1vZGUvQ2xpY2tBcnJvd1RvRXhwYW5kSW50ZXJhY3Rpb25NYW5hZ2VyJztcbmV4cG9ydCB2YXIgYnVpbGRJbnRlcmFjdGlvbk1vZGUgPSBmdW5jdGlvbiAobW9kZSwgZW52aXJvbm1lbnQpIHtcbiAgICBzd2l0Y2ggKG1vZGUpIHtcbiAgICAgICAgY2FzZSBJbnRlcmFjdGlvbk1vZGUuRG91YmxlQ2xpY2tJdGVtVG9FeHBhbmQ6XG4gICAgICAgICAgICByZXR1cm4gbmV3IERvdWJsZUNsaWNrSXRlbVRvRXhwYW5kSW50ZXJhY3Rpb25NYW5hZ2VyKGVudmlyb25tZW50KTtcbiAgICAgICAgY2FzZSBJbnRlcmFjdGlvbk1vZGUuQ2xpY2tJdGVtVG9FeHBhbmQ6XG4gICAgICAgICAgICByZXR1cm4gbmV3IENsaWNrSXRlbVRvRXhwYW5kSW50ZXJhY3Rpb25NYW5hZ2VyKGVudmlyb25tZW50KTtcbiAgICAgICAgY2FzZSBJbnRlcmFjdGlvbk1vZGUuQ2xpY2tBcnJvd1RvRXhwYW5kOlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBDbGlja0Fycm93VG9FeHBhbmRJbnRlcmFjdGlvbk1hbmFnZXIoZW52aXJvbm1lbnQpO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJVbmtub3duIGludGVyYWN0aW9uIG1vZGUgXCIuY29uY2F0KG1vZGUpKTtcbiAgICB9XG59O1xuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEludGVyYWN0aW9uTW9kZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IHVzZVRyZWVFbnZpcm9ubWVudCB9IGZyb20gJy4vQ29udHJvbGxlZFRyZWVFbnZpcm9ubWVudCc7XG5pbXBvcnQgeyBtZXJnZUludGVyYWN0aW9uTWFuYWdlcnMgfSBmcm9tICcuL21lcmdlSW50ZXJhY3Rpb25NYW5hZ2Vycyc7XG5pbXBvcnQgeyBidWlsZEludGVyYWN0aW9uTW9kZSB9IGZyb20gJy4vYnVpbGRJbnRlcmFjdGlvbk1vZGUnO1xudmFyIEludGVyYWN0aW9uTWFuYWdlckNvbnRleHQgPSBSZWFjdC5jcmVhdGVDb250ZXh0KG51bGwpO1xuZXhwb3J0IHZhciB1c2VJbnRlcmFjdGlvbk1hbmFnZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFJlYWN0LnVzZUNvbnRleHQoSW50ZXJhY3Rpb25NYW5hZ2VyQ29udGV4dCk7XG59O1xuZXhwb3J0IHZhciBJbnRlcmFjdGlvbk1hbmFnZXJQcm92aWRlciA9IGZ1bmN0aW9uIChfYSkge1xuICAgIHZhciBjaGlsZHJlbiA9IF9hLmNoaWxkcmVuO1xuICAgIHZhciBlbnZpcm9ubWVudCA9IHVzZVRyZWVFbnZpcm9ubWVudCgpO1xuICAgIHZhciBkZWZhdWx0SW50ZXJhY3Rpb25Nb2RlID0gZW52aXJvbm1lbnQuZGVmYXVsdEludGVyYWN0aW9uTW9kZTtcbiAgICB2YXIgaW50ZXJhY3Rpb25NYW5hZ2VyID0gdXNlTWVtbyhmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgaWYgKGRlZmF1bHRJbnRlcmFjdGlvbk1vZGUgJiYgdHlwZW9mIGRlZmF1bHRJbnRlcmFjdGlvbk1vZGUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBpZiAoZGVmYXVsdEludGVyYWN0aW9uTW9kZS5leHRlbmRzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1lcmdlSW50ZXJhY3Rpb25NYW5hZ2VycyhkZWZhdWx0SW50ZXJhY3Rpb25Nb2RlLCBidWlsZEludGVyYWN0aW9uTW9kZShkZWZhdWx0SW50ZXJhY3Rpb25Nb2RlLmV4dGVuZHMsIGVudmlyb25tZW50KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZGVmYXVsdEludGVyYWN0aW9uTW9kZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYnVpbGRJbnRlcmFjdGlvbk1vZGUoKF9hID0gZGVmYXVsdEludGVyYWN0aW9uTW9kZSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogSW50ZXJhY3Rpb25Nb2RlLkNsaWNrSXRlbVRvRXhwYW5kLCBlbnZpcm9ubWVudCk7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC1ob29rcy9leGhhdXN0aXZlLWRlcHNcbiAgICB9LCBbXSk7IC8vIFRPRE8gbWFrZSBzdXJlIHRoYXQgZW52aXJvbm1lbnQgZG9lcyBub3QgbmVlZCB0byBiZSByZWZyZXNoZWRcbiAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoSW50ZXJhY3Rpb25NYW5hZ2VyQ29udGV4dC5Qcm92aWRlciwgeyB2YWx1ZTogaW50ZXJhY3Rpb25NYW5hZ2VyIH0sIGNoaWxkcmVuKSk7XG59O1xuIiwiaW1wb3J0IHsgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VUcmVlRW52aXJvbm1lbnQgfSBmcm9tICcuLi9jb250cm9sbGVkRW52aXJvbm1lbnQvQ29udHJvbGxlZFRyZWVFbnZpcm9ubWVudCc7XG5leHBvcnQgdmFyIHVzZUNhbkRyb3BBdCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZW52aXJvbm1lbnQgPSB1c2VUcmVlRW52aXJvbm1lbnQoKTtcbiAgICByZXR1cm4gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKGRyYWdnaW5nUG9zaXRpb24sIGRyYWdnaW5nSXRlbXMpIHtcbiAgICAgICAgaWYgKGRyYWdnaW5nUG9zaXRpb24udGFyZ2V0VHlwZSA9PT0gJ2JldHdlZW4taXRlbXMnKSB7XG4gICAgICAgICAgICBpZiAoIWVudmlyb25tZW50LmNhblJlb3JkZXJJdGVtcykge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkcmFnZ2luZ1Bvc2l0aW9uLnRhcmdldFR5cGUgPT09ICdyb290Jykge1xuICAgICAgICAgICAgaWYgKCFlbnZpcm9ubWVudC5jYW5Ecm9wT25Gb2xkZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgcmVzb2x2ZWRJdGVtID0gZW52aXJvbm1lbnQuaXRlbXNbZHJhZ2dpbmdQb3NpdGlvbi50YXJnZXRJdGVtXTtcbiAgICAgICAgICAgIGlmICghcmVzb2x2ZWRJdGVtIHx8XG4gICAgICAgICAgICAgICAgKCFlbnZpcm9ubWVudC5jYW5Ecm9wT25Gb2xkZXIgJiYgcmVzb2x2ZWRJdGVtLmlzRm9sZGVyKSB8fFxuICAgICAgICAgICAgICAgICghZW52aXJvbm1lbnQuY2FuRHJvcE9uTm9uRm9sZGVyICYmICFyZXNvbHZlZEl0ZW0uaXNGb2xkZXIpIHx8XG4gICAgICAgICAgICAgICAgZHJhZ2dpbmdJdGVtcy5zb21lKGZ1bmN0aW9uIChkcmFnZ2luZ0l0ZW0pIHsgcmV0dXJuIGRyYWdnaW5nSXRlbS5pbmRleCA9PT0gZHJhZ2dpbmdQb3NpdGlvbi50YXJnZXRJdGVtOyB9KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZW52aXJvbm1lbnQuY2FuRHJvcEF0ICYmXG4gICAgICAgICAgICAoIWRyYWdnaW5nSXRlbXMgfHxcbiAgICAgICAgICAgICAgICAhZW52aXJvbm1lbnQuY2FuRHJvcEF0KGRyYWdnaW5nSXRlbXMsIGRyYWdnaW5nUG9zaXRpb24pKSkge1xuICAgICAgICAgICAgLy8gc2V0RHJhZ2dpbmdQb3NpdGlvbih1bmRlZmluZWQpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sIFtlbnZpcm9ubWVudF0pO1xufTtcbiIsImltcG9ydCB7IHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlVHJlZUVudmlyb25tZW50IH0gZnJvbSAnLi4vY29udHJvbGxlZEVudmlyb25tZW50L0NvbnRyb2xsZWRUcmVlRW52aXJvbm1lbnQnO1xuZXhwb3J0IHZhciB1c2VHZXRHZXRQYXJlbnRPZkxpbmVhckl0ZW0gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGVudmlyb25tZW50ID0gdXNlVHJlZUVudmlyb25tZW50KCk7XG4gICAgcmV0dXJuIHVzZUNhbGxiYWNrKGZ1bmN0aW9uIChpdGVtTGluZWFySW5kZXgsIHRyZWVJZCkge1xuICAgICAgICB2YXIgbGluZWFySXRlbXMgPSBlbnZpcm9ubWVudC5saW5lYXJJdGVtc1t0cmVlSWRdO1xuICAgICAgICB2YXIgZGVwdGggPSBsaW5lYXJJdGVtc1tpdGVtTGluZWFySW5kZXhdLmRlcHRoO1xuICAgICAgICB2YXIgcGFyZW50TGluZWFySW5kZXggPSBpdGVtTGluZWFySW5kZXg7XG4gICAgICAgIGZvciAoOyAhIWxpbmVhckl0ZW1zW3BhcmVudExpbmVhckluZGV4XSAmJlxuICAgICAgICAgICAgbGluZWFySXRlbXNbcGFyZW50TGluZWFySW5kZXhdLmRlcHRoICE9PSBkZXB0aCAtIDE7IHBhcmVudExpbmVhckluZGV4IC09IDEpXG4gICAgICAgICAgICA7XG4gICAgICAgIHZhciBwYXJlbnQgPSBsaW5lYXJJdGVtc1twYXJlbnRMaW5lYXJJbmRleF07XG4gICAgICAgIGlmICghcGFyZW50KSB7XG4gICAgICAgICAgICBwYXJlbnQgPSB7IGl0ZW06IGVudmlyb25tZW50LnRyZWVzW3RyZWVJZF0ucm9vdEl0ZW0sIGRlcHRoOiAwIH07XG4gICAgICAgICAgICBwYXJlbnRMaW5lYXJJbmRleCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgcGFyZW50OiBwYXJlbnQsIHBhcmVudExpbmVhckluZGV4OiBwYXJlbnRMaW5lYXJJbmRleCB9O1xuICAgIH0sIFtlbnZpcm9ubWVudC5saW5lYXJJdGVtcywgZW52aXJvbm1lbnQudHJlZXNdKTtcbn07XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby1jb250aW51ZSAqL1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VHZXRHZXRQYXJlbnRPZkxpbmVhckl0ZW0gfSBmcm9tICcuL3VzZUdldFBhcmVudE9mTGluZWFySXRlbSc7XG5pbXBvcnQgeyB1c2VUcmVlRW52aXJvbm1lbnQgfSBmcm9tICcuLi9jb250cm9sbGVkRW52aXJvbm1lbnQvQ29udHJvbGxlZFRyZWVFbnZpcm9ubWVudCc7XG5pbXBvcnQgeyB1c2VDYW5Ecm9wQXQgfSBmcm9tICcuL3VzZUNhbkRyb3BBdCc7XG5leHBvcnQgdmFyIHVzZUdldFZpYWJsZURyYWdQb3NpdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGVudmlyb25tZW50ID0gdXNlVHJlZUVudmlyb25tZW50KCk7XG4gICAgdmFyIGdldFBhcmVudE9mTGluZWFySXRlbSA9IHVzZUdldEdldFBhcmVudE9mTGluZWFySXRlbSgpO1xuICAgIHZhciBjYW5Ecm9wQXQgPSB1c2VDYW5Ecm9wQXQoKTtcbiAgICB2YXIgaXNEZXNjZW5kYW50ID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKHRyZWVJZCwgaXRlbUxpbmVhckluZGV4LCBwb3RlbnRpYWxQYXJlbnRzKSB7XG4gICAgICAgIC8vIGJhc2VkIG9uIERyYWdnaW5nUG9zaXRpb25FdmFsdWF0aW9uLmlzRGVzY2VuZGFudCgpXG4gICAgICAgIHZhciBfYSA9IGdldFBhcmVudE9mTGluZWFySXRlbShpdGVtTGluZWFySW5kZXgsIHRyZWVJZCksIHBhcmVudCA9IF9hLnBhcmVudCwgcGFyZW50TGluZWFySW5kZXggPSBfYS5wYXJlbnRMaW5lYXJJbmRleDtcbiAgICAgICAgaWYgKHBvdGVudGlhbFBhcmVudHMuc29tZShmdW5jdGlvbiAocCkgeyByZXR1cm4gcC5pbmRleCA9PT0gcGFyZW50Lml0ZW07IH0pKVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIGlmIChwYXJlbnQuZGVwdGggPT09IDApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIHJldHVybiBpc0Rlc2NlbmRhbnQodHJlZUlkLCBwYXJlbnRMaW5lYXJJbmRleCwgcG90ZW50aWFsUGFyZW50cyk7XG4gICAgfSwgW2dldFBhcmVudE9mTGluZWFySXRlbV0pO1xuICAgIHJldHVybiB1c2VDYWxsYmFjayhmdW5jdGlvbiAodHJlZUlkLCBkcmFnZ2luZ0l0ZW1zKSB7XG4gICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgIHZhciBsaW5lYXJJdGVtcyA9IGVudmlyb25tZW50LmxpbmVhckl0ZW1zW3RyZWVJZF07XG4gICAgICAgIHZhciB0YXJnZXRzID0gW107XG4gICAgICAgIHZhciBza2lwVW50aWxEZXB0aElzTG93ZXJUaGFuID0gLTE7XG4gICAgICAgIGZvciAodmFyIGxpbmVhckluZGV4ID0gMDsgbGluZWFySW5kZXggPCBsaW5lYXJJdGVtcy5sZW5ndGg7IFxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGx1c3BsdXNcbiAgICAgICAgbGluZWFySW5kZXgrKykge1xuICAgICAgICAgICAgdmFyIF9jID0gbGluZWFySXRlbXNbbGluZWFySW5kZXhdLCBpdGVtID0gX2MuaXRlbSwgZGVwdGggPSBfYy5kZXB0aDtcbiAgICAgICAgICAgIGlmIChza2lwVW50aWxEZXB0aElzTG93ZXJUaGFuICE9PSAtMSAmJlxuICAgICAgICAgICAgICAgIGRlcHRoID4gc2tpcFVudGlsRGVwdGhJc0xvd2VyVGhhbikge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgc2tpcFVudGlsRGVwdGhJc0xvd2VyVGhhbiA9IC0xO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHBhcmVudF8xID0gZ2V0UGFyZW50T2ZMaW5lYXJJdGVtKGxpbmVhckluZGV4LCB0cmVlSWQpLnBhcmVudDtcbiAgICAgICAgICAgIHZhciBjaGlsZEluZGV4ID0gZW52aXJvbm1lbnQuaXRlbXNbcGFyZW50XzEuaXRlbV0uY2hpbGRyZW4uaW5kZXhPZihpdGVtKTtcbiAgICAgICAgICAgIGlmIChpc0Rlc2NlbmRhbnQodHJlZUlkLCBsaW5lYXJJbmRleCwgZHJhZ2dpbmdJdGVtcykpIHtcbiAgICAgICAgICAgICAgICBza2lwVW50aWxEZXB0aElzTG93ZXJUaGFuID0gZGVwdGggKyAxO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGl0ZW1Qb3NpdGlvbiA9IHtcbiAgICAgICAgICAgICAgICB0YXJnZXRUeXBlOiAnaXRlbScsXG4gICAgICAgICAgICAgICAgcGFyZW50SXRlbTogcGFyZW50XzEuaXRlbSxcbiAgICAgICAgICAgICAgICB0YXJnZXRJdGVtOiBpdGVtLFxuICAgICAgICAgICAgICAgIGxpbmVhckluZGV4OiBsaW5lYXJJbmRleCxcbiAgICAgICAgICAgICAgICBkZXB0aDogZGVwdGgsXG4gICAgICAgICAgICAgICAgdHJlZUlkOiB0cmVlSWQsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdmFyIHRvcFBvc2l0aW9uID0ge1xuICAgICAgICAgICAgICAgIHRhcmdldFR5cGU6ICdiZXR3ZWVuLWl0ZW1zJyxcbiAgICAgICAgICAgICAgICBwYXJlbnRJdGVtOiBwYXJlbnRfMS5pdGVtLFxuICAgICAgICAgICAgICAgIGxpbmVQb3NpdGlvbjogJ3RvcCcsXG4gICAgICAgICAgICAgICAgY2hpbGRJbmRleDogY2hpbGRJbmRleCxcbiAgICAgICAgICAgICAgICBkZXB0aDogZGVwdGgsXG4gICAgICAgICAgICAgICAgdHJlZUlkOiB0cmVlSWQsXG4gICAgICAgICAgICAgICAgbGluZWFySW5kZXg6IGxpbmVhckluZGV4LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHZhciBib3R0b21Qb3NpdGlvbiA9IHtcbiAgICAgICAgICAgICAgICB0YXJnZXRUeXBlOiAnYmV0d2Vlbi1pdGVtcycsXG4gICAgICAgICAgICAgICAgcGFyZW50SXRlbTogcGFyZW50XzEuaXRlbSxcbiAgICAgICAgICAgICAgICBsaW5lUG9zaXRpb246ICdib3R0b20nLFxuICAgICAgICAgICAgICAgIGxpbmVhckluZGV4OiBsaW5lYXJJbmRleCArIDEsXG4gICAgICAgICAgICAgICAgY2hpbGRJbmRleDogY2hpbGRJbmRleCArIDEsXG4gICAgICAgICAgICAgICAgZGVwdGg6IGRlcHRoLFxuICAgICAgICAgICAgICAgIHRyZWVJZDogdHJlZUlkLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHZhciBza2lwVG9wUG9zaXRpb24gPSBkZXB0aCA9PT0gKChfYiA9IChfYSA9IGxpbmVhckl0ZW1zW2xpbmVhckluZGV4IC0gMV0pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5kZXB0aCkgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogLTEpO1xuICAgICAgICAgICAgaWYgKCFza2lwVG9wUG9zaXRpb24gJiYgY2FuRHJvcEF0KHRvcFBvc2l0aW9uLCBkcmFnZ2luZ0l0ZW1zKSkge1xuICAgICAgICAgICAgICAgIHRhcmdldHMucHVzaCh0b3BQb3NpdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2FuRHJvcEF0KGl0ZW1Qb3NpdGlvbiwgZHJhZ2dpbmdJdGVtcykpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRzLnB1c2goaXRlbVBvc2l0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjYW5Ecm9wQXQoYm90dG9tUG9zaXRpb24sIGRyYWdnaW5nSXRlbXMpKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0cy5wdXNoKGJvdHRvbVBvc2l0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGFyZ2V0cztcbiAgICB9LCBbXG4gICAgICAgIGNhbkRyb3BBdCxcbiAgICAgICAgZW52aXJvbm1lbnQuaXRlbXMsXG4gICAgICAgIGVudmlyb25tZW50LmxpbmVhckl0ZW1zLFxuICAgICAgICBnZXRQYXJlbnRPZkxpbmVhckl0ZW0sXG4gICAgICAgIGlzRGVzY2VuZGFudCxcbiAgICBdKTtcbn07XG4iLCJ2YXIgX19zcHJlYWRBcnJheSA9ICh0aGlzICYmIHRoaXMuX19zcHJlYWRBcnJheSkgfHwgZnVuY3Rpb24gKHRvLCBmcm9tLCBwYWNrKSB7XG4gICAgaWYgKHBhY2sgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gMikgZm9yICh2YXIgaSA9IDAsIGwgPSBmcm9tLmxlbmd0aCwgYXI7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgaWYgKGFyIHx8ICEoaSBpbiBmcm9tKSkge1xuICAgICAgICAgICAgaWYgKCFhcikgYXIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tLCAwLCBpKTtcbiAgICAgICAgICAgIGFyW2ldID0gZnJvbVtpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdG8uY29uY2F0KGFyIHx8IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20pKTtcbn07XG5pbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVJlZiB9IGZyb20gJ3JlYWN0JztcbmV4cG9ydCB2YXIgdXNlU2lkZUVmZmVjdCA9IGZ1bmN0aW9uIChlZmZlY3QsIGRlcHMsIGNoYW5nZU9uKSB7XG4gICAgdmFyIHByZXZpb3VzUmVmID0gdXNlUmVmKCk7XG4gICAgdXNlRWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCFwcmV2aW91c1JlZi5jdXJyZW50KSB7XG4gICAgICAgICAgICBwcmV2aW91c1JlZi5jdXJyZW50ID0gX19zcHJlYWRBcnJheShbXSwgY2hhbmdlT24sIHRydWUpO1xuICAgICAgICAgICAgZWZmZWN0KCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgY2hhbmdlZCA9IHByZXZpb3VzUmVmLmN1cnJlbnQuc29tZShmdW5jdGlvbiAodiwgaSkgeyByZXR1cm4gdiAhPT0gY2hhbmdlT25baV07IH0pO1xuICAgICAgICAgICAgaWYgKGNoYW5nZWQpIHtcbiAgICAgICAgICAgICAgICBwcmV2aW91c1JlZi5jdXJyZW50ID0gX19zcHJlYWRBcnJheShbXSwgY2hhbmdlT24sIHRydWUpO1xuICAgICAgICAgICAgICAgIGVmZmVjdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC1ob29rcy9leGhhdXN0aXZlLWRlcHNcbiAgICB9LCBfX3NwcmVhZEFycmF5KF9fc3ByZWFkQXJyYXkoW10sIGRlcHMsIHRydWUpLCBjaGFuZ2VPbiwgdHJ1ZSkpO1xufTtcbiIsInZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IGZ1bmN0aW9uICgpIHtcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXG4gICAgICAgICAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5leHBvcnQgdmFyIGJ1aWxkTWFwRm9yVHJlZXMgPSBmdW5jdGlvbiAodHJlZUlkcywgYnVpbGQpIHtcbiAgICByZXR1cm4gdHJlZUlkc1xuICAgICAgICAubWFwKGZ1bmN0aW9uIChpZCkgeyByZXR1cm4gW2lkLCBidWlsZChpZCldOyB9KVxuICAgICAgICAucmVkdWNlKGZ1bmN0aW9uIChhLCBfYSkge1xuICAgICAgICB2YXIgX2I7XG4gICAgICAgIHZhciBpZCA9IF9hWzBdLCBvYmogPSBfYVsxXTtcbiAgICAgICAgcmV0dXJuIChfX2Fzc2lnbihfX2Fzc2lnbih7fSwgYSksIChfYiA9IHt9LCBfYltpZF0gPSBvYmosIF9iKSkpO1xuICAgIH0sIHt9KTtcbn07XG5leHBvcnQgdmFyIGdldERvY3VtZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnID8gZG9jdW1lbnQgOiB1bmRlZmluZWQ7XG59O1xuIiwiaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZUVmZmVjdCwgdXNlUmVmIH0gZnJvbSAncmVhY3QnO1xuLyoqXG4gKiBSZWFjdCBob29rIHRoYXQgc2NoZWR1bGVzIGEgY2FsbGJhY2sgdG8gYmUgcnVuIFwic29vblwiIGFuZCB3aWxsIGNhbmNlbCB0aGVcbiAqIGNhbGxiYWNrIGlmIGl0IGlzIHN0aWxsIHBlbmRpbmcgd2hlbiB0aGUgY29tcG9uZW50IGlzIHVubW91bnRlZC5cbiAqXG4gKiBAcmV0dXJucyBBIGZ1bmN0aW9uIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2NoZWR1bGUgYSBkZWZlcnJlZCBjYWxsYmFjay5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVzZUNhbGxTb29uKGRvbnRDbGVhbikge1xuICAgIGlmIChkb250Q2xlYW4gPT09IHZvaWQgMCkgeyBkb250Q2xlYW4gPSBmYWxzZTsgfVxuICAgIHZhciBoYW5kbGVSZWYgPSB1c2VSZWYobmV3IEFycmF5KCkpO1xuICAgIHVzZUVmZmVjdChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChkb250Q2xlYW4pIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7IH07XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGhhbmRsZXMgPSBoYW5kbGVSZWYuY3VycmVudDtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHsgcmV0dXJuIGhhbmRsZXMuZm9yRWFjaChmdW5jdGlvbiAoaGFuZGxlKSB7IHJldHVybiBjYW5jZWxBbmltYXRpb25GcmFtZShoYW5kbGUpOyB9KTsgfTtcbiAgICB9LCBbZG9udENsZWFuLCBoYW5kbGVSZWZdKTtcbiAgICByZXR1cm4gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBoYW5kbGUgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaGFuZGxlUmVmLmN1cnJlbnQuc3BsaWNlKGhhbmRsZVJlZi5jdXJyZW50LmluZGV4T2YoaGFuZGxlKSwgMSk7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9KTtcbiAgICAgICAgaGFuZGxlUmVmLmN1cnJlbnQucHVzaChoYW5kbGUpO1xuICAgIH0sIFtoYW5kbGVSZWZdKTtcbn1cbiIsImltcG9ydCB7IHVzZVJlZiB9IGZyb20gJ3JlYWN0JztcbmV4cG9ydCB2YXIgdXNlUmVmQ29weSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHZhciByZWYgPSB1c2VSZWYodmFsdWUpO1xuICAgIHJlZi5jdXJyZW50ID0gdmFsdWU7XG4gICAgcmV0dXJuIHJlZjtcbn07XG4iLCJpbXBvcnQgeyB1c2VDYWxsYmFjayB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZVJlZkNvcHkgfSBmcm9tICcuL3VzZVJlZkNvcHknO1xuZXhwb3J0IHZhciB1c2VTdGFibGVIYW5kbGVyID0gZnVuY3Rpb24gKGhhbmRsZXIpIHtcbiAgICB2YXIgaGFuZGxlclJlZiA9IHVzZVJlZkNvcHkoaGFuZGxlcik7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0LWhvb2tzL2V4aGF1c3RpdmUtZGVwc1xuICAgIHJldHVybiB1c2VDYWxsYmFjaygoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXJncyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgYXJnc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBoYW5kbGVyUmVmLmN1cnJlbnQuYXBwbHkoaGFuZGxlclJlZiwgYXJncyk7XG4gICAgfSksIFtcbiAgICAgICAgaGFuZGxlclJlZixcbiAgICBdKTtcbn07XG4iLCJpbXBvcnQgeyB1c2VUcmVlRW52aXJvbm1lbnQgfSBmcm9tICcuL2NvbnRyb2xsZWRFbnZpcm9ubWVudC9Db250cm9sbGVkVHJlZUVudmlyb25tZW50JztcbmltcG9ydCB7IHVzZVN0YWJsZUhhbmRsZXIgfSBmcm9tICcuL3VzZVN0YWJsZUhhbmRsZXInO1xuZXhwb3J0IHZhciB1c2VHZXRPcmlnaW5hbEl0ZW1PcmRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZW52ID0gdXNlVHJlZUVudmlyb25tZW50KCk7XG4gICAgcmV0dXJuIHVzZVN0YWJsZUhhbmRsZXIoZnVuY3Rpb24gKHRyZWVJZCwgaXRlbXMpIHtcbiAgICAgICAgcmV0dXJuIGl0ZW1zXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgIGl0ZW0sXG4gICAgICAgICAgICAgICAgZW52LmxpbmVhckl0ZW1zW3RyZWVJZF0uZmluZEluZGV4KGZ1bmN0aW9uIChsaW5lYXJJdGVtKSB7IHJldHVybiBsaW5lYXJJdGVtLml0ZW0gPT09IGl0ZW0uaW5kZXg7IH0pLFxuICAgICAgICAgICAgXTtcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW51c2VkLXZhcnNcbiAgICAgICAgICAgIC5zb3J0KGZ1bmN0aW9uIChfYSwgX2IpIHtcbiAgICAgICAgICAgIHZhciBfID0gX2FbMF0sIGFQb3MgPSBfYVsxXTtcbiAgICAgICAgICAgIHZhciBfMiA9IF9iWzBdLCBiUG9zID0gX2JbMV07XG4gICAgICAgICAgICByZXR1cm4gYVBvcyAtIGJQb3M7XG4gICAgICAgIH0pXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSBfYVswXTtcbiAgICAgICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn07XG4iLCJpbXBvcnQgeyBnZXREb2N1bWVudCB9IGZyb20gJy4uL3V0aWxzJztcbmV4cG9ydCB2YXIgY29tcHV0ZUl0ZW1IZWlnaHQgPSBmdW5jdGlvbiAodHJlZUlkKSB7XG4gICAgdmFyIF9hO1xuICAgIHZhciBmaXJzdEl0ZW0gPSAoX2EgPSBnZXREb2N1bWVudCgpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucXVlcnlTZWxlY3RvcihcIltkYXRhLXJjdC10cmVlPVxcXCJcIi5jb25jYXQodHJlZUlkLCBcIlxcXCJdIFtkYXRhLXJjdC1pdGVtLWNvbnRhaW5lcj1cXFwidHJ1ZVxcXCJdXCIpKTtcbiAgICBpZiAoZmlyc3RJdGVtKSB7XG4gICAgICAgIHZhciBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoZmlyc3RJdGVtKTtcbiAgICAgICAgLy8gdG9wIG1hcmdpbiBmbG93cyBpbnRvIHRoZSBib3R0b20gbWFyZ2luIG9mIHRoZSBwcmV2aW91cyBpdGVtLCBzbyBpZ25vcmUgaXRcbiAgICAgICAgcmV0dXJuIChmaXJzdEl0ZW0ub2Zmc2V0SGVpZ2h0ICtcbiAgICAgICAgICAgIE1hdGgubWF4KHBhcnNlRmxvYXQoc3R5bGUubWFyZ2luVG9wKSwgcGFyc2VGbG9hdChzdHlsZS5tYXJnaW5Cb3R0b20pKSk7XG4gICAgfVxuICAgIHJldHVybiA1O1xufTtcbmV4cG9ydCB2YXIgaXNPdXRzaWRlT2ZDb250YWluZXIgPSBmdW5jdGlvbiAoZSwgdHJlZUJiKSB7XG4gICAgcmV0dXJuIGUuY2xpZW50WCA8PSB0cmVlQmIubGVmdCB8fFxuICAgICAgICBlLmNsaWVudFggPj0gdHJlZUJiLnJpZ2h0IHx8XG4gICAgICAgIGUuY2xpZW50WSA8PSB0cmVlQmIudG9wIHx8XG4gICAgICAgIGUuY2xpZW50WSA+PSB0cmVlQmIuYm90dG9tO1xufTtcbiIsInZhciBEcmFnZ2luZ1Bvc2l0aW9uRXZhbHVhdGlvbiA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBEcmFnZ2luZ1Bvc2l0aW9uRXZhbHVhdGlvbihlbnYsIGUsIHRyZWVJZCwgaG92ZXJpbmdQb3NpdGlvbiwgZHJhZ2dpbmdJdGVtcywgZ2V0UGFyZW50T2ZMaW5lYXJJdGVtKSB7XG4gICAgICAgIHRoaXMuZW52ID0gZW52O1xuICAgICAgICB0aGlzLmUgPSBlO1xuICAgICAgICB0aGlzLnRyZWVJZCA9IHRyZWVJZDtcbiAgICAgICAgdGhpcy5saW5lYXJJbmRleCA9IGhvdmVyaW5nUG9zaXRpb24ubGluZWFySW5kZXg7XG4gICAgICAgIHRoaXMub2Zmc2V0ID0gaG92ZXJpbmdQb3NpdGlvbi5vZmZzZXQ7XG4gICAgICAgIHRoaXMuaW5kZW50YXRpb24gPSBob3ZlcmluZ1Bvc2l0aW9uLmluZGVudGF0aW9uO1xuICAgICAgICB0aGlzLnRhcmdldEl0ZW0gPSB0aGlzLmVudi5saW5lYXJJdGVtc1t0aGlzLnRyZWVJZF1bdGhpcy5saW5lYXJJbmRleF07XG4gICAgICAgIHRoaXMuZ2V0UGFyZW50T2ZMaW5lYXJJdGVtID0gZ2V0UGFyZW50T2ZMaW5lYXJJdGVtO1xuICAgICAgICB0aGlzLmRyYWdnaW5nSXRlbXMgPSBkcmFnZ2luZ0l0ZW1zO1xuICAgIH1cbiAgICBEcmFnZ2luZ1Bvc2l0aW9uRXZhbHVhdGlvbi5wcm90b3R5cGUuZ2V0RW1wdHlUcmVlRHJhZ1Bvc2l0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdGFyZ2V0VHlwZTogJ3Jvb3QnLFxuICAgICAgICAgICAgdHJlZUlkOiB0aGlzLnRyZWVJZCxcbiAgICAgICAgICAgIGRlcHRoOiAwLFxuICAgICAgICAgICAgbGluZWFySW5kZXg6IDAsXG4gICAgICAgICAgICB0YXJnZXRJdGVtOiB0aGlzLmVudi50cmVlc1t0aGlzLnRyZWVJZF0ucm9vdEl0ZW0sXG4gICAgICAgIH07XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBJZiByZW9yZGVyaW5nIGlzIG5vdCBhbGxvd2VkLCBkcmFnZ2luZyBvbiBub24tZm9sZGVyIGl0ZW1zIHJlZGlyZWN0c1xuICAgICAqIHRoZSBkcmFnIHRhcmdldCB0byB0aGUgcGFyZW50IG9mIHRoZSB0YXJnZXQgaXRlbS5cbiAgICAgKi9cbiAgICBEcmFnZ2luZ1Bvc2l0aW9uRXZhbHVhdGlvbi5wcm90b3R5cGUubWF5YmVSZWRpcmVjdFRvUGFyZW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcmVkaXJlY3RUYXJnZXRUb1BhcmVudCA9ICF0aGlzLmVudi5jYW5SZW9yZGVySXRlbXMgJiZcbiAgICAgICAgICAgICF0aGlzLmVudi5jYW5Ecm9wT25Ob25Gb2xkZXIgJiZcbiAgICAgICAgICAgICF0aGlzLmVudi5pdGVtc1t0aGlzLnRhcmdldEl0ZW0uaXRlbV0uaXNGb2xkZXI7XG4gICAgICAgIGlmIChyZWRpcmVjdFRhcmdldFRvUGFyZW50KSB7XG4gICAgICAgICAgICB2YXIgX2EgPSB0aGlzLmdldFBhcmVudE9mTGluZWFySXRlbSh0aGlzLmxpbmVhckluZGV4LCB0aGlzLnRyZWVJZCksIHBhcmVudExpbmVhckluZGV4ID0gX2EucGFyZW50TGluZWFySW5kZXgsIHBhcmVudF8xID0gX2EucGFyZW50O1xuICAgICAgICAgICAgdGhpcy50YXJnZXRJdGVtID0gcGFyZW50XzE7XG4gICAgICAgICAgICB0aGlzLmxpbmVhckluZGV4ID0gcGFyZW50TGluZWFySW5kZXg7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIElmIHRoZSBpdGVtIGlzIHRoZSBsYXN0IGluIGEgZ3JvdXAsIGFuZCB0aGUgZHJvcCBpcyBhdCB0aGUgYm90dG9tLFxuICAgICAqIHRoZSB4LWNvb3JkaW5hdGUgb2YgdGhlIG1vdXNlIGFsbG93cyB0byByZXBhcmVudCB1cHdhcmRzLlxuICAgICAqL1xuICAgIERyYWdnaW5nUG9zaXRpb25FdmFsdWF0aW9uLnByb3RvdHlwZS5tYXliZVJlcGFyZW50VXB3YXJkcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgaWYgKHRoaXMuaW5kZW50YXRpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdHJlZUxpbmVhckl0ZW1zID0gdGhpcy5lbnYubGluZWFySXRlbXNbdGhpcy50cmVlSWRdO1xuICAgICAgICB2YXIgZGVlcGVzdERlcHRoID0gdHJlZUxpbmVhckl0ZW1zW3RoaXMubGluZWFySW5kZXhdLmRlcHRoO1xuICAgICAgICAvLyBEZWZhdWx0IHRvIHplcm8gb24gbGFzdCBwb3NpdGlvbiB0byBhbGxvdyBkcm9wcGluZyBvbiByb290IHdoZW5cbiAgICAgICAgLy8gZHJvcHBpbmcgYXQgYm90dG9tXG4gICAgICAgIHZhciBsZWdhbERyb3BEZXB0aENvdW50ID0gLy8gaXRlbURlcHRoRGlmZmVyZW5jZVRvTmV4dEl0ZW0vaXNMYXN0SW5Hcm91cFxuICAgICAgICAgZGVlcGVzdERlcHRoIC0gKChfYiA9IChfYSA9IHRyZWVMaW5lYXJJdGVtc1t0aGlzLmxpbmVhckluZGV4ICsgMV0pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5kZXB0aCkgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogMCk7XG4gICAgICAgIHZhciBjYW5SZXBhcmVudFVwd2FyZHMgPSB0aGlzLm9mZnNldCA9PT0gJ2JvdHRvbScgJiYgbGVnYWxEcm9wRGVwdGhDb3VudCA+IDA7XG4gICAgICAgIGlmICghY2FuUmVwYXJlbnRVcHdhcmRzKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIHZhciBkcm9wcGluZ0luZGVudCA9IE1hdGgubWF4KGRlZXBlc3REZXB0aCAtIGxlZ2FsRHJvcERlcHRoQ291bnQsIHRoaXMuaW5kZW50YXRpb24pO1xuICAgICAgICB2YXIgbmV3UGFyZW50ID0ge1xuICAgICAgICAgICAgcGFyZW50TGluZWFySW5kZXg6IHRoaXMubGluZWFySW5kZXgsXG4gICAgICAgICAgICBwYXJlbnQ6IHRoaXMudGFyZ2V0SXRlbSxcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGluc2VydGlvbkl0ZW1BYm92ZTtcbiAgICAgICAgZm9yICh2YXIgaSA9IGRlZXBlc3REZXB0aDsgaSA+PSBkcm9wcGluZ0luZGVudDsgaSAtPSAxKSB7XG4gICAgICAgICAgICBpbnNlcnRpb25JdGVtQWJvdmUgPSBuZXdQYXJlbnQ7XG4gICAgICAgICAgICBuZXdQYXJlbnQgPSB0aGlzLmdldFBhcmVudE9mTGluZWFySXRlbShuZXdQYXJlbnQucGFyZW50TGluZWFySW5kZXgsIHRoaXMudHJlZUlkKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5pbmRlbnRhdGlvbiA9PT0gdHJlZUxpbmVhckl0ZW1zW3RoaXMubGluZWFySW5kZXhdLmRlcHRoKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGlmICghaW5zZXJ0aW9uSXRlbUFib3ZlKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIHZhciByZXBhcmVudGVkQ2hpbGRJbmRleCA9IHRoaXMuZW52Lml0ZW1zW25ld1BhcmVudC5wYXJlbnQuaXRlbV0uY2hpbGRyZW4uaW5kZXhPZihpbnNlcnRpb25JdGVtQWJvdmUucGFyZW50Lml0ZW0pICsgMTtcbiAgICAgICAgaWYgKHRoaXMuZHJhZ2dpbmdJdGVtcyAmJlxuICAgICAgICAgICAgdGhpcy5pc0Rlc2NlbmRhbnQodGhpcy50cmVlSWQsIG5ld1BhcmVudC5wYXJlbnRMaW5lYXJJbmRleCArIDEsIHRoaXMuZHJhZ2dpbmdJdGVtcykpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRhcmdldFR5cGU6ICdiZXR3ZWVuLWl0ZW1zJyxcbiAgICAgICAgICAgIHRyZWVJZDogdGhpcy50cmVlSWQsXG4gICAgICAgICAgICBwYXJlbnRJdGVtOiBuZXdQYXJlbnQucGFyZW50Lml0ZW0sXG4gICAgICAgICAgICBkZXB0aDogZHJvcHBpbmdJbmRlbnQsXG4gICAgICAgICAgICBsaW5lYXJJbmRleDogdGhpcy5saW5lYXJJbmRleCArIDEsXG4gICAgICAgICAgICBjaGlsZEluZGV4OiByZXBhcmVudGVkQ2hpbGRJbmRleCxcbiAgICAgICAgICAgIGxpbmVQb3NpdGlvbjogJ2JvdHRvbScsXG4gICAgICAgIH07XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBEb24ndCBhbGxvdyB0byBkcm9wIGF0IGJvdHRvbSBvZiBhbiBvcGVuIGZvbGRlciwgc2luY2UgdGhhdCB3aWxsIHBsYWNlXG4gICAgICogaXQgdmlzdWFsbHkgYXQgYSBkaWZmZXJlbnQgcG9zaXRpb24uIFJlZGlyZWN0IHRoZSBkcmFnIHRhcmdldCB0byB0aGVcbiAgICAgKiB0b3Agb2YgdGhlIGZvbGRlciBjb250ZW50cyBpbiB0aGF0IGNhc2UuXG4gICAgICovXG4gICAgRHJhZ2dpbmdQb3NpdGlvbkV2YWx1YXRpb24ucHJvdG90eXBlLm1heWJlUmVkaXJlY3RJbnNpZGVPcGVuRm9sZGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbmV4dEl0ZW0gPSB0aGlzLmVudi5saW5lYXJJdGVtc1t0aGlzLnRyZWVJZF1bdGhpcy5saW5lYXJJbmRleCArIDFdO1xuICAgICAgICB2YXIgcmVkaXJlY3RJbnNpZGVPcGVuRm9sZGVyID0gIXRoaXMuZW52LmNhbkRyb3BCZWxvd09wZW5Gb2xkZXJzICYmXG4gICAgICAgICAgICBuZXh0SXRlbSAmJlxuICAgICAgICAgICAgdGhpcy50YXJnZXRJdGVtLmRlcHRoID09PSBuZXh0SXRlbS5kZXB0aCAtIDEgJiZcbiAgICAgICAgICAgIHRoaXMub2Zmc2V0ID09PSAnYm90dG9tJztcbiAgICAgICAgaWYgKHJlZGlyZWN0SW5zaWRlT3BlbkZvbGRlcikge1xuICAgICAgICAgICAgdGhpcy50YXJnZXRJdGVtID0gbmV4dEl0ZW07XG4gICAgICAgICAgICB0aGlzLmxpbmVhckluZGV4ICs9IDE7XG4gICAgICAgICAgICB0aGlzLm9mZnNldCA9ICd0b3AnO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBJbnNpZGUgYSBmb2xkZXIsIG9ubHkgZHJvcCBhdCBib3R0b20gb2Zmc2V0IHRvIG1ha2UgaXQgdmlzdWFsbHlcbiAgICAgKiBjb25zaXN0ZW50LiBUaGlzIGFsc28gbWFwcyB0byBib3R0b20gb2Zmc2V0IGZvciBpdGVtcyBiZWxvdyBvcGVuXG4gICAgICogc3VidHJlZXMsIHRvIGtlZXAgdGhlIHgtY29vcmRpbmF0ZSBiYXNlZCBkcm9wcGluZyBjb25zaXN0ZW50IChvbmx5XG4gICAgICogaWYgaW5kZW50YXRpb24gaXMgZGVmaW5lZCkuXG4gICAgICovXG4gICAgRHJhZ2dpbmdQb3NpdGlvbkV2YWx1YXRpb24ucHJvdG90eXBlLm1heWJlTWFwVG9Cb3R0b21PZmZzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBwcmlvckl0ZW0gPSB0aGlzLmVudi5saW5lYXJJdGVtc1t0aGlzLnRyZWVJZF1bdGhpcy5saW5lYXJJbmRleCAtIDFdO1xuICAgICAgICBpZiAoIXByaW9ySXRlbSB8fCAocHJpb3JJdGVtID09PSBudWxsIHx8IHByaW9ySXRlbSA9PT0gdm9pZCAwID8gdm9pZCAwIDogcHJpb3JJdGVtLmRlcHRoKSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB2YXIgZGVwdGhEaXN0YW5jZVRvUHJpb3IgPSBwcmlvckl0ZW0uZGVwdGggLSB0aGlzLnRhcmdldEl0ZW0uZGVwdGg7XG4gICAgICAgIGlmICh0aGlzLm9mZnNldCA9PT0gJ3RvcCcgJiZcbiAgICAgICAgICAgIChkZXB0aERpc3RhbmNlVG9QcmlvciA9PT0gMCB8fFxuICAgICAgICAgICAgICAgIChkZXB0aERpc3RhbmNlVG9QcmlvciA+IDAgJiYgdGhpcy5pbmRlbnRhdGlvbiAhPT0gdW5kZWZpbmVkKSkpIHtcbiAgICAgICAgICAgIHRoaXMub2Zmc2V0ID0gJ2JvdHRvbSc7XG4gICAgICAgICAgICB0aGlzLmxpbmVhckluZGV4IC09IDE7XG4gICAgICAgICAgICB0aGlzLnRhcmdldEl0ZW0gPSB0aGlzLmVudi5saW5lYXJJdGVtc1t0aGlzLnRyZWVJZF1bdGhpcy5saW5lYXJJbmRleF07XG4gICAgICAgIH1cbiAgICB9O1xuICAgIERyYWdnaW5nUG9zaXRpb25FdmFsdWF0aW9uLnByb3RvdHlwZS5jYW5Ecm9wQXRDdXJyZW50VGFyZ2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHZhciB0YXJnZXRJdGVtRGF0YSA9IHRoaXMuZW52Lml0ZW1zW3RoaXMudGFyZ2V0SXRlbS5pdGVtXTtcbiAgICAgICAgaWYgKCF0aGlzLm9mZnNldCAmJlxuICAgICAgICAgICAgIXRoaXMuZW52LmNhbkRyb3BPbk5vbkZvbGRlciAmJlxuICAgICAgICAgICAgIXRhcmdldEl0ZW1EYXRhLmlzRm9sZGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLm9mZnNldCAmJiAhdGhpcy5lbnYuY2FuRHJvcE9uRm9sZGVyICYmIHRhcmdldEl0ZW1EYXRhLmlzRm9sZGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMub2Zmc2V0ICYmICF0aGlzLmVudi5jYW5SZW9yZGVySXRlbXMpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoKF9hID0gdGhpcy5kcmFnZ2luZ0l0ZW1zKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Euc29tZShmdW5jdGlvbiAoZHJhZ2dpbmdJdGVtKSB7IHJldHVybiBkcmFnZ2luZ0l0ZW0uaW5kZXggPT09IF90aGlzLnRhcmdldEl0ZW0uaXRlbTsgfSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuICAgIERyYWdnaW5nUG9zaXRpb25FdmFsdWF0aW9uLnByb3RvdHlwZS5nZXREcmFnZ2luZ1Bvc2l0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5lbnYubGluZWFySXRlbXNbdGhpcy50cmVlSWRdLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RW1wdHlUcmVlRHJhZ1Bvc2l0aW9uKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmRyYWdnaW5nSXRlbXMgfHxcbiAgICAgICAgICAgIHRoaXMubGluZWFySW5kZXggPCAwIHx8XG4gICAgICAgICAgICB0aGlzLmxpbmVhckluZGV4ID49IHRoaXMuZW52LmxpbmVhckl0ZW1zW3RoaXMudHJlZUlkXS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tYXliZVJlZGlyZWN0VG9QYXJlbnQoKTtcbiAgICAgICAgdGhpcy5tYXliZVJlZGlyZWN0SW5zaWRlT3BlbkZvbGRlcigpO1xuICAgICAgICB0aGlzLm1heWJlTWFwVG9Cb3R0b21PZmZzZXQoKTtcbiAgICAgICAgdmFyIHJlcGFyZW50ZWQgPSB0aGlzLm1heWJlUmVwYXJlbnRVcHdhcmRzKCk7XG4gICAgICAgIGlmIChyZXBhcmVudGVkKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVwYXJlbnRlZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5hcmVEcmFnZ2luZ0l0ZW1zRGVzY2VuZGFudE9mVGFyZ2V0KCkpIHtcbiAgICAgICAgICAgIHJldHVybiAnaW52YWxpZCc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmNhbkRyb3BBdEN1cnJlbnRUYXJnZXQoKSkge1xuICAgICAgICAgICAgcmV0dXJuICdpbnZhbGlkJztcbiAgICAgICAgfVxuICAgICAgICB2YXIgcGFyZW50ID0gdGhpcy5nZXRQYXJlbnRPZkxpbmVhckl0ZW0odGhpcy5saW5lYXJJbmRleCwgdGhpcy50cmVlSWQpLnBhcmVudDtcbiAgICAgICAgdmFyIG5ld0NoaWxkSW5kZXggPSB0aGlzLmVudi5pdGVtc1twYXJlbnQuaXRlbV0uY2hpbGRyZW4uaW5kZXhPZih0aGlzLnRhcmdldEl0ZW0uaXRlbSkgK1xuICAgICAgICAgICAgKHRoaXMub2Zmc2V0ID09PSAndG9wJyA/IDAgOiAxKTtcbiAgICAgICAgaWYgKHRoaXMub2Zmc2V0KSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHRhcmdldFR5cGU6ICdiZXR3ZWVuLWl0ZW1zJyxcbiAgICAgICAgICAgICAgICB0cmVlSWQ6IHRoaXMudHJlZUlkLFxuICAgICAgICAgICAgICAgIHBhcmVudEl0ZW06IHBhcmVudC5pdGVtLFxuICAgICAgICAgICAgICAgIGRlcHRoOiB0aGlzLnRhcmdldEl0ZW0uZGVwdGgsXG4gICAgICAgICAgICAgICAgbGluZWFySW5kZXg6IHRoaXMubGluZWFySW5kZXggKyAodGhpcy5vZmZzZXQgPT09ICd0b3AnID8gMCA6IDEpLFxuICAgICAgICAgICAgICAgIGNoaWxkSW5kZXg6IG5ld0NoaWxkSW5kZXgsXG4gICAgICAgICAgICAgICAgbGluZVBvc2l0aW9uOiB0aGlzLm9mZnNldCxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRhcmdldFR5cGU6ICdpdGVtJyxcbiAgICAgICAgICAgIHRyZWVJZDogdGhpcy50cmVlSWQsXG4gICAgICAgICAgICBwYXJlbnRJdGVtOiBwYXJlbnQuaXRlbSxcbiAgICAgICAgICAgIHRhcmdldEl0ZW06IHRoaXMudGFyZ2V0SXRlbS5pdGVtLFxuICAgICAgICAgICAgZGVwdGg6IHRoaXMudGFyZ2V0SXRlbS5kZXB0aCxcbiAgICAgICAgICAgIGxpbmVhckluZGV4OiB0aGlzLmxpbmVhckluZGV4LFxuICAgICAgICB9O1xuICAgIH07XG4gICAgRHJhZ2dpbmdQb3NpdGlvbkV2YWx1YXRpb24ucHJvdG90eXBlLmlzRGVzY2VuZGFudCA9IGZ1bmN0aW9uICh0cmVlSWQsIGl0ZW1MaW5lYXJJbmRleCwgcG90ZW50aWFsUGFyZW50cykge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnZGVzY2VuZGFudCBjaGVjaycsIGl0ZW1MaW5lYXJJbmRleCwgcG90ZW50aWFsUGFyZW50cyk7XG4gICAgICAgIHZhciBfYSA9IHRoaXMuZ2V0UGFyZW50T2ZMaW5lYXJJdGVtKGl0ZW1MaW5lYXJJbmRleCwgdHJlZUlkKSwgcGFyZW50TGluZWFySW5kZXggPSBfYS5wYXJlbnRMaW5lYXJJbmRleCwgcGFyZW50ID0gX2EucGFyZW50O1xuICAgICAgICBpZiAocG90ZW50aWFsUGFyZW50cy5zb21lKGZ1bmN0aW9uIChwKSB7IHJldHVybiBwLmluZGV4ID09PSBwYXJlbnQuaXRlbTsgfSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYXJlbnQuZGVwdGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5pc0Rlc2NlbmRhbnQodHJlZUlkLCBwYXJlbnRMaW5lYXJJbmRleCwgcG90ZW50aWFsUGFyZW50cyk7XG4gICAgfTtcbiAgICBEcmFnZ2luZ1Bvc2l0aW9uRXZhbHVhdGlvbi5wcm90b3R5cGUuYXJlRHJhZ2dpbmdJdGVtc0Rlc2NlbmRhbnRPZlRhcmdldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLmRyYWdnaW5nSXRlbXMgJiZcbiAgICAgICAgICAgIHRoaXMuaXNEZXNjZW5kYW50KHRoaXMudHJlZUlkLCB0aGlzLmxpbmVhckluZGV4LCB0aGlzLmRyYWdnaW5nSXRlbXMpKTtcbiAgICB9O1xuICAgIHJldHVybiBEcmFnZ2luZ1Bvc2l0aW9uRXZhbHVhdGlvbjtcbn0oKSk7XG5leHBvcnQgeyBEcmFnZ2luZ1Bvc2l0aW9uRXZhbHVhdGlvbiB9O1xuIiwiaW1wb3J0IHsgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGNvbXB1dGVJdGVtSGVpZ2h0LCBpc091dHNpZGVPZkNvbnRhaW5lciwgfSBmcm9tICcuLi9jb250cm9sbGVkRW52aXJvbm1lbnQvbGF5b3V0VXRpbHMnO1xuaW1wb3J0IHsgdXNlVHJlZUVudmlyb25tZW50IH0gZnJvbSAnLi4vY29udHJvbGxlZEVudmlyb25tZW50L0NvbnRyb2xsZWRUcmVlRW52aXJvbm1lbnQnO1xuaW1wb3J0IHsgdXNlU3RhYmxlSGFuZGxlciB9IGZyb20gJy4uL3VzZVN0YWJsZUhhbmRsZXInO1xuaW1wb3J0IHsgRHJhZ2dpbmdQb3NpdGlvbkV2YWx1YXRpb24gfSBmcm9tICcuL0RyYWdnaW5nUG9zaXRpb25FdmFsdWF0aW9uJztcbmltcG9ydCB7IHVzZUdldEdldFBhcmVudE9mTGluZWFySXRlbSB9IGZyb20gJy4vdXNlR2V0UGFyZW50T2ZMaW5lYXJJdGVtJztcbmV4cG9ydCB2YXIgdXNlRHJhZ2dpbmdQb3NpdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZHJhZ0NvZGUgPSB1c2VSZWYoJ2luaXRpYWwnKTtcbiAgICB2YXIgX2EgPSB1c2VTdGF0ZSh1bmRlZmluZWQpLCBkcmFnZ2luZ0l0ZW1zID0gX2FbMF0sIHNldERyYWdnaW5nSXRlbXMgPSBfYVsxXTtcbiAgICB2YXIgaXRlbUhlaWdodCA9IHVzZVJlZigwKTtcbiAgICB2YXIgZW52ID0gdXNlVHJlZUVudmlyb25tZW50KCk7XG4gICAgdmFyIGdldFBhcmVudE9mTGluZWFySXRlbSA9IHVzZUdldEdldFBhcmVudE9mTGluZWFySXRlbSgpO1xuICAgIHZhciBpc05ld0RyYWdQb3NpdGlvbiA9IHVzZVN0YWJsZUhhbmRsZXIoZnVuY3Rpb24gKGUsIHRyZWVJZCwgaG92ZXJpbmdQb3NpdGlvbikge1xuICAgICAgICBpZiAoIWhvdmVyaW5nUG9zaXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgb2Zmc2V0ID0gaG92ZXJpbmdQb3NpdGlvbi5vZmZzZXQsIGxpbmVhckluZGV4ID0gaG92ZXJpbmdQb3NpdGlvbi5saW5lYXJJbmRleDtcbiAgICAgICAgdmFyIG5ld0RyYWdDb2RlID0gXCJcIi5jb25jYXQodHJlZUlkLCBcIl9fXCIpLmNvbmNhdChsaW5lYXJJbmRleCwgXCJfX1wiKS5jb25jYXQob2Zmc2V0ICE9PSBudWxsICYmIG9mZnNldCAhPT0gdm9pZCAwID8gb2Zmc2V0IDogJycsIFwiX19cIikuY29uY2F0KGhvdmVyaW5nUG9zaXRpb24uaW5kZW50YXRpb24pO1xuICAgICAgICBpZiAobmV3RHJhZ0NvZGUgIT09IGRyYWdDb2RlLmN1cnJlbnQpIHtcbiAgICAgICAgICAgIGRyYWdDb2RlLmN1cnJlbnQgPSBuZXdEcmFnQ29kZTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHVuZGVmaW5lZCBmb3IgaW52YWxpZCBkcm9wIHRhcmdldHMsIGxpa2Ugb3V0c2lkZSB0aGUgdHJlZS5cbiAgICAgKi9cbiAgICB2YXIgZ2V0SG92ZXJpbmdQb3NpdGlvbiA9IHVzZVN0YWJsZUhhbmRsZXIoZnVuY3Rpb24gKGUsIHRyZWVJZCwgY29udGFpbmVyUmVmKSB7XG4gICAgICAgIGlmICghY29udGFpbmVyUmVmLmN1cnJlbnQpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHRyZWVCYiA9IGNvbnRhaW5lclJlZi5jdXJyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBpZiAoaXNPdXRzaWRlT2ZDb250YWluZXIoZSwgdHJlZUJiKSkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgaG92ZXJpbmdQb3NpdGlvbiA9IChlLmNsaWVudFkgLSB0cmVlQmIudG9wKSAvIGl0ZW1IZWlnaHQuY3VycmVudDtcbiAgICAgICAgdmFyIHRyZWVMaW5lYXJJdGVtcyA9IGVudi5saW5lYXJJdGVtc1t0cmVlSWRdO1xuICAgICAgICB2YXIgbGluZWFySW5kZXggPSBNYXRoLm1pbihNYXRoLm1heCgwLCBNYXRoLmZsb29yKGhvdmVyaW5nUG9zaXRpb24pKSwgdHJlZUxpbmVhckl0ZW1zLmxlbmd0aCAtIDEpO1xuICAgICAgICBpZiAodHJlZUxpbmVhckl0ZW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBsaW5lYXJJbmRleDogMCxcbiAgICAgICAgICAgICAgICBvZmZzZXQ6ICdib3R0b20nLFxuICAgICAgICAgICAgICAgIGluZGVudGF0aW9uOiAwLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdGFyZ2V0TGluZWFySXRlbSA9IHRyZWVMaW5lYXJJdGVtc1tsaW5lYXJJbmRleF07XG4gICAgICAgIHZhciB0YXJnZXRJdGVtID0gZW52Lml0ZW1zW3RhcmdldExpbmVhckl0ZW0uaXRlbV07XG4gICAgICAgIHZhciBpbmRlbnRhdGlvbiA9ICFlbnYucmVuZGVyRGVwdGhPZmZzZXRcbiAgICAgICAgICAgID8gdW5kZWZpbmVkXG4gICAgICAgICAgICA6IE1hdGgubWF4KE1hdGguZmxvb3IoKGUuY2xpZW50WCAtIHRyZWVCYi5sZWZ0KSAvIGVudi5yZW5kZXJEZXB0aE9mZnNldCksIDApO1xuICAgICAgICB2YXIgb2Zmc2V0O1xuICAgICAgICB2YXIgbGluZVRocmVzaG9sZCA9ICFlbnYuY2FuUmVvcmRlckl0ZW1zXG4gICAgICAgICAgICA/IDBcbiAgICAgICAgICAgIDogKCh0YXJnZXRJdGVtID09PSBudWxsIHx8IHRhcmdldEl0ZW0gPT09IHZvaWQgMCA/IHZvaWQgMCA6IHRhcmdldEl0ZW0uaXNGb2xkZXIpICYmIGVudi5jYW5Ecm9wT25Gb2xkZXIpIHx8XG4gICAgICAgICAgICAgICAgZW52LmNhbkRyb3BPbk5vbkZvbGRlclxuICAgICAgICAgICAgICAgID8gMC4yXG4gICAgICAgICAgICAgICAgOiAwLjU7XG4gICAgICAgIGlmIChob3ZlcmluZ1Bvc2l0aW9uIC0gMC41ID49IHRyZWVMaW5lYXJJdGVtcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAvLyB2ZXJ5IGJvdHRvbSwgYWx3YXlzIHVzZSBvZmZzZXQgXCJib3R0b21cIlxuICAgICAgICAgICAgb2Zmc2V0ID0gJ2JvdHRvbSc7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoaG92ZXJpbmdQb3NpdGlvbiAlIDEgPCBsaW5lVGhyZXNob2xkKSB7XG4gICAgICAgICAgICBvZmZzZXQgPSAndG9wJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChob3ZlcmluZ1Bvc2l0aW9uICUgMSA+IDEgLSBsaW5lVGhyZXNob2xkKSB7XG4gICAgICAgICAgICBvZmZzZXQgPSAnYm90dG9tJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyBsaW5lYXJJbmRleDogbGluZWFySW5kZXgsIG9mZnNldDogb2Zmc2V0LCBpbmRlbnRhdGlvbjogaW5kZW50YXRpb24gfTtcbiAgICB9KTtcbiAgICAvLyByZXR1cm5pbmcgdW5kZWZpbmVkIG1lYW5zIGNhbGxpbmcgb25EcmFnQXRQb3NpdGlvbih1bmRlZmluZWQpLCByZXR1cm5pbmcgYSBkcm9wcG9zaXRpb24gbWVhbnMgY2FsbGluZyBvblBlcmZvcm1EcmFnKGRyb3Bwb3NpdGlvbilcbiAgICAvLyBUT0RPIG9sZCBmdW5jdGlvbiBzb21ldGltZXMgcmV0dXJuZWQgdW5kZWZpbmVkIHdoZW4gb2xkIHN0YXRlIGNvdWxkIGJlIGtlcHQ7IGlzIGl0IG9rYXkgdG8gYWxzbyByZXR1cm4gdW5kZWZpbmVkIHRvIGVudGVyIGludmFsaWQgZHJvcCBzdGF0ZSBoZXJlPyBlLmcuICF0aGlzLmRyYWdnaW5nSXRlbXMsICFjYW5EcmFnQW5kRHJvcC4uLlxuICAgIHZhciBnZXREcmFnZ2luZ1Bvc2l0aW9uID0gdXNlU3RhYmxlSGFuZGxlcihmdW5jdGlvbiAoZSwgdHJlZUlkLCBjb250YWluZXJSZWYpIHtcbiAgICAgICAgdmFyIGhvdmVyaW5nUG9zaXRpb24gPSBnZXRIb3ZlcmluZ1Bvc2l0aW9uKGUsIHRyZWVJZCwgY29udGFpbmVyUmVmKTtcbiAgICAgICAgaWYgKCFpc05ld0RyYWdQb3NpdGlvbihlLCB0cmVlSWQsIGhvdmVyaW5nUG9zaXRpb24pKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZHJhZ2dpbmdJdGVtcyB8fFxuICAgICAgICAgICAgIWVudi5jYW5EcmFnQW5kRHJvcCB8fFxuICAgICAgICAgICAgIWhvdmVyaW5nUG9zaXRpb24gfHxcbiAgICAgICAgICAgIGUuY2xpZW50WCA8IDAgfHxcbiAgICAgICAgICAgIGUuY2xpZW50WSA8IDApIHtcbiAgICAgICAgICAgIHJldHVybiAnaW52YWxpZCc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBEcmFnZ2luZ1Bvc2l0aW9uRXZhbHVhdGlvbihlbnYsIGUsIHRyZWVJZCwgaG92ZXJpbmdQb3NpdGlvbiwgZHJhZ2dpbmdJdGVtcywgZ2V0UGFyZW50T2ZMaW5lYXJJdGVtKS5nZXREcmFnZ2luZ1Bvc2l0aW9uKCk7XG4gICAgfSk7XG4gICAgdmFyIGluaXRpYXRlRHJhZ2dpbmdQb3NpdGlvbiA9IHVzZVN0YWJsZUhhbmRsZXIoZnVuY3Rpb24gKHRyZWVJZCwgaXRlbXMpIHtcbiAgICAgICAgc2V0RHJhZ2dpbmdJdGVtcyhpdGVtcyk7XG4gICAgICAgIGRyYWdDb2RlLmN1cnJlbnQgPSAnaW5pdGlhbCc7XG4gICAgICAgIGl0ZW1IZWlnaHQuY3VycmVudCA9IGNvbXB1dGVJdGVtSGVpZ2h0KHRyZWVJZCk7XG4gICAgfSk7XG4gICAgdmFyIHJlc2V0RHJhZ2dpbmdQb3NpdGlvbiA9IHVzZVN0YWJsZUhhbmRsZXIoZnVuY3Rpb24gKCkge1xuICAgICAgICBzZXREcmFnZ2luZ0l0ZW1zKHVuZGVmaW5lZCk7XG4gICAgICAgIGRyYWdDb2RlLmN1cnJlbnQgPSAnaW5pdGlhbCc7XG4gICAgICAgIGl0ZW1IZWlnaHQuY3VycmVudCA9IDA7XG4gICAgfSk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgaW5pdGlhdGVEcmFnZ2luZ1Bvc2l0aW9uOiBpbml0aWF0ZURyYWdnaW5nUG9zaXRpb24sXG4gICAgICAgIHJlc2V0RHJhZ2dpbmdQb3NpdGlvbjogcmVzZXREcmFnZ2luZ1Bvc2l0aW9uLFxuICAgICAgICBkcmFnZ2luZ0l0ZW1zOiBkcmFnZ2luZ0l0ZW1zLFxuICAgICAgICBnZXREcmFnZ2luZ1Bvc2l0aW9uOiBnZXREcmFnZ2luZ1Bvc2l0aW9uLFxuICAgICAgICBpdGVtSGVpZ2h0OiBpdGVtSGVpZ2h0LFxuICAgIH07XG59O1xuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VUcmVlRW52aXJvbm1lbnQgfSBmcm9tICcuLi9jb250cm9sbGVkRW52aXJvbm1lbnQvQ29udHJvbGxlZFRyZWVFbnZpcm9ubWVudCc7XG5pbXBvcnQgeyB1c2VDYW5Ecm9wQXQgfSBmcm9tICcuL3VzZUNhbkRyb3BBdCc7XG5pbXBvcnQgeyB1c2VHZXRWaWFibGVEcmFnUG9zaXRpb25zIH0gZnJvbSAnLi91c2VHZXRWaWFibGVEcmFnUG9zaXRpb25zJztcbmltcG9ydCB7IHVzZVNpZGVFZmZlY3QgfSBmcm9tICcuLi91c2VTaWRlRWZmZWN0JztcbmltcG9ydCB7IGJ1aWxkTWFwRm9yVHJlZXMgfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgeyB1c2VDYWxsU29vbiB9IGZyb20gJy4uL3VzZUNhbGxTb29uJztcbmltcG9ydCB7IHVzZVN0YWJsZUhhbmRsZXIgfSBmcm9tICcuLi91c2VTdGFibGVIYW5kbGVyJztcbmltcG9ydCB7IHVzZUdldE9yaWdpbmFsSXRlbU9yZGVyIH0gZnJvbSAnLi4vdXNlR2V0T3JpZ2luYWxJdGVtT3JkZXInO1xuaW1wb3J0IHsgdXNlRHJhZ2dpbmdQb3NpdGlvbiB9IGZyb20gJy4vdXNlRHJhZ2dpbmdQb3NpdGlvbic7XG5pbXBvcnQgeyBpc091dHNpZGVPZkNvbnRhaW5lciB9IGZyb20gJy4uL2NvbnRyb2xsZWRFbnZpcm9ubWVudC9sYXlvdXRVdGlscyc7XG52YXIgRHJhZ0FuZERyb3BDb250ZXh0ID0gUmVhY3QuY3JlYXRlQ29udGV4dChudWxsKTtcbmV4cG9ydCB2YXIgdXNlRHJhZ0FuZERyb3AgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBSZWFjdC51c2VDb250ZXh0KERyYWdBbmREcm9wQ29udGV4dCk7IH07XG5leHBvcnQgdmFyIERyYWdBbmREcm9wUHJvdmlkZXIgPSBmdW5jdGlvbiAoX2EpIHtcbiAgICB2YXIgY2hpbGRyZW4gPSBfYS5jaGlsZHJlbjtcbiAgICB2YXIgZW52aXJvbm1lbnQgPSB1c2VUcmVlRW52aXJvbm1lbnQoKTtcbiAgICB2YXIgX2IgPSB1c2VTdGF0ZShmYWxzZSksIGlzUHJvZ3JhbW1hdGljYWxseURyYWdnaW5nID0gX2JbMF0sIHNldElzUHJvZ3JhbW1hdGljYWxseURyYWdnaW5nID0gX2JbMV07XG4gICAgdmFyIF9jID0gdXNlU3RhdGUoe30pLCB2aWFibGVEcmFnUG9zaXRpb25zID0gX2NbMF0sIHNldFZpYWJsZURyYWdQb3NpdGlvbnMgPSBfY1sxXTtcbiAgICB2YXIgX2QgPSB1c2VTdGF0ZSgwKSwgcHJvZ3JhbW1hdGljRHJhZ0luZGV4ID0gX2RbMF0sIHNldFByb2dyYW1tYXRpY0RyYWdJbmRleCA9IF9kWzFdO1xuICAgIHZhciBfZSA9IHVzZVN0YXRlKCksIGRyYWdnaW5nUG9zaXRpb24gPSBfZVswXSwgc2V0RHJhZ2dpbmdQb3NpdGlvbiA9IF9lWzFdO1xuICAgIHZhciBnZXRWaWFibGVEcmFnUG9zaXRpb25zID0gdXNlR2V0VmlhYmxlRHJhZ1Bvc2l0aW9ucygpO1xuICAgIHZhciBjYWxsU29vbiA9IHVzZUNhbGxTb29uKCk7XG4gICAgdmFyIGdldE9yaWdpbmFsSXRlbU9yZGVyID0gdXNlR2V0T3JpZ2luYWxJdGVtT3JkZXIoKTtcbiAgICB2YXIgX2YgPSB1c2VEcmFnZ2luZ1Bvc2l0aW9uKCksIGluaXRpYXRlRHJhZ2dpbmdQb3NpdGlvbiA9IF9mLmluaXRpYXRlRHJhZ2dpbmdQb3NpdGlvbiwgcmVzZXREcmFnZ2luZ1Bvc2l0aW9uID0gX2YucmVzZXREcmFnZ2luZ1Bvc2l0aW9uLCBkcmFnZ2luZ0l0ZW1zID0gX2YuZHJhZ2dpbmdJdGVtcywgZ2V0RHJhZ2dpbmdQb3NpdGlvbiA9IF9mLmdldERyYWdnaW5nUG9zaXRpb24sIGl0ZW1IZWlnaHQgPSBfZi5pdGVtSGVpZ2h0O1xuICAgIHZhciByZXNldFByb2dyYW1tYXRpY0RyYWdJbmRleEZvckN1cnJlbnRUcmVlID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKHZpYWJsZURyYWdQb3NpdGlvbnMsIGRyYWdnaW5nSXRlbXMpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBpZiAoZW52aXJvbm1lbnQuYWN0aXZlVHJlZUlkICYmXG4gICAgICAgICAgICAoKF9hID0gZW52aXJvbm1lbnQudmlld1N0YXRlW2Vudmlyb25tZW50LmFjdGl2ZVRyZWVJZF0pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5mb2N1c2VkSXRlbSkgJiZcbiAgICAgICAgICAgIGVudmlyb25tZW50LmxpbmVhckl0ZW1zICYmXG4gICAgICAgICAgICBkcmFnZ2luZ0l0ZW1zKSB7XG4gICAgICAgICAgICB2YXIgZm9jdXNJdGVtXzEgPSBlbnZpcm9ubWVudC52aWV3U3RhdGVbZW52aXJvbm1lbnQuYWN0aXZlVHJlZUlkXS5mb2N1c2VkSXRlbTtcbiAgICAgICAgICAgIHZhciB0cmVlRHJhZ1Bvc2l0aW9ucyA9IGdldFZpYWJsZURyYWdQb3NpdGlvbnMoZW52aXJvbm1lbnQuYWN0aXZlVHJlZUlkLCBkcmFnZ2luZ0l0ZW1zKTtcbiAgICAgICAgICAgIHZhciBuZXdQb3MgPSB0cmVlRHJhZ1Bvc2l0aW9ucy5maW5kSW5kZXgoZnVuY3Rpb24gKHBvcykge1xuICAgICAgICAgICAgICAgIGlmIChwb3MudGFyZ2V0VHlwZSA9PT0gJ2l0ZW0nKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwb3MudGFyZ2V0SXRlbSA9PT0gZm9jdXNJdGVtXzE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChwb3MudGFyZ2V0VHlwZSA9PT0gJ2JldHdlZW4taXRlbXMnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoZW52aXJvbm1lbnQuaXRlbXNbcG9zLnBhcmVudEl0ZW1dLmNoaWxkcmVuW3Bvcy5jaGlsZEluZGV4XSA9PT1cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvY3VzSXRlbV8xKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAobmV3UG9zKSB7XG4gICAgICAgICAgICAgICAgc2V0UHJvZ3JhbW1hdGljRHJhZ0luZGV4KE1hdGgubWluKG5ld1BvcyArIDEsIHRyZWVEcmFnUG9zaXRpb25zLmxlbmd0aCAtIDEpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHNldFByb2dyYW1tYXRpY0RyYWdJbmRleCgwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHNldFByb2dyYW1tYXRpY0RyYWdJbmRleCgwKTtcbiAgICAgICAgfVxuICAgIH0sIFtcbiAgICAgICAgZW52aXJvbm1lbnQuYWN0aXZlVHJlZUlkLFxuICAgICAgICBlbnZpcm9ubWVudC5pdGVtcyxcbiAgICAgICAgZW52aXJvbm1lbnQubGluZWFySXRlbXMsXG4gICAgICAgIGVudmlyb25tZW50LnZpZXdTdGF0ZSxcbiAgICAgICAgZ2V0VmlhYmxlRHJhZ1Bvc2l0aW9ucyxcbiAgICBdKTtcbiAgICB2YXIgcmVzZXRTdGF0ZSA9IHVzZVN0YWJsZUhhbmRsZXIoZnVuY3Rpb24gKCkge1xuICAgICAgICBzZXRJc1Byb2dyYW1tYXRpY2FsbHlEcmFnZ2luZyhmYWxzZSk7XG4gICAgICAgIHNldFZpYWJsZURyYWdQb3NpdGlvbnMoe30pO1xuICAgICAgICBzZXRQcm9ncmFtbWF0aWNEcmFnSW5kZXgoMCk7XG4gICAgICAgIHNldERyYWdnaW5nUG9zaXRpb24odW5kZWZpbmVkKTtcbiAgICAgICAgcmVzZXREcmFnZ2luZ1Bvc2l0aW9uKCk7XG4gICAgfSk7XG4gICAgdXNlU2lkZUVmZmVjdChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChlbnZpcm9ubWVudC5hY3RpdmVUcmVlSWQgJiZcbiAgICAgICAgICAgIGVudmlyb25tZW50LmxpbmVhckl0ZW1zW2Vudmlyb25tZW50LmFjdGl2ZVRyZWVJZF0gJiZcbiAgICAgICAgICAgIHZpYWJsZURyYWdQb3NpdGlvbnNbZW52aXJvbm1lbnQuYWN0aXZlVHJlZUlkXSkge1xuICAgICAgICAgICAgcmVzZXRQcm9ncmFtbWF0aWNEcmFnSW5kZXhGb3JDdXJyZW50VHJlZSh2aWFibGVEcmFnUG9zaXRpb25zW2Vudmlyb25tZW50LmFjdGl2ZVRyZWVJZF0sIGRyYWdnaW5nSXRlbXMpO1xuICAgICAgICB9XG4gICAgfSwgW1xuICAgICAgICBkcmFnZ2luZ0l0ZW1zLFxuICAgICAgICBlbnZpcm9ubWVudC5hY3RpdmVUcmVlSWQsXG4gICAgICAgIGVudmlyb25tZW50LmxpbmVhckl0ZW1zLFxuICAgICAgICByZXNldFByb2dyYW1tYXRpY0RyYWdJbmRleEZvckN1cnJlbnRUcmVlLFxuICAgICAgICB2aWFibGVEcmFnUG9zaXRpb25zLFxuICAgIF0sIFtlbnZpcm9ubWVudC5hY3RpdmVUcmVlSWRdKTtcbiAgICB1c2VTaWRlRWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGlzUHJvZ3JhbW1hdGljYWxseURyYWdnaW5nICYmIGVudmlyb25tZW50LmFjdGl2ZVRyZWVJZCkge1xuICAgICAgICAgICAgc2V0RHJhZ2dpbmdQb3NpdGlvbih2aWFibGVEcmFnUG9zaXRpb25zW2Vudmlyb25tZW50LmFjdGl2ZVRyZWVJZF1bcHJvZ3JhbW1hdGljRHJhZ0luZGV4XSk7XG4gICAgICAgIH1cbiAgICB9LCBbXG4gICAgICAgIHByb2dyYW1tYXRpY0RyYWdJbmRleCxcbiAgICAgICAgZW52aXJvbm1lbnQuYWN0aXZlVHJlZUlkLFxuICAgICAgICBpc1Byb2dyYW1tYXRpY2FsbHlEcmFnZ2luZyxcbiAgICAgICAgdmlhYmxlRHJhZ1Bvc2l0aW9ucyxcbiAgICBdLCBbcHJvZ3JhbW1hdGljRHJhZ0luZGV4LCBlbnZpcm9ubWVudC5hY3RpdmVUcmVlSWRdKTtcbiAgICB2YXIgY2FuRHJvcEF0ID0gdXNlQ2FuRHJvcEF0KCk7XG4gICAgdmFyIHBlcmZvcm1EcmFnID0gZnVuY3Rpb24gKGRyYWdnaW5nUG9zaXRpb24pIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBpZiAoZHJhZ2dpbmdJdGVtcyAmJiAhY2FuRHJvcEF0KGRyYWdnaW5nUG9zaXRpb24sIGRyYWdnaW5nSXRlbXMpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgc2V0RHJhZ2dpbmdQb3NpdGlvbihkcmFnZ2luZ1Bvc2l0aW9uKTtcbiAgICAgICAgZW52aXJvbm1lbnQuc2V0QWN0aXZlVHJlZShkcmFnZ2luZ1Bvc2l0aW9uLnRyZWVJZCk7XG4gICAgICAgIGlmIChkcmFnZ2luZ0l0ZW1zICYmIGVudmlyb25tZW50LmFjdGl2ZVRyZWVJZCAhPT0gZHJhZ2dpbmdQb3NpdGlvbi50cmVlSWQpIHtcbiAgICAgICAgICAgIC8vIFRPRE8gbWF5YmUgZG8gb25seSBpZiBkcmFnZ2luZ0l0ZW1zIGFyZSBkaWZmZXJlbnQgdG8gc2VsZWN0ZWRJdGVtc1xuICAgICAgICAgICAgKF9hID0gZW52aXJvbm1lbnQub25TZWxlY3RJdGVtcykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmNhbGwoZW52aXJvbm1lbnQsIGRyYWdnaW5nSXRlbXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7IHJldHVybiBpdGVtLmluZGV4OyB9KSwgZHJhZ2dpbmdQb3NpdGlvbi50cmVlSWQpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICB2YXIgb25EcmFnT3ZlclRyZWVIYW5kbGVyID0gdXNlU3RhYmxlSGFuZGxlcihmdW5jdGlvbiAoZSwgdHJlZUlkLCBjb250YWluZXJSZWYpIHtcbiAgICAgICAgaWYgKCFkcmFnZ2luZ0l0ZW1zKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB2YXIgbmV3RHJhZ2dpbmdQb3NpdGlvbiA9IGdldERyYWdnaW5nUG9zaXRpb24oZSwgdHJlZUlkLCBjb250YWluZXJSZWYpO1xuICAgICAgICBpZiAoIW5ld0RyYWdnaW5nUG9zaXRpb24pXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGlmIChuZXdEcmFnZ2luZ1Bvc2l0aW9uID09PSAnaW52YWxpZCcpIHtcbiAgICAgICAgICAgIHNldERyYWdnaW5nUG9zaXRpb24odW5kZWZpbmVkKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBwZXJmb3JtRHJhZyhuZXdEcmFnZ2luZ1Bvc2l0aW9uKTtcbiAgICB9KTtcbiAgICB2YXIgb25EcmFnTGVhdmVDb250YWluZXJIYW5kbGVyID0gdXNlU3RhYmxlSGFuZGxlcihmdW5jdGlvbiAoZSwgY29udGFpbmVyUmVmKSB7XG4gICAgICAgIGlmICghY29udGFpbmVyUmVmLmN1cnJlbnQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGlmIChpc091dHNpZGVPZkNvbnRhaW5lcihlLCBjb250YWluZXJSZWYuY3VycmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSkpIHtcbiAgICAgICAgICAgIHNldERyYWdnaW5nUG9zaXRpb24odW5kZWZpbmVkKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHZhciBvbkRyb3BIYW5kbGVyID0gdXNlU3RhYmxlSGFuZGxlcihmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghZHJhZ2dpbmdJdGVtcyB8fCAhZHJhZ2dpbmdQb3NpdGlvbiB8fCAhZW52aXJvbm1lbnQub25Ecm9wKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZW52aXJvbm1lbnQub25Ecm9wKGRyYWdnaW5nSXRlbXMsIGRyYWdnaW5nUG9zaXRpb24pO1xuICAgICAgICBjYWxsU29vbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICAoX2EgPSBlbnZpcm9ubWVudC5vbkZvY3VzSXRlbSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmNhbGwoZW52aXJvbm1lbnQsIGRyYWdnaW5nSXRlbXNbMF0sIGRyYWdnaW5nUG9zaXRpb24udHJlZUlkKTtcbiAgICAgICAgICAgIHJlc2V0U3RhdGUoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgdmFyIG9uU3RhcnREcmFnZ2luZ0l0ZW1zID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKGl0ZW1zLCB0cmVlSWQpIHtcbiAgICAgICAgdmFyIHRyZWVWaWFibGVEcmFnUG9zaXRpb25zID0gYnVpbGRNYXBGb3JUcmVlcyhlbnZpcm9ubWVudC50cmVlSWRzLCBmdW5jdGlvbiAodHJlZUlkKSB7IHJldHVybiBnZXRWaWFibGVEcmFnUG9zaXRpb25zKHRyZWVJZCwgaXRlbXMpOyB9KTtcbiAgICAgICAgaW5pdGlhdGVEcmFnZ2luZ1Bvc2l0aW9uKHRyZWVJZCwgaXRlbXMpO1xuICAgICAgICAvLyBUT0RPIHdoYXQgaWYgdHJlZXMgaGF2ZSBkaWZmZXJlbnQgaGVpZ2h0cyBhbmQgZHJhZyB0YXJnZXQgY2hhbmdlcz9cbiAgICAgICAgc2V0VmlhYmxlRHJhZ1Bvc2l0aW9ucyh0cmVlVmlhYmxlRHJhZ1Bvc2l0aW9ucyk7XG4gICAgICAgIGlmIChlbnZpcm9ubWVudC5hY3RpdmVUcmVlSWQpIHtcbiAgICAgICAgICAgIHJlc2V0UHJvZ3JhbW1hdGljRHJhZ0luZGV4Rm9yQ3VycmVudFRyZWUodHJlZVZpYWJsZURyYWdQb3NpdGlvbnNbZW52aXJvbm1lbnQuYWN0aXZlVHJlZUlkXSwgaXRlbXMpO1xuICAgICAgICB9XG4gICAgfSwgW1xuICAgICAgICBlbnZpcm9ubWVudC5hY3RpdmVUcmVlSWQsXG4gICAgICAgIGVudmlyb25tZW50LnRyZWVJZHMsXG4gICAgICAgIGdldFZpYWJsZURyYWdQb3NpdGlvbnMsXG4gICAgICAgIGluaXRpYXRlRHJhZ2dpbmdQb3NpdGlvbixcbiAgICAgICAgcmVzZXRQcm9ncmFtbWF0aWNEcmFnSW5kZXhGb3JDdXJyZW50VHJlZSxcbiAgICBdKTtcbiAgICB2YXIgc3RhcnRQcm9ncmFtbWF0aWNEcmFnID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX2EsIF9iLCBfYztcbiAgICAgICAgaWYgKCFlbnZpcm9ubWVudC5jYW5EcmFnQW5kRHJvcCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbnZpcm9ubWVudC5hY3RpdmVUcmVlSWQpIHtcbiAgICAgICAgICAgIHZhciBkcmFnZ2luZ0l0ZW1zXzEgPSAoX2IgPSAoX2EgPSBlbnZpcm9ubWVudC52aWV3U3RhdGVbZW52aXJvbm1lbnQuYWN0aXZlVHJlZUlkXSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnNlbGVjdGVkSXRlbXMpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IFtcbiAgICAgICAgICAgICAgICAoX2MgPSBlbnZpcm9ubWVudC52aWV3U3RhdGVbZW52aXJvbm1lbnQuYWN0aXZlVHJlZUlkXSkgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLmZvY3VzZWRJdGVtLFxuICAgICAgICAgICAgXTtcbiAgICAgICAgICAgIGlmIChkcmFnZ2luZ0l0ZW1zXzEubGVuZ3RoID09PSAwIHx8IGRyYWdnaW5nSXRlbXNfMVswXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHJlc29sdmVkRHJhZ2dpbmdJdGVtcyA9IGdldE9yaWdpbmFsSXRlbU9yZGVyKGVudmlyb25tZW50LmFjdGl2ZVRyZWVJZCwgZHJhZ2dpbmdJdGVtc18xLm1hcChmdW5jdGlvbiAoaWQpIHsgcmV0dXJuIGVudmlyb25tZW50Lml0ZW1zW2lkXTsgfSkpO1xuICAgICAgICAgICAgaWYgKGVudmlyb25tZW50LmNhbkRyYWcgJiYgIWVudmlyb25tZW50LmNhbkRyYWcocmVzb2x2ZWREcmFnZ2luZ0l0ZW1zKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9uU3RhcnREcmFnZ2luZ0l0ZW1zKHJlc29sdmVkRHJhZ2dpbmdJdGVtcywgZW52aXJvbm1lbnQuYWN0aXZlVHJlZUlkKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNldElzUHJvZ3JhbW1hdGljYWxseURyYWdnaW5nKHRydWUpO1xuICAgICAgICAgICAgICAgIC8vIE5lZWRzIHRvIGJlIGRvbmUgYWZ0ZXIgb25TdGFydERyYWdnaW5nSXRlbXMgd2FzIGNhbGxlZCwgc28gdGhhdCB2aWFibGVEcmFnUG9zaXRpb25zIGlzIHBvcHVsYXRlZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LCBbZW52aXJvbm1lbnQsIGdldE9yaWdpbmFsSXRlbU9yZGVyLCBvblN0YXJ0RHJhZ2dpbmdJdGVtc10pO1xuICAgIHZhciBhYm9ydFByb2dyYW1tYXRpY0RyYWcgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJlc2V0U3RhdGUoKTtcbiAgICB9LCBbcmVzZXRTdGF0ZV0pO1xuICAgIHZhciBjb21wbGV0ZVByb2dyYW1tYXRpY0RyYWcgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIG9uRHJvcEhhbmRsZXIoKTtcbiAgICAgICAgcmVzZXRTdGF0ZSgpO1xuICAgIH0sIFtvbkRyb3BIYW5kbGVyLCByZXNldFN0YXRlXSk7XG4gICAgdmFyIHByb2dyYW1tYXRpY0RyYWdVcCA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2V0UHJvZ3JhbW1hdGljRHJhZ0luZGV4KGZ1bmN0aW9uIChvbGRJbmRleCkgeyByZXR1cm4gTWF0aC5tYXgoMCwgb2xkSW5kZXggLSAxKTsgfSk7XG4gICAgfSwgW10pO1xuICAgIHZhciBwcm9ncmFtbWF0aWNEcmFnRG93biA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGVudmlyb25tZW50LmFjdGl2ZVRyZWVJZCkge1xuICAgICAgICAgICAgc2V0UHJvZ3JhbW1hdGljRHJhZ0luZGV4KGZ1bmN0aW9uIChvbGRJbmRleCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLm1pbih2aWFibGVEcmFnUG9zaXRpb25zW2Vudmlyb25tZW50LmFjdGl2ZVRyZWVJZF0ubGVuZ3RoLCBvbGRJbmRleCArIDEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LCBbZW52aXJvbm1lbnQuYWN0aXZlVHJlZUlkLCB2aWFibGVEcmFnUG9zaXRpb25zXSk7XG4gICAgdmFyIGRuZCA9IHVzZU1lbW8oZnVuY3Rpb24gKCkgeyByZXR1cm4gKHtcbiAgICAgICAgb25TdGFydERyYWdnaW5nSXRlbXM6IG9uU3RhcnREcmFnZ2luZ0l0ZW1zLFxuICAgICAgICBzdGFydFByb2dyYW1tYXRpY0RyYWc6IHN0YXJ0UHJvZ3JhbW1hdGljRHJhZyxcbiAgICAgICAgYWJvcnRQcm9ncmFtbWF0aWNEcmFnOiBhYm9ydFByb2dyYW1tYXRpY0RyYWcsXG4gICAgICAgIGNvbXBsZXRlUHJvZ3JhbW1hdGljRHJhZzogY29tcGxldGVQcm9ncmFtbWF0aWNEcmFnLFxuICAgICAgICBwcm9ncmFtbWF0aWNEcmFnVXA6IHByb2dyYW1tYXRpY0RyYWdVcCxcbiAgICAgICAgcHJvZ3JhbW1hdGljRHJhZ0Rvd246IHByb2dyYW1tYXRpY0RyYWdEb3duLFxuICAgICAgICBkcmFnZ2luZ0l0ZW1zOiBkcmFnZ2luZ0l0ZW1zLFxuICAgICAgICBkcmFnZ2luZ1Bvc2l0aW9uOiBkcmFnZ2luZ1Bvc2l0aW9uLFxuICAgICAgICBpdGVtSGVpZ2h0OiBpdGVtSGVpZ2h0LmN1cnJlbnQsXG4gICAgICAgIGlzUHJvZ3JhbW1hdGljYWxseURyYWdnaW5nOiBpc1Byb2dyYW1tYXRpY2FsbHlEcmFnZ2luZyxcbiAgICAgICAgb25EcmFnT3ZlclRyZWVIYW5kbGVyOiBvbkRyYWdPdmVyVHJlZUhhbmRsZXIsXG4gICAgICAgIG9uRHJhZ0xlYXZlQ29udGFpbmVySGFuZGxlcjogb25EcmFnTGVhdmVDb250YWluZXJIYW5kbGVyLFxuICAgICAgICB2aWFibGVEcmFnUG9zaXRpb25zOiB2aWFibGVEcmFnUG9zaXRpb25zLFxuICAgIH0pOyB9LCBbXG4gICAgICAgIGFib3J0UHJvZ3JhbW1hdGljRHJhZyxcbiAgICAgICAgY29tcGxldGVQcm9ncmFtbWF0aWNEcmFnLFxuICAgICAgICBkcmFnZ2luZ0l0ZW1zLFxuICAgICAgICBkcmFnZ2luZ1Bvc2l0aW9uLFxuICAgICAgICBpc1Byb2dyYW1tYXRpY2FsbHlEcmFnZ2luZyxcbiAgICAgICAgaXRlbUhlaWdodCxcbiAgICAgICAgb25EcmFnT3ZlclRyZWVIYW5kbGVyLFxuICAgICAgICBvbkRyYWdMZWF2ZUNvbnRhaW5lckhhbmRsZXIsXG4gICAgICAgIG9uU3RhcnREcmFnZ2luZ0l0ZW1zLFxuICAgICAgICBwcm9ncmFtbWF0aWNEcmFnRG93bixcbiAgICAgICAgcHJvZ3JhbW1hdGljRHJhZ1VwLFxuICAgICAgICBzdGFydFByb2dyYW1tYXRpY0RyYWcsXG4gICAgICAgIHZpYWJsZURyYWdQb3NpdGlvbnMsXG4gICAgXSk7XG4gICAgdXNlRWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdlbmQnLCByZXNldFN0YXRlKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCBvbkRyb3BIYW5kbGVyKTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdkcmFnZW5kJywgcmVzZXRTdGF0ZSk7XG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignZHJvcCcsIG9uRHJvcEhhbmRsZXIpO1xuICAgICAgICB9O1xuICAgIH0sIFtvbkRyb3BIYW5kbGVyLCByZXNldFN0YXRlXSk7XG4gICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KERyYWdBbmREcm9wQ29udGV4dC5Qcm92aWRlciwgeyB2YWx1ZTogZG5kIH0sIGNoaWxkcmVuKSk7XG59O1xuIiwidmFyIF9fYXNzaWduID0gKHRoaXMgJiYgdGhpcy5fX2Fzc2lnbikgfHwgZnVuY3Rpb24gKCkge1xuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0KSB7XG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSlcbiAgICAgICAgICAgICAgICB0W3BdID0gc1twXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdDtcbiAgICB9O1xuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcbmltcG9ydCB7IHVzZUltcGVyYXRpdmVIYW5kbGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VUcmVlRW52aXJvbm1lbnQgfSBmcm9tICcuLi9jb250cm9sbGVkRW52aXJvbm1lbnQvQ29udHJvbGxlZFRyZWVFbnZpcm9ubWVudCc7XG5pbXBvcnQgeyB1c2VEcmFnQW5kRHJvcCB9IGZyb20gJy4uL2RyYWcvRHJhZ0FuZERyb3BQcm92aWRlcic7XG5leHBvcnQgdmFyIHVzZUNyZWF0ZWRFbnZpcm9ubWVudFJlZiA9IGZ1bmN0aW9uIChyZWYsIGFjdGlvbnMpIHtcbiAgICB2YXIgZW52aXJvbm1lbnQgPSB1c2VUcmVlRW52aXJvbm1lbnQoKTtcbiAgICB2YXIgZG5kID0gdXNlRHJhZ0FuZERyb3AoKTtcbiAgICB1c2VJbXBlcmF0aXZlSGFuZGxlKHJlZiwgZnVuY3Rpb24gKCkgeyByZXR1cm4gKF9fYXNzaWduKF9fYXNzaWduKF9fYXNzaWduKHt9LCBhY3Rpb25zKSwgZW52aXJvbm1lbnQpLCB7IHRyZWVFbnZpcm9ubWVudENvbnRleHQ6IGVudmlyb25tZW50LCBkcmFnQW5kRHJvcENvbnRleHQ6IGRuZCB9KSk7IH0pO1xufTtcbiIsImV4cG9ydCB2YXIgd2FpdEZvciA9IGZ1bmN0aW9uIChjaGVjaywgaW50ZXJ2YWxNcywgdGltZW91dE1zKSB7XG4gICAgaWYgKGludGVydmFsTXMgPT09IHZvaWQgMCkgeyBpbnRlcnZhbE1zID0gNTA7IH1cbiAgICBpZiAodGltZW91dE1zID09PSB2b2lkIDApIHsgdGltZW91dE1zID0gMTAwMDA7IH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcbiAgICAgICAgaWYgKGNoZWNrKCkpIHtcbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgY29tcGxldGU7XG4gICAgICAgIHZhciBpbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChjaGVjaygpKSB7XG4gICAgICAgICAgICAgICAgY29tcGxldGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgaW50ZXJ2YWxNcyk7XG4gICAgICAgIHZhciB0aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb21wbGV0ZSgpO1xuICAgICAgICB9LCB0aW1lb3V0TXMpO1xuICAgICAgICBjb21wbGV0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9O1xuICAgIH0pO1xufTtcbiIsInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xudmFyIF9fZ2VuZXJhdG9yID0gKHRoaXMgJiYgdGhpcy5fX2dlbmVyYXRvcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIGJvZHkpIHtcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xuICAgICAgICB3aGlsZSAoZyAmJiAoZyA9IDAsIG9wWzBdICYmIChfID0gMCkpLCBfKSB0cnkge1xuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XG4gICAgfVxufTtcbnZhciBfX3NwcmVhZEFycmF5ID0gKHRoaXMgJiYgdGhpcy5fX3NwcmVhZEFycmF5KSB8fCBmdW5jdGlvbiAodG8sIGZyb20sIHBhY2spIHtcbiAgICBpZiAocGFjayB8fCBhcmd1bWVudHMubGVuZ3RoID09PSAyKSBmb3IgKHZhciBpID0gMCwgbCA9IGZyb20ubGVuZ3RoLCBhcjsgaSA8IGw7IGkrKykge1xuICAgICAgICBpZiAoYXIgfHwgIShpIGluIGZyb20pKSB7XG4gICAgICAgICAgICBpZiAoIWFyKSBhciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20sIDAsIGkpO1xuICAgICAgICAgICAgYXJbaV0gPSBmcm9tW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0by5jb25jYXQoYXIgfHwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSkpO1xufTtcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VNZW1vIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlRHJhZ0FuZERyb3AgfSBmcm9tICcuLi9kcmFnL0RyYWdBbmREcm9wUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlVHJlZUVudmlyb25tZW50IH0gZnJvbSAnLi4vY29udHJvbGxlZEVudmlyb25tZW50L0NvbnRyb2xsZWRUcmVlRW52aXJvbm1lbnQnO1xuaW1wb3J0IHsgdXNlQ3JlYXRlZEVudmlyb25tZW50UmVmIH0gZnJvbSAnLi91c2VDcmVhdGVkRW52aXJvbm1lbnRSZWYnO1xuaW1wb3J0IHsgdXNlUmVmQ29weSB9IGZyb20gJy4uL3VzZVJlZkNvcHknO1xuaW1wb3J0IHsgd2FpdEZvciB9IGZyb20gJy4uL3dhaXRGb3InO1xudmFyIEVudmlyb25tZW50QWN0aW9uc0NvbnRleHQgPSBSZWFjdC5jcmVhdGVDb250ZXh0KG51bGwpO1xuZXhwb3J0IHZhciB1c2VFbnZpcm9ubWVudEFjdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFJlYWN0LnVzZUNvbnRleHQoRW52aXJvbm1lbnRBY3Rpb25zQ29udGV4dCk7XG59O1xudmFyIHJlY3Vyc2l2ZUV4cGFuZCA9IGZ1bmN0aW9uIChpdGVtSWQsIGl0ZW1zLCBvbkV4cGFuZCkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgX2xvb3BfMSwgX2ksIF9hLCBjaGlsZElkO1xuICAgIHZhciBfYiwgX2MsIF9kO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2UpIHtcbiAgICAgICAgX2xvb3BfMSA9IGZ1bmN0aW9uIChjaGlsZElkKSB7XG4gICAgICAgICAgICB3YWl0Rm9yKGZ1bmN0aW9uICgpIHsgdmFyIF9hOyByZXR1cm4gISEoKF9hID0gaXRlbXMuY3VycmVudCkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hW2NoaWxkSWRdKTsgfSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgICAgIHZhciBpdGVtID0gKF9hID0gaXRlbXMuY3VycmVudCkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hW2NoaWxkSWRdO1xuICAgICAgICAgICAgICAgIGlmIChpdGVtID09PSBudWxsIHx8IGl0ZW0gPT09IHZvaWQgMCA/IHZvaWQgMCA6IGl0ZW0uaXNGb2xkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgb25FeHBhbmQoaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgIHJlY3Vyc2l2ZUV4cGFuZChjaGlsZElkLCBpdGVtcywgb25FeHBhbmQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBmb3IgKF9pID0gMCwgX2EgPSAoX2QgPSAoX2MgPSAoX2IgPSBpdGVtcy5jdXJyZW50KSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2JbaXRlbUlkXSkgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLmNoaWxkcmVuKSAhPT0gbnVsbCAmJiBfZCAhPT0gdm9pZCAwID8gX2QgOiBbXTsgX2kgPCBfYS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIGNoaWxkSWQgPSBfYVtfaV07XG4gICAgICAgICAgICBfbG9vcF8xKGNoaWxkSWQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0IHZhciBFbnZpcm9ubWVudEFjdGlvbnNQcm92aWRlciA9IFJlYWN0LmZvcndhcmRSZWYoZnVuY3Rpb24gKHByb3BzLCByZWYpIHtcbiAgICB2YXIgX2EgPSB1c2VUcmVlRW52aXJvbm1lbnQoKSwgb25Db2xsYXBzZUl0ZW0gPSBfYS5vbkNvbGxhcHNlSXRlbSwgaXRlbXMgPSBfYS5pdGVtcywgdHJlZXMgPSBfYS50cmVlcywgdmlld1N0YXRlID0gX2Eudmlld1N0YXRlLCBvbkV4cGFuZEl0ZW0gPSBfYS5vbkV4cGFuZEl0ZW0sIG9uRm9jdXNJdGVtID0gX2Eub25Gb2N1c0l0ZW0sIHNldEFjdGl2ZVRyZWUgPSBfYS5zZXRBY3RpdmVUcmVlLCBvblJlbmFtZUl0ZW0gPSBfYS5vblJlbmFtZUl0ZW0sIG9uU2VsZWN0SXRlbXMgPSBfYS5vblNlbGVjdEl0ZW1zLCBvblByaW1hcnlBY3Rpb24gPSBfYS5vblByaW1hcnlBY3Rpb24sIGxpbmVhckl0ZW1zID0gX2EubGluZWFySXRlbXM7XG4gICAgdmFyIF9iID0gdXNlRHJhZ0FuZERyb3AoKSwgYWJvcnRQcm9ncmFtbWF0aWNEcmFnID0gX2IuYWJvcnRQcm9ncmFtbWF0aWNEcmFnLCBjb21wbGV0ZVByb2dyYW1tYXRpY0RyYWcgPSBfYi5jb21wbGV0ZVByb2dyYW1tYXRpY0RyYWcsIHByb2dyYW1tYXRpY0RyYWdEb3duID0gX2IucHJvZ3JhbW1hdGljRHJhZ0Rvd24sIHByb2dyYW1tYXRpY0RyYWdVcCA9IF9iLnByb2dyYW1tYXRpY0RyYWdVcCwgc3RhcnRQcm9ncmFtbWF0aWNEcmFnID0gX2Iuc3RhcnRQcm9ncmFtbWF0aWNEcmFnO1xuICAgIHZhciBpdGVtc1JlZiA9IHVzZVJlZkNvcHkoaXRlbXMpO1xuICAgIC8vIFRPRE8gcmVwbGFjZSBjYWxsYmFja3Mgd2l0aCBzdGFibGUgaGFuZGxlcnNcbiAgICB2YXIgY29sbGFwc2VJdGVtID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKGl0ZW1JZCwgdHJlZUlkKSB7XG4gICAgICAgIG9uQ29sbGFwc2VJdGVtID09PSBudWxsIHx8IG9uQ29sbGFwc2VJdGVtID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvbkNvbGxhcHNlSXRlbShpdGVtc1tpdGVtSWRdLCB0cmVlSWQpO1xuICAgIH0sIFtpdGVtcywgb25Db2xsYXBzZUl0ZW1dKTtcbiAgICB2YXIgZXhwYW5kSXRlbSA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uIChpdGVtSWQsIHRyZWVJZCkge1xuICAgICAgICBvbkV4cGFuZEl0ZW0gPT09IG51bGwgfHwgb25FeHBhbmRJdGVtID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvbkV4cGFuZEl0ZW0oaXRlbXNbaXRlbUlkXSwgdHJlZUlkKTtcbiAgICB9LCBbaXRlbXMsIG9uRXhwYW5kSXRlbV0pO1xuICAgIHZhciBmb2N1c0l0ZW0gPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoaXRlbUlkLCB0cmVlSWQsIHNldERvbUZvY3VzKSB7XG4gICAgICAgIGlmIChzZXREb21Gb2N1cyA9PT0gdm9pZCAwKSB7IHNldERvbUZvY3VzID0gdHJ1ZTsgfVxuICAgICAgICBvbkZvY3VzSXRlbSA9PT0gbnVsbCB8fCBvbkZvY3VzSXRlbSA9PT0gdm9pZCAwID8gdm9pZCAwIDogb25Gb2N1c0l0ZW0oaXRlbXNbaXRlbUlkXSwgdHJlZUlkLCBzZXREb21Gb2N1cyk7XG4gICAgfSwgW2l0ZW1zLCBvbkZvY3VzSXRlbV0pO1xuICAgIHZhciBmb2N1c1RyZWUgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAodHJlZUlkLCBhdXRvRm9jdXMpIHtcbiAgICAgICAgaWYgKGF1dG9Gb2N1cyA9PT0gdm9pZCAwKSB7IGF1dG9Gb2N1cyA9IHRydWU7IH1cbiAgICAgICAgc2V0QWN0aXZlVHJlZSh0cmVlSWQsIGF1dG9Gb2N1cyk7XG4gICAgfSwgW3NldEFjdGl2ZVRyZWVdKTtcbiAgICB2YXIgbW92ZUZvY3VzRG93biA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uICh0cmVlSWQpIHtcbiAgICAgICAgdmFyIHRyZWVMaW5lYXJJdGVtcyA9IGxpbmVhckl0ZW1zW3RyZWVJZF07XG4gICAgICAgIHZhciBjdXJyZW50Rm9jdXNJbmRleCA9IHRyZWVMaW5lYXJJdGVtcy5maW5kSW5kZXgoZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICB2YXIgX2I7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IF9hLml0ZW07XG4gICAgICAgICAgICByZXR1cm4gaXRlbSA9PT0gKChfYiA9IHZpZXdTdGF0ZVt0cmVlSWRdKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuZm9jdXNlZEl0ZW0pO1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIG5ld0luZGV4ID0gY3VycmVudEZvY3VzSW5kZXggIT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgPyBNYXRoLm1pbih0cmVlTGluZWFySXRlbXMubGVuZ3RoIC0gMSwgY3VycmVudEZvY3VzSW5kZXggKyAxKVxuICAgICAgICAgICAgOiAwO1xuICAgICAgICB2YXIgbmV3SXRlbSA9IGl0ZW1zW3RyZWVMaW5lYXJJdGVtc1tuZXdJbmRleF0uaXRlbV07XG4gICAgICAgIG9uRm9jdXNJdGVtID09PSBudWxsIHx8IG9uRm9jdXNJdGVtID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvbkZvY3VzSXRlbShuZXdJdGVtLCB0cmVlSWQpO1xuICAgIH0sIFtpdGVtcywgbGluZWFySXRlbXMsIG9uRm9jdXNJdGVtLCB2aWV3U3RhdGVdKTtcbiAgICB2YXIgbW92ZUZvY3VzVXAgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAodHJlZUlkKSB7XG4gICAgICAgIHZhciB0cmVlTGluZWFySXRlbXMgPSBsaW5lYXJJdGVtc1t0cmVlSWRdO1xuICAgICAgICB2YXIgY3VycmVudEZvY3VzSW5kZXggPSB0cmVlTGluZWFySXRlbXMuZmluZEluZGV4KGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgdmFyIF9iO1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSBfYS5pdGVtO1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW0gPT09ICgoX2IgPSB2aWV3U3RhdGVbdHJlZUlkXSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmZvY3VzZWRJdGVtKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBuZXdJbmRleCA9IGN1cnJlbnRGb2N1c0luZGV4ICE9PSB1bmRlZmluZWRcbiAgICAgICAgICAgID8gTWF0aC5tYXgoMCwgY3VycmVudEZvY3VzSW5kZXggLSAxKVxuICAgICAgICAgICAgOiAwO1xuICAgICAgICB2YXIgbmV3SXRlbSA9IGl0ZW1zW3RyZWVMaW5lYXJJdGVtc1tuZXdJbmRleF0uaXRlbV07XG4gICAgICAgIG9uRm9jdXNJdGVtID09PSBudWxsIHx8IG9uRm9jdXNJdGVtID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvbkZvY3VzSXRlbShuZXdJdGVtLCB0cmVlSWQpO1xuICAgIH0sIFtpdGVtcywgbGluZWFySXRlbXMsIG9uRm9jdXNJdGVtLCB2aWV3U3RhdGVdKTtcbiAgICB2YXIgcmVuYW1lSXRlbSA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uIChpdGVtSWQsIG5hbWUsIHRyZWVJZCkge1xuICAgICAgICBvblJlbmFtZUl0ZW0gPT09IG51bGwgfHwgb25SZW5hbWVJdGVtID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvblJlbmFtZUl0ZW0oaXRlbXNbaXRlbUlkXSwgbmFtZSwgdHJlZUlkKTtcbiAgICB9LCBbaXRlbXMsIG9uUmVuYW1lSXRlbV0pO1xuICAgIHZhciBzZWxlY3RJdGVtcyA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uIChpdGVtc0lkcywgdHJlZUlkKSB7XG4gICAgICAgIG9uU2VsZWN0SXRlbXMgPT09IG51bGwgfHwgb25TZWxlY3RJdGVtcyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb25TZWxlY3RJdGVtcyhpdGVtc0lkcywgdHJlZUlkKTtcbiAgICB9LCBbb25TZWxlY3RJdGVtc10pO1xuICAgIHZhciB0b2dnbGVJdGVtRXhwYW5kZWRTdGF0ZSA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uIChpdGVtSWQsIHRyZWVJZCkge1xuICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICBpZiAoKF9iID0gKF9hID0gdmlld1N0YXRlW3RyZWVJZF0pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5leHBhbmRlZEl0ZW1zKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuaW5jbHVkZXMoaXRlbUlkKSkge1xuICAgICAgICAgICAgb25Db2xsYXBzZUl0ZW0gPT09IG51bGwgfHwgb25Db2xsYXBzZUl0ZW0gPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9uQ29sbGFwc2VJdGVtKGl0ZW1zW2l0ZW1JZF0sIHRyZWVJZCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBvbkV4cGFuZEl0ZW0gPT09IG51bGwgfHwgb25FeHBhbmRJdGVtID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvbkV4cGFuZEl0ZW0oaXRlbXNbaXRlbUlkXSwgdHJlZUlkKTtcbiAgICAgICAgfVxuICAgIH0sIFtpdGVtcywgb25Db2xsYXBzZUl0ZW0sIG9uRXhwYW5kSXRlbSwgdmlld1N0YXRlXSk7XG4gICAgdmFyIHRvZ2dsZUl0ZW1TZWxlY3RTdGF0dXMgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoaXRlbUlkLCB0cmVlSWQpIHtcbiAgICAgICAgdmFyIF9hLCBfYiwgX2MsIF9kLCBfZTtcbiAgICAgICAgaWYgKChfYiA9IChfYSA9IHZpZXdTdGF0ZVt0cmVlSWRdKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Euc2VsZWN0ZWRJdGVtcykgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmluY2x1ZGVzKGl0ZW1JZCkpIHtcbiAgICAgICAgICAgIG9uU2VsZWN0SXRlbXMgPT09IG51bGwgfHwgb25TZWxlY3RJdGVtcyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb25TZWxlY3RJdGVtcygoX2QgPSAoX2MgPSB2aWV3U3RhdGVbdHJlZUlkXS5zZWxlY3RlZEl0ZW1zKSA9PT0gbnVsbCB8fCBfYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2MuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7IHJldHVybiBpdGVtICE9PSBpdGVtSWQ7IH0pKSAhPT0gbnVsbCAmJiBfZCAhPT0gdm9pZCAwID8gX2QgOiBbXSwgdHJlZUlkKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG9uU2VsZWN0SXRlbXMgPT09IG51bGwgfHwgb25TZWxlY3RJdGVtcyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb25TZWxlY3RJdGVtcyhfX3NwcmVhZEFycmF5KF9fc3ByZWFkQXJyYXkoW10sICgoX2UgPSB2aWV3U3RhdGVbdHJlZUlkXS5zZWxlY3RlZEl0ZW1zKSAhPT0gbnVsbCAmJiBfZSAhPT0gdm9pZCAwID8gX2UgOiBbXSksIHRydWUpLCBbaXRlbUlkXSwgZmFsc2UpLCB0cmVlSWQpO1xuICAgICAgICB9XG4gICAgfSwgW29uU2VsZWN0SXRlbXMsIHZpZXdTdGF0ZV0pO1xuICAgIHZhciBpbnZva2VQcmltYXJ5QWN0aW9uID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKGl0ZW1JZCwgdHJlZUlkKSB7XG4gICAgICAgIG9uUHJpbWFyeUFjdGlvbiA9PT0gbnVsbCB8fCBvblByaW1hcnlBY3Rpb24gPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9uUHJpbWFyeUFjdGlvbihpdGVtc1tpdGVtSWRdLCB0cmVlSWQpO1xuICAgIH0sIFtpdGVtcywgb25QcmltYXJ5QWN0aW9uXSk7XG4gICAgdmFyIGV4cGFuZFN1YnNlcXVlbnRseSA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uICh0cmVlSWQsIGl0ZW1JZHMpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjdXJyZW50LCByZXN0O1xuICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50ID0gaXRlbUlkc1swXSwgcmVzdCA9IGl0ZW1JZHMuc2xpY2UoMSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHdhaXRGb3IoZnVuY3Rpb24gKCkgeyB2YXIgX2E7IHJldHVybiAhISgoX2EgPSBpdGVtc1JlZi5jdXJyZW50KSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2FbY3VycmVudF0pOyB9KS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IGl0ZW1zUmVmLmN1cnJlbnRbY3VycmVudF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25FeHBhbmRJdGVtID09PSBudWxsIHx8IG9uRXhwYW5kSXRlbSA9PT0gdm9pZCAwID8gdm9pZCAwIDogb25FeHBhbmRJdGVtKGl0ZW0sIHRyZWVJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3QubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXhwYW5kU3Vic2VxdWVudGx5KHRyZWVJZCwgcmVzdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXTtcbiAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgIF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTsgfSwgW2l0ZW1zUmVmLCBvbkV4cGFuZEl0ZW1dKTtcbiAgICB2YXIgZXhwYW5kQWxsID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKHRyZWVJZCkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIFs0IC8qeWllbGQqLywgcmVjdXJzaXZlRXhwYW5kKHRyZWVzW3RyZWVJZF0ucm9vdEl0ZW0sIGl0ZW1zUmVmLCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9uRXhwYW5kSXRlbSA9PT0gbnVsbCB8fCBvbkV4cGFuZEl0ZW0gPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9uRXhwYW5kSXRlbShpdGVtLCB0cmVlSWQpO1xuICAgICAgICAgICAgICAgICAgICB9KV07XG4gICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7IH0sIFtpdGVtc1JlZiwgb25FeHBhbmRJdGVtLCB0cmVlc10pO1xuICAgIHZhciBjb2xsYXBzZUFsbCA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uICh0cmVlSWQpIHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBfYyA9IChfYiA9IChfYSA9IHZpZXdTdGF0ZVt0cmVlSWRdKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZXhwYW5kZWRJdGVtcykgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogW107IF9pIDwgX2MubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgaXRlbUlkID0gX2NbX2ldO1xuICAgICAgICAgICAgb25Db2xsYXBzZUl0ZW0gPT09IG51bGwgfHwgb25Db2xsYXBzZUl0ZW0gPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9uQ29sbGFwc2VJdGVtKGl0ZW1zW2l0ZW1JZF0sIHRyZWVJZCk7XG4gICAgICAgIH1cbiAgICB9LCBbaXRlbXMsIG9uQ29sbGFwc2VJdGVtLCB2aWV3U3RhdGVdKTtcbiAgICAvLyBUT0RPIGNoYW5nZSBlbnZpcm9ubWVudCBjaGlsZHMgdG8gdXNlIGFjdGlvbnMgcmF0aGVyIHRoYW4gb3V0cHV0IGV2ZW50cyB3aGVyZSBwb3NzaWJsZVxuICAgIHZhciBhY3Rpb25zID0gdXNlTWVtbyhmdW5jdGlvbiAoKSB7IHJldHVybiAoe1xuICAgICAgICBjb2xsYXBzZUl0ZW06IGNvbGxhcHNlSXRlbSxcbiAgICAgICAgZXhwYW5kSXRlbTogZXhwYW5kSXRlbSxcbiAgICAgICAgZm9jdXNJdGVtOiBmb2N1c0l0ZW0sXG4gICAgICAgIGZvY3VzVHJlZTogZm9jdXNUcmVlLFxuICAgICAgICBtb3ZlRm9jdXNEb3duOiBtb3ZlRm9jdXNEb3duLFxuICAgICAgICBtb3ZlRm9jdXNVcDogbW92ZUZvY3VzVXAsXG4gICAgICAgIHJlbmFtZUl0ZW06IHJlbmFtZUl0ZW0sXG4gICAgICAgIHNlbGVjdEl0ZW1zOiBzZWxlY3RJdGVtcyxcbiAgICAgICAgdG9nZ2xlSXRlbUV4cGFuZGVkU3RhdGU6IHRvZ2dsZUl0ZW1FeHBhbmRlZFN0YXRlLFxuICAgICAgICB0b2dnbGVJdGVtU2VsZWN0U3RhdHVzOiB0b2dnbGVJdGVtU2VsZWN0U3RhdHVzLFxuICAgICAgICBpbnZva2VQcmltYXJ5QWN0aW9uOiBpbnZva2VQcmltYXJ5QWN0aW9uLFxuICAgICAgICBleHBhbmRBbGw6IGV4cGFuZEFsbCxcbiAgICAgICAgZXhwYW5kU3Vic2VxdWVudGx5OiBleHBhbmRTdWJzZXF1ZW50bHksXG4gICAgICAgIGNvbGxhcHNlQWxsOiBjb2xsYXBzZUFsbCxcbiAgICAgICAgYWJvcnRQcm9ncmFtbWF0aWNEcmFnOiBhYm9ydFByb2dyYW1tYXRpY0RyYWcsXG4gICAgICAgIGNvbXBsZXRlUHJvZ3JhbW1hdGljRHJhZzogY29tcGxldGVQcm9ncmFtbWF0aWNEcmFnLFxuICAgICAgICBtb3ZlUHJvZ3JhbW1hdGljRHJhZ1Bvc2l0aW9uRG93bjogcHJvZ3JhbW1hdGljRHJhZ0Rvd24sXG4gICAgICAgIG1vdmVQcm9ncmFtbWF0aWNEcmFnUG9zaXRpb25VcDogcHJvZ3JhbW1hdGljRHJhZ1VwLFxuICAgICAgICBzdGFydFByb2dyYW1tYXRpY0RyYWc6IHN0YXJ0UHJvZ3JhbW1hdGljRHJhZyxcbiAgICB9KTsgfSwgW1xuICAgICAgICBjb2xsYXBzZUl0ZW0sXG4gICAgICAgIGV4cGFuZEl0ZW0sXG4gICAgICAgIGZvY3VzSXRlbSxcbiAgICAgICAgZm9jdXNUcmVlLFxuICAgICAgICBtb3ZlRm9jdXNEb3duLFxuICAgICAgICBtb3ZlRm9jdXNVcCxcbiAgICAgICAgcmVuYW1lSXRlbSxcbiAgICAgICAgc2VsZWN0SXRlbXMsXG4gICAgICAgIHRvZ2dsZUl0ZW1FeHBhbmRlZFN0YXRlLFxuICAgICAgICB0b2dnbGVJdGVtU2VsZWN0U3RhdHVzLFxuICAgICAgICBpbnZva2VQcmltYXJ5QWN0aW9uLFxuICAgICAgICBleHBhbmRBbGwsXG4gICAgICAgIGV4cGFuZFN1YnNlcXVlbnRseSxcbiAgICAgICAgY29sbGFwc2VBbGwsXG4gICAgICAgIGFib3J0UHJvZ3JhbW1hdGljRHJhZyxcbiAgICAgICAgY29tcGxldGVQcm9ncmFtbWF0aWNEcmFnLFxuICAgICAgICBwcm9ncmFtbWF0aWNEcmFnRG93bixcbiAgICAgICAgcHJvZ3JhbW1hdGljRHJhZ1VwLFxuICAgICAgICBzdGFydFByb2dyYW1tYXRpY0RyYWcsXG4gICAgXSk7XG4gICAgdXNlQ3JlYXRlZEVudmlyb25tZW50UmVmKHJlZiwgYWN0aW9ucyk7XG4gICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KEVudmlyb25tZW50QWN0aW9uc0NvbnRleHQuUHJvdmlkZXIsIHsgdmFsdWU6IGFjdGlvbnMgfSwgcHJvcHMuY2hpbGRyZW4pKTtcbn0pO1xuIiwiaW1wb3J0IHsgZ2V0RG9jdW1lbnQgfSBmcm9tICcuLi91dGlscyc7XG5leHBvcnQgdmFyIHNjcm9sbEludG9WaWV3ID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICB2YXIgX2EsIF9iLCBfYywgX2Q7XG4gICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGVsZW1lbnQuc2Nyb2xsSW50b1ZpZXdJZk5lZWRlZCkge1xuICAgICAgICBlbGVtZW50LnNjcm9sbEludG9WaWV3SWZOZWVkZWQoKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHZhciBib3VuZGluZ0JveCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHZhciBpc0VsZW1lbnRJblZpZXdwb3J0ID0gYm91bmRpbmdCb3gudG9wID49IDAgJiZcbiAgICAgICAgICAgIGJvdW5kaW5nQm94LmxlZnQgPj0gMCAmJlxuICAgICAgICAgICAgYm91bmRpbmdCb3guYm90dG9tIDw9XG4gICAgICAgICAgICAgICAgKHdpbmRvdy5pbm5lckhlaWdodCB8fFxuICAgICAgICAgICAgICAgICAgICAhISgoX2IgPSAoX2EgPSBnZXREb2N1bWVudCgpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZG9jdW1lbnRFbGVtZW50KSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuY2xpZW50SGVpZ2h0KSkgJiZcbiAgICAgICAgICAgIGJvdW5kaW5nQm94LnJpZ2h0IDw9XG4gICAgICAgICAgICAgICAgKHdpbmRvdy5pbm5lcldpZHRoIHx8ICEhKChfZCA9IChfYyA9IGdldERvY3VtZW50KCkpID09PSBudWxsIHx8IF9jID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYy5kb2N1bWVudEVsZW1lbnQpID09PSBudWxsIHx8IF9kID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZC5jbGllbnRXaWR0aCkpO1xuICAgICAgICBpZiAoIWlzRWxlbWVudEluVmlld3BvcnQpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuc2Nyb2xsSW50b1ZpZXcoKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG4iLCJ2YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxuICAgICAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0O1xuICAgIH07XG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbnZhciBjeCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2xhc3NOYW1lcyA9IFtdO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIGNsYXNzTmFtZXNbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICB9XG4gICAgcmV0dXJuIGNsYXNzTmFtZXMuZmlsdGVyKGZ1bmN0aW9uIChjbikgeyByZXR1cm4gISFjbjsgfSkuam9pbignICcpO1xufTtcbmV4cG9ydCB2YXIgY3JlYXRlRGVmYXVsdFJlbmRlcmVycyA9IGZ1bmN0aW9uIChyZW5kZXJEZXB0aE9mZnNldCwgcnRsKSB7IHJldHVybiAoe1xuICAgIHJlbmRlckl0ZW1UaXRsZTogZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHZhciB0aXRsZSA9IF9hLnRpdGxlLCBjb250ZXh0ID0gX2EuY29udGV4dCwgaW5mbyA9IF9hLmluZm87XG4gICAgICAgIGlmICghaW5mby5pc1NlYXJjaGluZyB8fCAhY29udGV4dC5pc1NlYXJjaE1hdGNoaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gdGl0bGU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHN0YXJ0SW5kZXggPSB0aXRsZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoaW5mby5zZWFyY2gudG9Mb3dlckNhc2UoKSk7XG4gICAgICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5GcmFnbWVudCwgbnVsbCxcbiAgICAgICAgICAgIHN0YXJ0SW5kZXggPiAwICYmIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIG51bGwsIHRpdGxlLnNsaWNlKDAsIHN0YXJ0SW5kZXgpKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHsgY2xhc3NOYW1lOiBcInJjdC10cmVlLWl0ZW0tc2VhcmNoLWhpZ2hsaWdodFwiIH0sIHRpdGxlLnNsaWNlKHN0YXJ0SW5kZXgsIHN0YXJ0SW5kZXggKyBpbmZvLnNlYXJjaC5sZW5ndGgpKSxcbiAgICAgICAgICAgIHN0YXJ0SW5kZXggKyBpbmZvLnNlYXJjaC5sZW5ndGggPCB0aXRsZS5sZW5ndGggJiYgKFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIG51bGwsIHRpdGxlLnNsaWNlKHN0YXJ0SW5kZXggKyBpbmZvLnNlYXJjaC5sZW5ndGgsIHRpdGxlLmxlbmd0aCkpKSkpO1xuICAgIH0sXG4gICAgcmVuZGVySXRlbUFycm93OiBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgdmFyIGl0ZW0gPSBfYS5pdGVtLCBjb250ZXh0ID0gX2EuY29udGV4dDtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgLy8gSWNvbnMgZnJvbSBodHRwczovL2JsdWVwcmludGpzLmNvbS9kb2NzLyNpY29uc1xuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIF9fYXNzaWduKHsgY2xhc3NOYW1lOiBjeChpdGVtLmlzRm9sZGVyICYmICdyY3QtdHJlZS1pdGVtLWFycm93LWlzRm9sZGVyJywgY29udGV4dC5pc0V4cGFuZGVkICYmICdyY3QtdHJlZS1pdGVtLWFycm93LWV4cGFuZGVkJywgJ3JjdC10cmVlLWl0ZW0tYXJyb3cnKSB9LCBjb250ZXh0LmFycm93UHJvcHMpLCBpdGVtLmlzRm9sZGVyICYmXG4gICAgICAgICAgICAoY29udGV4dC5pc0V4cGFuZGVkID8gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzdmdcIiwgeyB2ZXJzaW9uOiBcIjEuMVwiLCB4bWxuczogXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCB4bWxuc1hsaW5rOiBcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiwgeDogXCIwcHhcIiwgeTogXCIwcHhcIiwgdmlld0JveDogXCIwIDAgMTYgMTZcIiwgZW5hYmxlQmFja2dyb3VuZDogXCJuZXcgMCAwIDE2IDE2XCIsIHhtbFNwYWNlOiBcInByZXNlcnZlXCIgfSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZ1wiLCBudWxsLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZ1wiLCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInBhdGhcIiwgeyBmaWxsUnVsZTogXCJldmVub2RkXCIsIGNsaXBSdWxlOiBcImV2ZW5vZGRcIiwgZDogXCJNMS42NDYgNC42NDZhLjUuNSAwIDAgMSAuNzA4IDBMOCAxMC4yOTNsNS42NDYtNS42NDdhLjUuNSAwIDAgMSAuNzA4LjcwOGwtNiA2YS41LjUgMCAwIDEtLjcwOCAwbC02LTZhLjUuNSAwIDAgMSAwLS43MDh6XCIsIGNsYXNzTmFtZTogXCJyY3QtdHJlZS1pdGVtLWFycm93LXBhdGhcIiB9KSkpKSkgOiAoUmVhY3QuY3JlYXRlRWxlbWVudChcInN2Z1wiLCB7IHZlcnNpb246IFwiMS4xXCIsIHhtbG5zOiBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsIHhtbG5zWGxpbms6IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLCB4OiBcIjBweFwiLCB5OiBcIjBweFwiLCB2aWV3Qm94OiBcIjAgMCAxNiAxNlwiLCBlbmFibGVCYWNrZ3JvdW5kOiBcIm5ldyAwIDAgMTYgMTZcIiwgeG1sU3BhY2U6IFwicHJlc2VydmVcIiB9LFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJnXCIsIG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJnXCIsIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwicGF0aFwiLCB7IGZpbGxSdWxlOiBcImV2ZW5vZGRcIiwgY2xpcFJ1bGU6IFwiZXZlbm9kZFwiLCBkOiBcIk00LjY0NiAxLjY0NmEuNS41IDAgMCAxIC43MDggMGw2IDZhLjUuNSAwIDAgMSAwIC43MDhsLTYgNmEuNS41IDAgMCAxLS43MDgtLjcwOEwxMC4yOTMgOCA0LjY0NiAyLjM1NGEuNS41IDAgMCAxIDAtLjcwOHpcIiwgY2xhc3NOYW1lOiBcInJjdC10cmVlLWl0ZW0tYXJyb3ctcGF0aFwiIH0pKSkpKSkpKTtcbiAgICB9LFxuICAgIHJlbmRlckl0ZW06IGZ1bmN0aW9uIChfYSkge1xuICAgICAgICB2YXIgaXRlbSA9IF9hLml0ZW0sIGRlcHRoID0gX2EuZGVwdGgsIGNoaWxkcmVuID0gX2EuY2hpbGRyZW4sIHRpdGxlID0gX2EudGl0bGUsIGNvbnRleHQgPSBfYS5jb250ZXh0LCBhcnJvdyA9IF9hLmFycm93O1xuICAgICAgICB2YXIgSW50ZXJhY3RpdmVDb21wb25lbnQgPSBjb250ZXh0LmlzUmVuYW1pbmcgPyAnZGl2JyA6ICdidXR0b24nO1xuICAgICAgICB2YXIgdHlwZSA9IGNvbnRleHQuaXNSZW5hbWluZyA/IHVuZGVmaW5lZCA6ICdidXR0b24nO1xuICAgICAgICAvLyBUT0RPIGhhdmUgb25seSByb290IGxpIGNvbXBvbmVudCBjcmVhdGUgYWxsIHRoZSBjbGFzc2VzXG4gICAgICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIF9fYXNzaWduKHt9LCBjb250ZXh0Lml0ZW1Db250YWluZXJXaXRoQ2hpbGRyZW5Qcm9wcywgeyBjbGFzc05hbWU6IGN4KCdyY3QtdHJlZS1pdGVtLWxpJywgaXRlbS5pc0ZvbGRlciAmJiAncmN0LXRyZWUtaXRlbS1saS1pc0ZvbGRlcicsIGNvbnRleHQuaXNTZWxlY3RlZCAmJiAncmN0LXRyZWUtaXRlbS1saS1zZWxlY3RlZCcsIGNvbnRleHQuaXNFeHBhbmRlZCAmJiAncmN0LXRyZWUtaXRlbS1saS1leHBhbmRlZCcsIGNvbnRleHQuaXNGb2N1c2VkICYmICdyY3QtdHJlZS1pdGVtLWxpLWZvY3VzZWQnLCBjb250ZXh0LmlzRHJhZ2dpbmdPdmVyICYmICdyY3QtdHJlZS1pdGVtLWxpLWRyYWdnaW5nLW92ZXInLCBjb250ZXh0LmlzU2VhcmNoTWF0Y2hpbmcgJiYgJ3JjdC10cmVlLWl0ZW0tbGktc2VhcmNoLW1hdGNoJykgfSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIF9fYXNzaWduKHt9LCBjb250ZXh0Lml0ZW1Db250YWluZXJXaXRob3V0Q2hpbGRyZW5Qcm9wcywgeyBzdHlsZTogeyAnLS1kZXB0aE9mZnNldCc6IFwiXCIuY29uY2F0KChkZXB0aCArIDEpICogcmVuZGVyRGVwdGhPZmZzZXQsIFwicHhcIikgfSwgY2xhc3NOYW1lOiBjeCgncmN0LXRyZWUtaXRlbS10aXRsZS1jb250YWluZXInLCBpdGVtLmlzRm9sZGVyICYmICdyY3QtdHJlZS1pdGVtLXRpdGxlLWNvbnRhaW5lci1pc0ZvbGRlcicsIGNvbnRleHQuaXNTZWxlY3RlZCAmJiAncmN0LXRyZWUtaXRlbS10aXRsZS1jb250YWluZXItc2VsZWN0ZWQnLCBjb250ZXh0LmlzRXhwYW5kZWQgJiYgJ3JjdC10cmVlLWl0ZW0tdGl0bGUtY29udGFpbmVyLWV4cGFuZGVkJywgY29udGV4dC5pc0ZvY3VzZWQgJiYgJ3JjdC10cmVlLWl0ZW0tdGl0bGUtY29udGFpbmVyLWZvY3VzZWQnLCBjb250ZXh0LmlzRHJhZ2dpbmdPdmVyICYmXG4gICAgICAgICAgICAgICAgICAgICdyY3QtdHJlZS1pdGVtLXRpdGxlLWNvbnRhaW5lci1kcmFnZ2luZy1vdmVyJywgY29udGV4dC5pc1NlYXJjaE1hdGNoaW5nICYmXG4gICAgICAgICAgICAgICAgICAgICdyY3QtdHJlZS1pdGVtLXRpdGxlLWNvbnRhaW5lci1zZWFyY2gtbWF0Y2gnKSB9KSxcbiAgICAgICAgICAgICAgICBhcnJvdyxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEludGVyYWN0aXZlQ29tcG9uZW50LCBfX2Fzc2lnbih7IHR5cGU6IHR5cGUgfSwgY29udGV4dC5pbnRlcmFjdGl2ZUVsZW1lbnRQcm9wcywgeyBjbGFzc05hbWU6IGN4KCdyY3QtdHJlZS1pdGVtLWJ1dHRvbicsIGl0ZW0uaXNGb2xkZXIgJiYgJ3JjdC10cmVlLWl0ZW0tYnV0dG9uLWlzRm9sZGVyJywgY29udGV4dC5pc1NlbGVjdGVkICYmICdyY3QtdHJlZS1pdGVtLWJ1dHRvbi1zZWxlY3RlZCcsIGNvbnRleHQuaXNFeHBhbmRlZCAmJiAncmN0LXRyZWUtaXRlbS1idXR0b24tZXhwYW5kZWQnLCBjb250ZXh0LmlzRm9jdXNlZCAmJiAncmN0LXRyZWUtaXRlbS1idXR0b24tZm9jdXNlZCcsIGNvbnRleHQuaXNEcmFnZ2luZ092ZXIgJiYgJ3JjdC10cmVlLWl0ZW0tYnV0dG9uLWRyYWdnaW5nLW92ZXInLCBjb250ZXh0LmlzU2VhcmNoTWF0Y2hpbmcgJiYgJ3JjdC10cmVlLWl0ZW0tYnV0dG9uLXNlYXJjaC1tYXRjaCcpIH0pLCB0aXRsZSkpLFxuICAgICAgICAgICAgY2hpbGRyZW4pKTtcbiAgICB9LFxuICAgIHJlbmRlclJlbmFtZUlucHV0OiBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgdmFyIGlucHV0UHJvcHMgPSBfYS5pbnB1dFByb3BzLCBpbnB1dFJlZiA9IF9hLmlucHV0UmVmLCBzdWJtaXRCdXR0b25Qcm9wcyA9IF9hLnN1Ym1pdEJ1dHRvblByb3BzLCBzdWJtaXRCdXR0b25SZWYgPSBfYS5zdWJtaXRCdXR0b25SZWYsIGZvcm1Qcm9wcyA9IF9hLmZvcm1Qcm9wcztcbiAgICAgICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFwiZm9ybVwiLCBfX2Fzc2lnbih7fSwgZm9ybVByb3BzLCB7IGNsYXNzTmFtZTogXCJyY3QtdHJlZS1pdGVtLXJlbmFtaW5nLWZvcm1cIiB9KSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCBfX2Fzc2lnbih7fSwgaW5wdXRQcm9wcywgeyByZWY6IGlucHV0UmVmLCBjbGFzc05hbWU6IFwicmN0LXRyZWUtaXRlbS1yZW5hbWluZy1pbnB1dFwiIH0pKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCBfX2Fzc2lnbih7fSwgc3VibWl0QnV0dG9uUHJvcHMsIHsgcmVmOiBzdWJtaXRCdXR0b25SZWYsIHR5cGU6IFwic3VibWl0XCIsIGNsYXNzTmFtZTogXCJyY3QtdHJlZS1pdGVtLXJlbmFtaW5nLXN1Ym1pdC1idXR0b25cIiwgdmFsdWU6IFwiXFx1RDgzRFxcdURERjhcIiB9KSkpKTtcbiAgICB9LFxuICAgIHJlbmRlclRyZWVDb250YWluZXI6IGZ1bmN0aW9uIChfYSkge1xuICAgICAgICB2YXIgY2hpbGRyZW4gPSBfYS5jaGlsZHJlbiwgY29udGFpbmVyUHJvcHMgPSBfYS5jb250YWluZXJQcm9wcywgaW5mbyA9IF9hLmluZm87XG4gICAgICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogY3goJ3JjdC10cmVlLXJvb3QnLCBpbmZvLmlzRm9jdXNlZCAmJiAncmN0LXRyZWUtcm9vdC1mb2N1cycsIGluZm8uaXNSZW5hbWluZyAmJiAncmN0LXRyZWUtcm9vdC1yZW5hbWluZycsIGluZm8uYXJlSXRlbXNTZWxlY3RlZCAmJiAncmN0LXRyZWUtcm9vdC1pdGVtc3NlbGVjdGVkJywgcnRsICYmICdyY3QtcnRsJykgfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgX19hc3NpZ24oe30sIGNvbnRhaW5lclByb3BzLCB7IHN0eWxlOiBfX2Fzc2lnbih7IG1pbkhlaWdodDogJzMwcHgnIH0sIGNvbnRhaW5lclByb3BzLnN0eWxlKSB9KSwgY2hpbGRyZW4pKSk7XG4gICAgfSxcbiAgICByZW5kZXJJdGVtc0NvbnRhaW5lcjogZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHZhciBjaGlsZHJlbiA9IF9hLmNoaWxkcmVuLCBjb250YWluZXJQcm9wcyA9IF9hLmNvbnRhaW5lclByb3BzO1xuICAgICAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiLCBfX2Fzc2lnbih7fSwgY29udGFpbmVyUHJvcHMsIHsgY2xhc3NOYW1lOiBcInJjdC10cmVlLWl0ZW1zLWNvbnRhaW5lclwiIH0pLCBjaGlsZHJlbikpO1xuICAgIH0sXG4gICAgcmVuZGVyRHJhZ0JldHdlZW5MaW5lOiBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgdmFyIGRyYWdnaW5nUG9zaXRpb24gPSBfYS5kcmFnZ2luZ1Bvc2l0aW9uLCBsaW5lUHJvcHMgPSBfYS5saW5lUHJvcHM7XG4gICAgICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBfX2Fzc2lnbih7fSwgbGluZVByb3BzLCB7IHN0eWxlOiB7IGxlZnQ6IFwiXCIuY29uY2F0KGRyYWdnaW5nUG9zaXRpb24uZGVwdGggKiByZW5kZXJEZXB0aE9mZnNldCwgXCJweFwiKSB9LCBjbGFzc05hbWU6IGN4KCdyY3QtdHJlZS1kcmFnLWJldHdlZW4tbGluZScsIGRyYWdnaW5nUG9zaXRpb24udGFyZ2V0VHlwZSA9PT0gJ2JldHdlZW4taXRlbXMnICYmXG4gICAgICAgICAgICAgICAgZHJhZ2dpbmdQb3NpdGlvbi5saW5lUG9zaXRpb24gPT09ICd0b3AnICYmXG4gICAgICAgICAgICAgICAgJ3JjdC10cmVlLWRyYWctYmV0d2Vlbi1saW5lLXRvcCcsIGRyYWdnaW5nUG9zaXRpb24udGFyZ2V0VHlwZSA9PT0gJ2JldHdlZW4taXRlbXMnICYmXG4gICAgICAgICAgICAgICAgZHJhZ2dpbmdQb3NpdGlvbi5saW5lUG9zaXRpb24gPT09ICdib3R0b20nICYmXG4gICAgICAgICAgICAgICAgJ3JjdC10cmVlLWRyYWctYmV0d2Vlbi1saW5lLWJvdHRvbScpIH0pKSk7XG4gICAgfSxcbiAgICByZW5kZXJTZWFyY2hJbnB1dDogZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHZhciBpbnB1dFByb3BzID0gX2EuaW5wdXRQcm9wcztcbiAgICAgICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBjeCgncmN0LXRyZWUtc2VhcmNoLWlucHV0LWNvbnRhaW5lcicpIH0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7IGNsYXNzTmFtZTogXCJyY3QtdHJlZS1pbnB1dC1pY29uXCIgfSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwgX19hc3NpZ24oe30sIGlucHV0UHJvcHMsIHsgY2xhc3NOYW1lOiBjeCgncmN0LXRyZWUtc2VhcmNoLWlucHV0JykgfSkpKSk7XG4gICAgfSxcbiAgICByZW5kZXJMaXZlRGVzY3JpcHRvckNvbnRhaW5lcjogZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHZhciB0cmVlID0gX2EudHJlZSwgY2hpbGRyZW4gPSBfYS5jaGlsZHJlbjtcbiAgICAgICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgaWQ6IFwicmN0LWxpdmVkZXNjcmlwdGlvbi1cIi5jb25jYXQodHJlZS50cmVlSWQpLCBzdHlsZToge1xuICAgICAgICAgICAgICAgIGNsaXA6ICdyZWN0KDAgMCAwIDApJyxcbiAgICAgICAgICAgICAgICBjbGlwUGF0aDogJ2luc2V0KDUwJSknLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzFweCcsXG4gICAgICAgICAgICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgIHdoaXRlU3BhY2U6ICdub3dyYXAnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMXB4JyxcbiAgICAgICAgICAgIH0gfSwgY2hpbGRyZW4pKTtcbiAgICB9LFxuICAgIHJlbmRlckRlcHRoT2Zmc2V0OiByZW5kZXJEZXB0aE9mZnNldCxcbn0pOyB9O1xuIiwiaW1wb3J0IHsgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGNyZWF0ZURlZmF1bHRSZW5kZXJlcnMgfSBmcm9tICcuL2NyZWF0ZURlZmF1bHRSZW5kZXJlcnMnO1xuZXhwb3J0IHZhciB1c2VSZW5kZXJlcnMgPSBmdW5jdGlvbiAoX2EpIHtcbiAgICB2YXIgcmVuZGVySXRlbSA9IF9hLnJlbmRlckl0ZW0sIHJlbmRlckl0ZW1UaXRsZSA9IF9hLnJlbmRlckl0ZW1UaXRsZSwgcmVuZGVySXRlbUFycm93ID0gX2EucmVuZGVySXRlbUFycm93LCByZW5kZXJSZW5hbWVJbnB1dCA9IF9hLnJlbmRlclJlbmFtZUlucHV0LCByZW5kZXJJdGVtc0NvbnRhaW5lciA9IF9hLnJlbmRlckl0ZW1zQ29udGFpbmVyLCByZW5kZXJUcmVlQ29udGFpbmVyID0gX2EucmVuZGVyVHJlZUNvbnRhaW5lciwgcmVuZGVyRHJhZ0JldHdlZW5MaW5lID0gX2EucmVuZGVyRHJhZ0JldHdlZW5MaW5lLCByZW5kZXJTZWFyY2hJbnB1dCA9IF9hLnJlbmRlclNlYXJjaElucHV0LCByZW5kZXJMaXZlRGVzY3JpcHRvckNvbnRhaW5lciA9IF9hLnJlbmRlckxpdmVEZXNjcmlwdG9yQ29udGFpbmVyLCByZW5kZXJEZXB0aE9mZnNldCA9IF9hLnJlbmRlckRlcHRoT2Zmc2V0O1xuICAgIHZhciBkZWZhdWx0UmVuZGVyZXJzID0gdXNlTWVtbyhmdW5jdGlvbiAoKSB7IHJldHVybiBjcmVhdGVEZWZhdWx0UmVuZGVyZXJzKHJlbmRlckRlcHRoT2Zmc2V0ICE9PSBudWxsICYmIHJlbmRlckRlcHRoT2Zmc2V0ICE9PSB2b2lkIDAgPyByZW5kZXJEZXB0aE9mZnNldCA6IDEwKTsgfSwgW3JlbmRlckRlcHRoT2Zmc2V0XSk7XG4gICAgdmFyIGN1c3RvbVJlbmRlcmVycyA9IHtcbiAgICAgICAgcmVuZGVySXRlbTogcmVuZGVySXRlbSxcbiAgICAgICAgcmVuZGVySXRlbVRpdGxlOiByZW5kZXJJdGVtVGl0bGUsXG4gICAgICAgIHJlbmRlckl0ZW1BcnJvdzogcmVuZGVySXRlbUFycm93LFxuICAgICAgICByZW5kZXJSZW5hbWVJbnB1dDogcmVuZGVyUmVuYW1lSW5wdXQsXG4gICAgICAgIHJlbmRlckl0ZW1zQ29udGFpbmVyOiByZW5kZXJJdGVtc0NvbnRhaW5lcixcbiAgICAgICAgcmVuZGVyVHJlZUNvbnRhaW5lcjogcmVuZGVyVHJlZUNvbnRhaW5lcixcbiAgICAgICAgcmVuZGVyRHJhZ0JldHdlZW5MaW5lOiByZW5kZXJEcmFnQmV0d2VlbkxpbmUsXG4gICAgICAgIHJlbmRlclNlYXJjaElucHV0OiByZW5kZXJTZWFyY2hJbnB1dCxcbiAgICAgICAgcmVuZGVyTGl2ZURlc2NyaXB0b3JDb250YWluZXI6IHJlbmRlckxpdmVEZXNjcmlwdG9yQ29udGFpbmVyLFxuICAgICAgICByZW5kZXJEZXB0aE9mZnNldDogcmVuZGVyRGVwdGhPZmZzZXQsXG4gICAgfTtcbiAgICB2YXIgcmVuZGVyZXJzID0gT2JqZWN0LmVudHJpZXMoZGVmYXVsdFJlbmRlcmVycykucmVkdWNlKGZ1bmN0aW9uIChhY2MsIF9hKSB7XG4gICAgICAgIHZhciBrZXkgPSBfYVswXSwgdmFsdWUgPSBfYVsxXTtcbiAgICAgICAgdmFyIGtleU1hcHBlZCA9IGtleTtcbiAgICAgICAgaWYgKGN1c3RvbVJlbmRlcmVyc1trZXlNYXBwZWRdKSB7XG4gICAgICAgICAgICBhY2Nba2V5TWFwcGVkXSA9IGN1c3RvbVJlbmRlcmVyc1trZXlNYXBwZWRdO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYWNjW2tleU1hcHBlZF0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHt9KTtcbiAgICByZW5kZXJlcnMucmVuZGVySXRlbS5kaXNwbGF5TmFtZSA9ICdSZW5kZXJJdGVtJztcbiAgICByZW5kZXJlcnMucmVuZGVySXRlbVRpdGxlLmRpc3BsYXlOYW1lID0gJ1JlbmRlckl0ZW1UaXRsZSc7XG4gICAgcmVuZGVyZXJzLnJlbmRlckl0ZW1BcnJvdy5kaXNwbGF5TmFtZSA9ICdSZW5kZXJJdGVtQXJyb3cnO1xuICAgIHJlbmRlcmVycy5yZW5kZXJSZW5hbWVJbnB1dC5kaXNwbGF5TmFtZSA9ICdSZW5kZXJSZW5hbWVJbnB1dCc7XG4gICAgcmVuZGVyZXJzLnJlbmRlckl0ZW1zQ29udGFpbmVyLmRpc3BsYXlOYW1lID0gJ1JlbmRlckl0ZW1zQ29udGFpbmVyJztcbiAgICByZW5kZXJlcnMucmVuZGVyVHJlZUNvbnRhaW5lci5kaXNwbGF5TmFtZSA9ICdSZW5kZXJUcmVlQ29udGFpbmVyJztcbiAgICByZW5kZXJlcnMucmVuZGVyRHJhZ0JldHdlZW5MaW5lLmRpc3BsYXlOYW1lID1cbiAgICAgICAgJ1JlbmRlckRyYWdCZXR3ZWVuTGluZSc7XG4gICAgcmVuZGVyZXJzLnJlbmRlclNlYXJjaElucHV0LmRpc3BsYXlOYW1lID0gJ1JlbmRlclNlYXJjaElucHV0JztcbiAgICByZXR1cm4gcmVuZGVyZXJzO1xufTtcbiIsImV4cG9ydCB2YXIgZ2V0SXRlbXNMaW5lYXJseSA9IGZ1bmN0aW9uIChyb290SXRlbSwgdmlld1N0YXRlLCBpdGVtcywgZGVwdGgpIHtcbiAgICB2YXIgX2EsIF9iLCBfYztcbiAgICBpZiAoZGVwdGggPT09IHZvaWQgMCkgeyBkZXB0aCA9IDA7IH1cbiAgICB2YXIgaXRlbUlkcyA9IFtdO1xuICAgIGZvciAodmFyIF9pID0gMCwgX2QgPSAoX2IgPSAoX2EgPSBpdGVtc1tyb290SXRlbV0pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5jaGlsZHJlbikgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogW107IF9pIDwgX2QubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIHZhciBpdGVtSWQgPSBfZFtfaV07XG4gICAgICAgIHZhciBpdGVtID0gaXRlbXNbaXRlbUlkXTtcbiAgICAgICAgaXRlbUlkcy5wdXNoKHsgaXRlbTogaXRlbUlkLCBkZXB0aDogZGVwdGggfSk7XG4gICAgICAgIGlmIChpdGVtICYmXG4gICAgICAgICAgICBpdGVtLmlzRm9sZGVyICYmXG4gICAgICAgICAgICAhIWl0ZW0uY2hpbGRyZW4gJiZcbiAgICAgICAgICAgICgoX2MgPSB2aWV3U3RhdGUuZXhwYW5kZWRJdGVtcykgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLmluY2x1ZGVzKGl0ZW1JZCkpKSB7XG4gICAgICAgICAgICBpdGVtSWRzLnB1c2guYXBwbHkoaXRlbUlkcywgZ2V0SXRlbXNMaW5lYXJseShpdGVtSWQsIHZpZXdTdGF0ZSwgaXRlbXMsIGRlcHRoICsgMSkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpdGVtSWRzO1xufTtcbiIsInZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IGZ1bmN0aW9uICgpIHtcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXG4gICAgICAgICAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG52YXIgX19yZXN0ID0gKHRoaXMgJiYgdGhpcy5fX3Jlc3QpIHx8IGZ1bmN0aW9uIChzLCBlKSB7XG4gICAgdmFyIHQgPSB7fTtcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcbiAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMCAmJiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocywgcFtpXSkpXG4gICAgICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XG4gICAgICAgIH1cbiAgICByZXR1cm4gdDtcbn07XG5pbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBzY3JvbGxJbnRvVmlldyB9IGZyb20gJy4uL3RyZWUvc2Nyb2xsSW50b1ZpZXcnO1xuaW1wb3J0IHsgdXNlUmVuZGVyZXJzIH0gZnJvbSAnLi4vcmVuZGVyZXJzL3VzZVJlbmRlcmVycyc7XG5pbXBvcnQgeyBidWlsZE1hcEZvclRyZWVzLCBnZXREb2N1bWVudCB9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCB7IGdldEl0ZW1zTGluZWFybHkgfSBmcm9tICcuLi90cmVlL2dldEl0ZW1zTGluZWFybHknO1xuaW1wb3J0IHsgdXNlUmVmQ29weSB9IGZyb20gJy4uL3VzZVJlZkNvcHknO1xuZXhwb3J0IHZhciB1c2VDb250cm9sbGVkVHJlZUVudmlyb25tZW50UHJvcHMgPSBmdW5jdGlvbiAoX2EpIHtcbiAgICB2YXIgb25FeHBhbmRJdGVtUHJvcCA9IF9hLm9uRXhwYW5kSXRlbSwgb25Db2xsYXBzZVByb3AgPSBfYS5vbkNvbGxhcHNlSXRlbSwgb25Ecm9wUHJvcCA9IF9hLm9uRHJvcCwgcHJvcHMgPSBfX3Jlc3QoX2EsIFtcIm9uRXhwYW5kSXRlbVwiLCBcIm9uQ29sbGFwc2VJdGVtXCIsIFwib25Ecm9wXCJdKTtcbiAgICB2YXIgX2IgPSB1c2VTdGF0ZSh7fSksIHRyZWVzID0gX2JbMF0sIHNldFRyZWVzID0gX2JbMV07XG4gICAgdmFyIF9jID0gdXNlU3RhdGUoKSwgYWN0aXZlVHJlZUlkID0gX2NbMF0sIHNldEFjdGl2ZVRyZWVJZCA9IF9jWzFdO1xuICAgIHZhciB0cmVlSWRzID0gdXNlTWVtbyhmdW5jdGlvbiAoKSB7IHJldHVybiBPYmplY3Qua2V5cyh0cmVlcyk7IH0sIFt0cmVlc10pO1xuICAgIHZhciBvbkZvY3VzSXRlbSA9IHByb3BzLm9uRm9jdXNJdGVtLCBhdXRvRm9jdXMgPSBwcm9wcy5hdXRvRm9jdXMsIG9uUmVnaXN0ZXJUcmVlID0gcHJvcHMub25SZWdpc3RlclRyZWUsIG9uVW5yZWdpc3RlclRyZWUgPSBwcm9wcy5vblVucmVnaXN0ZXJUcmVlLCBpdGVtcyA9IHByb3BzLml0ZW1zLCB2aWV3U3RhdGUgPSBwcm9wcy52aWV3U3RhdGU7XG4gICAgdmFyIG9uRm9jdXNJdGVtUmVmID0gdXNlUmVmQ29weShvbkZvY3VzSXRlbSk7XG4gICAgdmFyIHZpZXdTdGF0ZVJlZiA9IHVzZVJlZkNvcHkodmlld1N0YXRlKTtcbiAgICB2YXIgbGluZWFySXRlbXMgPSB1c2VNZW1vKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGJ1aWxkTWFwRm9yVHJlZXModHJlZUlkcywgZnVuY3Rpb24gKHRyZWVJZCkgeyB2YXIgX2E7IHJldHVybiBnZXRJdGVtc0xpbmVhcmx5KHRyZWVzW3RyZWVJZF0ucm9vdEl0ZW0sIChfYSA9IHZpZXdTdGF0ZVt0cmVlSWRdKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiB7fSwgaXRlbXMpOyB9KTtcbiAgICB9LCBbdHJlZXMsIGl0ZW1zLCB0cmVlSWRzLCB2aWV3U3RhdGVdKTtcbiAgICB2YXIgb25Gb2N1c0l0ZW1IYW5kbGVyID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKGl0ZW0sIHRyZWVJZCwgc2V0RG9tRm9jdXMpIHtcbiAgICAgICAgdmFyIF9hLCBfYiwgX2MsIF9kLCBfZSwgX2YsIF9nLCBfaCwgX2o7XG4gICAgICAgIGlmIChzZXREb21Gb2N1cyA9PT0gdm9pZCAwKSB7IHNldERvbUZvY3VzID0gdHJ1ZTsgfVxuICAgICAgICBpZiAoKGF1dG9Gb2N1cyAhPT0gbnVsbCAmJiBhdXRvRm9jdXMgIT09IHZvaWQgMCA/IGF1dG9Gb2N1cyA6IHRydWUpICYmIHNldERvbUZvY3VzKSB7XG4gICAgICAgICAgICB2YXIgbmV3SXRlbSA9IChfYiA9IChfYSA9IGdldERvY3VtZW50KCkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtcmN0LXRyZWU9XFxcIlwiLmNvbmNhdCh0cmVlSWQsIFwiXFxcIl0gW2RhdGEtcmN0LWl0ZW0taWQ9XFxcIlwiKS5jb25jYXQoaXRlbS5pbmRleCwgXCJcXFwiXVwiKSkpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IChfYyA9IGdldERvY3VtZW50KCkpID09PSBudWxsIHx8IF9jID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYy5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtcmN0LXRyZWU9XFxcIlwiLmNvbmNhdCh0cmVlSWQsIFwiXFxcIl0gW2RhdGEtcmN0LWl0ZW0taWRdXCIpKTtcbiAgICAgICAgICAgIGlmICgoKF9mID0gKF9lID0gKF9kID0gZ2V0RG9jdW1lbnQoKSkgPT09IG51bGwgfHwgX2QgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9kLmFjdGl2ZUVsZW1lbnQpID09PSBudWxsIHx8IF9lID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZS5hdHRyaWJ1dGVzLmdldE5hbWVkSXRlbSgnZGF0YS1yY3Qtc2VhcmNoLWlucHV0JykpID09PSBudWxsIHx8IF9mID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZi52YWx1ZSkgIT09ICd0cnVlJykge1xuICAgICAgICAgICAgICAgIC8vIE1vdmUgRE9NIGZvY3VzIHRvIGl0ZW0gaWYgdGhlIGN1cnJlbnQgZm9jdXMgaXMgbm90IG9uIHRoZSBzZWFyY2ggaW5wdXRcbiAgICAgICAgICAgICAgICAoX2cgPSBuZXdJdGVtID09PSBudWxsIHx8IG5ld0l0ZW0gPT09IHZvaWQgMCA/IHZvaWQgMCA6IG5ld0l0ZW0uZm9jdXMpID09PSBudWxsIHx8IF9nID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZy5jYWxsKG5ld0l0ZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gT3RoZXJ3aXNlIGp1c3QgbWFudWFsbHkgc2Nyb2xsIGludG8gdmlld1xuICAgICAgICAgICAgICAgIHNjcm9sbEludG9WaWV3KG5ld0l0ZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICgoKF9oID0gdmlld1N0YXRlUmVmLmN1cnJlbnRbdHJlZUlkXSkgPT09IG51bGwgfHwgX2ggPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9oLmZvY3VzZWRJdGVtKSA9PT0gaXRlbS5pbmRleCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIChfaiA9IG9uRm9jdXNJdGVtUmVmLmN1cnJlbnQpID09PSBudWxsIHx8IF9qID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfai5jYWxsKG9uRm9jdXNJdGVtUmVmLCBpdGVtLCB0cmVlSWQpO1xuICAgIH0sIFthdXRvRm9jdXMsIG9uRm9jdXNJdGVtUmVmLCB2aWV3U3RhdGVSZWZdKTtcbiAgICB2YXIgcmVnaXN0ZXJUcmVlID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKHRyZWUpIHtcbiAgICAgICAgc2V0VHJlZXMoZnVuY3Rpb24gKHRyZWVzKSB7XG4gICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICByZXR1cm4gKF9fYXNzaWduKF9fYXNzaWduKHt9LCB0cmVlcyksIChfYSA9IHt9LCBfYVt0cmVlLnRyZWVJZF0gPSB0cmVlLCBfYSkpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIG9uUmVnaXN0ZXJUcmVlID09PSBudWxsIHx8IG9uUmVnaXN0ZXJUcmVlID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvblJlZ2lzdGVyVHJlZSh0cmVlKTtcbiAgICB9LCBbb25SZWdpc3RlclRyZWVdKTtcbiAgICB2YXIgdW5yZWdpc3RlclRyZWUgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAodHJlZUlkKSB7XG4gICAgICAgIG9uVW5yZWdpc3RlclRyZWUgPT09IG51bGwgfHwgb25VbnJlZ2lzdGVyVHJlZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogb25VbnJlZ2lzdGVyVHJlZSh0cmVlc1t0cmVlSWRdKTtcbiAgICAgICAgZGVsZXRlIHRyZWVzW3RyZWVJZF07XG4gICAgICAgIHNldFRyZWVzKHRyZWVzKTtcbiAgICB9LCBbb25VbnJlZ2lzdGVyVHJlZSwgdHJlZXNdKTtcbiAgICB2YXIgb25Db2xsYXBzZUl0ZW0gPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoaXRlbSwgdHJlZUlkKSB7XG4gICAgICAgIG9uQ29sbGFwc2VQcm9wID09PSBudWxsIHx8IG9uQ29sbGFwc2VQcm9wID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvbkNvbGxhcHNlUHJvcChpdGVtLCB0cmVlSWQpO1xuICAgICAgICBzZXRUcmVlcyhmdW5jdGlvbiAodHJlZXMpIHsgcmV0dXJuIHRyZWVzOyB9KTtcbiAgICB9LCBbb25Db2xsYXBzZVByb3BdKTtcbiAgICB2YXIgb25FeHBhbmRJdGVtID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKGl0ZW0sIHRyZWVJZCkge1xuICAgICAgICBvbkV4cGFuZEl0ZW1Qcm9wID09PSBudWxsIHx8IG9uRXhwYW5kSXRlbVByb3AgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9uRXhwYW5kSXRlbVByb3AoaXRlbSwgdHJlZUlkKTtcbiAgICAgICAgc2V0VHJlZXMoZnVuY3Rpb24gKHRyZWVzKSB7IHJldHVybiB0cmVlczsgfSk7XG4gICAgfSwgW29uRXhwYW5kSXRlbVByb3BdKTtcbiAgICB2YXIgb25Ecm9wID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKGl0ZW1zLCB0YXJnZXQpIHtcbiAgICAgICAgb25Ecm9wUHJvcCA9PT0gbnVsbCB8fCBvbkRyb3BQcm9wID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvbkRyb3BQcm9wKGl0ZW1zLCB0YXJnZXQpO1xuICAgICAgICBzZXRUcmVlcyhmdW5jdGlvbiAodHJlZXMpIHsgcmV0dXJuIHRyZWVzOyB9KTtcbiAgICB9LCBbb25Ecm9wUHJvcF0pO1xuICAgIHZhciBmb2N1c1RyZWUgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAodHJlZUlkKSB7XG4gICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgIHZhciBmb2N1c0l0ZW0gPSAoX2EgPSBnZXREb2N1bWVudCgpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucXVlcnlTZWxlY3RvcihcIltkYXRhLXJjdC10cmVlPVxcXCJcIi5jb25jYXQodHJlZUlkLCBcIlxcXCJdIFtkYXRhLXJjdC1pdGVtLWZvY3VzPVxcXCJ0cnVlXFxcIl1cIikpO1xuICAgICAgICAoX2IgPSBmb2N1c0l0ZW0gPT09IG51bGwgfHwgZm9jdXNJdGVtID09PSB2b2lkIDAgPyB2b2lkIDAgOiBmb2N1c0l0ZW0uZm9jdXMpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5jYWxsKGZvY3VzSXRlbSk7XG4gICAgfSwgW10pO1xuICAgIHZhciBzZXRBY3RpdmVUcmVlID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKHRyZWVJZE9yU2V0U3RhdGVGdW5jdGlvbiwgYXV0b0ZvY3VzVHJlZSkge1xuICAgICAgICBpZiAoYXV0b0ZvY3VzVHJlZSA9PT0gdm9pZCAwKSB7IGF1dG9Gb2N1c1RyZWUgPSB0cnVlOyB9XG4gICAgICAgIHZhciBtYXliZUZvY3VzVHJlZSA9IGZ1bmN0aW9uICh0cmVlSWQpIHtcbiAgICAgICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgICAgICBpZiAoYXV0b0ZvY3VzVHJlZSAmJlxuICAgICAgICAgICAgICAgIChhdXRvRm9jdXMgIT09IG51bGwgJiYgYXV0b0ZvY3VzICE9PSB2b2lkIDAgPyBhdXRvRm9jdXMgOiB0cnVlKSAmJlxuICAgICAgICAgICAgICAgIHRyZWVJZCAmJlxuICAgICAgICAgICAgICAgICEoKF9iID0gKF9hID0gZ2V0RG9jdW1lbnQoKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1yY3QtdHJlZT1cXFwiXCIuY29uY2F0KHRyZWVJZCwgXCJcXFwiXVwiKSkpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5jb250YWlucyhkb2N1bWVudC5hY3RpdmVFbGVtZW50KSkpIHtcbiAgICAgICAgICAgICAgICBmb2N1c1RyZWUodHJlZUlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHR5cGVvZiB0cmVlSWRPclNldFN0YXRlRnVuY3Rpb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHNldEFjdGl2ZVRyZWVJZChmdW5jdGlvbiAob2xkVmFsdWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgdHJlZUlkID0gdHJlZUlkT3JTZXRTdGF0ZUZ1bmN0aW9uKG9sZFZhbHVlKTtcbiAgICAgICAgICAgICAgICBpZiAodHJlZUlkICE9PSBvbGRWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBtYXliZUZvY3VzVHJlZSh0cmVlSWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdHJlZUlkO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgdHJlZUlkID0gdHJlZUlkT3JTZXRTdGF0ZUZ1bmN0aW9uO1xuICAgICAgICAgICAgc2V0QWN0aXZlVHJlZUlkKHRyZWVJZCk7XG4gICAgICAgICAgICBtYXliZUZvY3VzVHJlZSh0cmVlSWQpO1xuICAgICAgICB9XG4gICAgfSwgW2F1dG9Gb2N1cywgZm9jdXNUcmVlXSk7XG4gICAgdmFyIHJlbmRlcmVycyA9IHVzZVJlbmRlcmVycyhwcm9wcyk7XG4gICAgcmV0dXJuIF9fYXNzaWduKF9fYXNzaWduKF9fYXNzaWduKHt9LCByZW5kZXJlcnMpLCBwcm9wcyksIHsgb25Gb2N1c0l0ZW06IG9uRm9jdXNJdGVtSGFuZGxlciwgcmVnaXN0ZXJUcmVlOiByZWdpc3RlclRyZWUsIHVucmVnaXN0ZXJUcmVlOiB1bnJlZ2lzdGVyVHJlZSwgb25FeHBhbmRJdGVtOiBvbkV4cGFuZEl0ZW0sIG9uQ29sbGFwc2VJdGVtOiBvbkNvbGxhcHNlSXRlbSwgb25Ecm9wOiBvbkRyb3AsIHNldEFjdGl2ZVRyZWU6IHNldEFjdGl2ZVRyZWUsIHRyZWVJZHM6IHRyZWVJZHMsIHRyZWVzOiB0cmVlcywgYWN0aXZlVHJlZUlkOiBhY3RpdmVUcmVlSWQsIGxpbmVhckl0ZW1zOiBsaW5lYXJJdGVtcyB9KTtcbn07XG4iLCJ2YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxuICAgICAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0O1xuICAgIH07XG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlQ29udGV4dCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEludGVyYWN0aW9uTWFuYWdlclByb3ZpZGVyIH0gZnJvbSAnLi9JbnRlcmFjdGlvbk1hbmFnZXJQcm92aWRlcic7XG5pbXBvcnQgeyBEcmFnQW5kRHJvcFByb3ZpZGVyIH0gZnJvbSAnLi4vZHJhZy9EcmFnQW5kRHJvcFByb3ZpZGVyJztcbmltcG9ydCB7IEVudmlyb25tZW50QWN0aW9uc1Byb3ZpZGVyIH0gZnJvbSAnLi4vZW52aXJvbm1lbnRBY3Rpb25zL0Vudmlyb25tZW50QWN0aW9uc1Byb3ZpZGVyJztcbmltcG9ydCB7IHVzZUNvbnRyb2xsZWRUcmVlRW52aXJvbm1lbnRQcm9wcyB9IGZyb20gJy4vdXNlQ29udHJvbGxlZFRyZWVFbnZpcm9ubWVudFByb3BzJztcbnZhciBUcmVlRW52aXJvbm1lbnRDb250ZXh0ID0gUmVhY3QuY3JlYXRlQ29udGV4dChudWxsKTtcbmV4cG9ydCB2YXIgdXNlVHJlZUVudmlyb25tZW50ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdXNlQ29udGV4dChUcmVlRW52aXJvbm1lbnRDb250ZXh0KTsgfTtcbmV4cG9ydCB2YXIgQ29udHJvbGxlZFRyZWVFbnZpcm9ubWVudCA9IFJlYWN0LmZvcndhcmRSZWYoZnVuY3Rpb24gKHByb3BzLCByZWYpIHtcbiAgICB2YXIgX2EsIF9iLCBfYztcbiAgICB2YXIgZW52aXJvbm1lbnRDb250ZXh0UHJvcHMgPSB1c2VDb250cm9sbGVkVHJlZUVudmlyb25tZW50UHJvcHMocHJvcHMpO1xuICAgIHZhciB2aWV3U3RhdGUgPSBwcm9wcy52aWV3U3RhdGU7XG4gICAgLy8gTWFrZSBzdXJlIHRoYXQgZXZlcnkgdHJlZSB2aWV3IHN0YXRlIGhhcyBhIGZvY3VzZWQgaXRlbVxuICAgIGZvciAodmFyIF9pID0gMCwgX2QgPSBPYmplY3Qua2V5cyhlbnZpcm9ubWVudENvbnRleHRQcm9wcy50cmVlcyk7IF9pIDwgX2QubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIHZhciB0cmVlSWQgPSBfZFtfaV07XG4gICAgICAgIC8vIFRPRE8gaWYgdGhlIGZvY3VzIGl0ZW0gaXMgZHJhZ2dlZCBvdXQgb2YgdGhlIHRyZWUgYW5kIGlzIG5vdCB3aXRoaW4gdGhlIGV4cGFuZGVkIGl0ZW1zXG4gICAgICAgIC8vIFRPRE8gb2YgdGhhdCB0cmVlLCB0aGUgdHJlZSBkb2VzIG5vdCBzaG93IGFueSBmb2N1cyBpdGVtIGFueW1vcmUuXG4gICAgICAgIC8vIEZpeDogdXNlIGxpbmVhciBpdGVtcyB0byBzZWUgaWYgZm9jdXMgaXRlbSBpcyB2aXNpYmxlLCBhbmQgcmVzZXQgaWYgbm90LiBPbmx5IHJlZnJlc2ggdGhhdFxuICAgICAgICAvLyBpbmZvcm1hdGlvbiB3aGVuIHRoZSB2aWV3c3RhdGUgY2hhbmdlc1xuICAgICAgICBpZiAoISgoX2EgPSB2aWV3U3RhdGVbdHJlZUlkXSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmZvY3VzZWRJdGVtKSAmJlxuICAgICAgICAgICAgZW52aXJvbm1lbnRDb250ZXh0UHJvcHMudHJlZXNbdHJlZUlkXSkge1xuICAgICAgICAgICAgdmlld1N0YXRlW3RyZWVJZF0gPSBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgdmlld1N0YXRlW3RyZWVJZF0pLCB7IGZvY3VzZWRJdGVtOiAoX2MgPSAoX2IgPSBwcm9wcy5pdGVtc1tlbnZpcm9ubWVudENvbnRleHRQcm9wcy50cmVlc1t0cmVlSWRdLnJvb3RJdGVtXSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmNoaWxkcmVuKSA9PT0gbnVsbCB8fCBfYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2NbMF0gfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFRyZWVFbnZpcm9ubWVudENvbnRleHQuUHJvdmlkZXIsIHsgdmFsdWU6IGVudmlyb25tZW50Q29udGV4dFByb3BzIH0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSW50ZXJhY3Rpb25NYW5hZ2VyUHJvdmlkZXIsIG51bGwsXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KERyYWdBbmREcm9wUHJvdmlkZXIsIG51bGwsXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChFbnZpcm9ubWVudEFjdGlvbnNQcm92aWRlciwgeyByZWY6IHJlZiB9LCBwcm9wcy5jaGlsZHJlbikpKSkpO1xufSk7XG4iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VUcmVlIH0gZnJvbSAnLi9UcmVlJztcbmltcG9ydCB7IHVzZURyYWdBbmREcm9wIH0gZnJvbSAnLi4vZHJhZy9EcmFnQW5kRHJvcFByb3ZpZGVyJztcbmV4cG9ydCB2YXIgRHJhZ0JldHdlZW5MaW5lID0gZnVuY3Rpb24gKF9hKSB7XG4gICAgdmFyIF9iO1xuICAgIHZhciB0cmVlSWQgPSBfYS50cmVlSWQ7XG4gICAgdmFyIF9jID0gdXNlRHJhZ0FuZERyb3AoKSwgZHJhZ2dpbmdQb3NpdGlvbiA9IF9jLmRyYWdnaW5nUG9zaXRpb24sIGl0ZW1IZWlnaHQgPSBfYy5pdGVtSGVpZ2h0O1xuICAgIHZhciByZW5kZXJlcnMgPSB1c2VUcmVlKCkucmVuZGVyZXJzO1xuICAgIHZhciBzaG91bGREaXNwbGF5ID0gZHJhZ2dpbmdQb3NpdGlvbiAmJlxuICAgICAgICBkcmFnZ2luZ1Bvc2l0aW9uLnRhcmdldFR5cGUgPT09ICdiZXR3ZWVuLWl0ZW1zJyAmJlxuICAgICAgICBkcmFnZ2luZ1Bvc2l0aW9uLnRyZWVJZCA9PT0gdHJlZUlkO1xuICAgIGlmICghc2hvdWxkRGlzcGxheSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgdmFyIGxpbmVQcm9wcyA9IHtcbiAgICAgICAgb25EcmFnT3ZlcjogZnVuY3Rpb24gKGUpIHsgcmV0dXJuIGUucHJldmVudERlZmF1bHQoKTsgfSwgLy8gQWxsb3cgZHJvcHBpbmdcbiAgICB9O1xuICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IHN0eWxlOiB7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIGxlZnQ6ICcwJyxcbiAgICAgICAgICAgIHJpZ2h0OiAnMCcsXG4gICAgICAgICAgICB0b3A6IFwiXCIuY29uY2F0KCgoX2IgPSBkcmFnZ2luZ1Bvc2l0aW9uID09PSBudWxsIHx8IGRyYWdnaW5nUG9zaXRpb24gPT09IHZvaWQgMCA/IHZvaWQgMCA6IGRyYWdnaW5nUG9zaXRpb24ubGluZWFySW5kZXgpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IDApICogaXRlbUhlaWdodCwgXCJweFwiKSxcbiAgICAgICAgfSB9LCByZW5kZXJlcnMucmVuZGVyRHJhZ0JldHdlZW5MaW5lKHtcbiAgICAgICAgZHJhZ2dpbmdQb3NpdGlvbjogZHJhZ2dpbmdQb3NpdGlvbixcbiAgICAgICAgbGluZVByb3BzOiBsaW5lUHJvcHMsXG4gICAgfSkpKTtcbn07XG4iLCJpbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VTdGFibGVIYW5kbGVyIH0gZnJvbSAnLi91c2VTdGFibGVIYW5kbGVyJztcbmV4cG9ydCB2YXIgdXNlSHRtbEVsZW1lbnRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24gKGVsZW1lbnQsIHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgdmFyIHN0YWJsZUxpc3RlbmVyID0gdXNlU3RhYmxlSGFuZGxlcihsaXN0ZW5lcik7XG4gICAgdXNlRWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBzdGFibGVMaXN0ZW5lcik7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkgeyByZXR1cm4gZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIHN0YWJsZUxpc3RlbmVyKTsgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkgeyB9O1xuICAgIH0sIFtlbGVtZW50LCBzdGFibGVMaXN0ZW5lciwgdHlwZV0pO1xufTtcbiIsImltcG9ydCB7IHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VIdG1sRWxlbWVudEV2ZW50TGlzdGVuZXIgfSBmcm9tICcuLi91c2VIdG1sRWxlbWVudEV2ZW50TGlzdGVuZXInO1xuaW1wb3J0IHsgdXNlQ2FsbFNvb24gfSBmcm9tICcuLi91c2VDYWxsU29vbic7XG5leHBvcnQgdmFyIHVzZUZvY3VzV2l0aGluID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9uRm9jdXNJbiwgb25Gb2N1c091dCkge1xuICAgIHZhciBfYSA9IHVzZVN0YXRlKGZhbHNlKSwgZm9jdXNXaXRoaW4gPSBfYVswXSwgc2V0Rm9jdXNXaXRoaW4gPSBfYVsxXTtcbiAgICB2YXIgaXNMb29zaW5nRm9jdXNGbGFnID0gdXNlUmVmKGZhbHNlKTtcbiAgICB2YXIgY2FsbFNvb24gPSB1c2VDYWxsU29vbigpO1xuICAgIHVzZUh0bWxFbGVtZW50RXZlbnRMaXN0ZW5lcihlbGVtZW50LCAnZm9jdXNpbicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCFmb2N1c1dpdGhpbikge1xuICAgICAgICAgICAgc2V0Rm9jdXNXaXRoaW4odHJ1ZSk7XG4gICAgICAgICAgICBvbkZvY3VzSW4gPT09IG51bGwgfHwgb25Gb2N1c0luID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvbkZvY3VzSW4oKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNMb29zaW5nRm9jdXNGbGFnLmN1cnJlbnQpIHtcbiAgICAgICAgICAgIGlzTG9vc2luZ0ZvY3VzRmxhZy5jdXJyZW50ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICB1c2VIdG1sRWxlbWVudEV2ZW50TGlzdGVuZXIoZWxlbWVudCwgJ2ZvY3Vzb3V0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICBpc0xvb3NpbmdGb2N1c0ZsYWcuY3VycmVudCA9IHRydWU7XG4gICAgICAgIGNhbGxTb29uKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChpc0xvb3NpbmdGb2N1c0ZsYWcuY3VycmVudCAmJlxuICAgICAgICAgICAgICAgICEoZWxlbWVudCA9PT0gbnVsbCB8fCBlbGVtZW50ID09PSB2b2lkIDAgPyB2b2lkIDAgOiBlbGVtZW50LmNvbnRhaW5zKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpKSkge1xuICAgICAgICAgICAgICAgIG9uRm9jdXNPdXQgPT09IG51bGwgfHwgb25Gb2N1c091dCA9PT0gdm9pZCAwID8gdm9pZCAwIDogb25Gb2N1c091dCgpO1xuICAgICAgICAgICAgICAgIGlzTG9vc2luZ0ZvY3VzRmxhZy5jdXJyZW50ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgc2V0Rm9jdXNXaXRoaW4oZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gZm9jdXNXaXRoaW47XG59O1xuIiwiaW1wb3J0IHsgdXNlSHRtbEVsZW1lbnRFdmVudExpc3RlbmVyIH0gZnJvbSAnLi4vdXNlSHRtbEVsZW1lbnRFdmVudExpc3RlbmVyJztcbmltcG9ydCB7IGdldERvY3VtZW50IH0gZnJvbSAnLi4vdXRpbHMnO1xuZXhwb3J0IHZhciB1c2VLZXkgPSBmdW5jdGlvbiAoa2V5LCBvbkhpdCwgYWN0aXZlKSB7XG4gICAgdXNlSHRtbEVsZW1lbnRFdmVudExpc3RlbmVyKGdldERvY3VtZW50KCksICdrZXlkb3duJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKCFhY3RpdmUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYWN0aXZlICYmIGtleS50b0xvd2VyQ2FzZSgpID09PSBlLmtleS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICAgICBvbkhpdChlKTtcbiAgICAgICAgfVxuICAgIH0pO1xufTtcbiIsImV4cG9ydCB2YXIgZGVmYXVsdEtleWJvYXJkQmluZGluZ3MgPSB7XG4gICAgZXhwYW5kU2libGluZ3M6IFsnY29udHJvbCsqJ10sXG4gICAgbW92ZUZvY3VzVG9GaXJzdEl0ZW06IFsnaG9tZSddLFxuICAgIG1vdmVGb2N1c1RvTGFzdEl0ZW06IFsnZW5kJ10sXG4gICAgcHJpbWFyeUFjdGlvbjogWydlbnRlciddLFxuICAgIHJlbmFtZUl0ZW06IFsnZjInXSxcbiAgICBhYm9ydFJlbmFtZUl0ZW06IFsnZXNjYXBlJ10sXG4gICAgdG9nZ2xlU2VsZWN0SXRlbTogWydjb250cm9sK3NwYWNlJ10sXG4gICAgYWJvcnRTZWFyY2g6IFsnZXNjYXBlJywgJ2VudGVyJ10sXG4gICAgc3RhcnRTZWFyY2g6IFtdLFxuICAgIHNlbGVjdEFsbDogWydjb250cm9sK2EnXSxcbiAgICBzdGFydFByb2dyYW1tYXRpY0RuZDogWydjb250cm9sK2QnXSxcbiAgICBjb21wbGV0ZVByb2dyYW1tYXRpY0RuZDogWydlbnRlciddLFxuICAgIGFib3J0UHJvZ3JhbW1hdGljRG5kOiBbJ2VzY2FwZSddLFxufTtcbiIsInZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IGZ1bmN0aW9uICgpIHtcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXG4gICAgICAgICAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5pbXBvcnQgeyB1c2VNZW1vIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlVHJlZUVudmlyb25tZW50IH0gZnJvbSAnLi4vY29udHJvbGxlZEVudmlyb25tZW50L0NvbnRyb2xsZWRUcmVlRW52aXJvbm1lbnQnO1xuaW1wb3J0IHsgZGVmYXVsdEtleWJvYXJkQmluZGluZ3MgfSBmcm9tICcuL2RlZmF1bHRLZXlib2FyZEJpbmRpbmdzJztcbmV4cG9ydCB2YXIgdXNlS2V5Ym9hcmRCaW5kaW5ncyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZW52aXJvbm1lbnQgPSB1c2VUcmVlRW52aXJvbm1lbnQoKTtcbiAgICByZXR1cm4gdXNlTWVtbyhmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChlbnZpcm9ubWVudC5rZXlib2FyZEJpbmRpbmdzKSB7XG4gICAgICAgICAgICByZXR1cm4gX19hc3NpZ24oX19hc3NpZ24oe30sIGRlZmF1bHRLZXlib2FyZEJpbmRpbmdzKSwgZW52aXJvbm1lbnQua2V5Ym9hcmRCaW5kaW5ncyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlZmF1bHRLZXlib2FyZEJpbmRpbmdzO1xuICAgIH0sIFtlbnZpcm9ubWVudC5rZXlib2FyZEJpbmRpbmdzXSk7XG59O1xuIiwiaW1wb3J0IHsgdXNlTWVtbywgdXNlUmVmIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlSHRtbEVsZW1lbnRFdmVudExpc3RlbmVyIH0gZnJvbSAnLi4vdXNlSHRtbEVsZW1lbnRFdmVudExpc3RlbmVyJztcbmltcG9ydCB7IHVzZUtleWJvYXJkQmluZGluZ3MgfSBmcm9tICcuL3VzZUtleWJvYXJkQmluZGluZ3MnO1xuaW1wb3J0IHsgdXNlQ2FsbFNvb24gfSBmcm9tICcuLi91c2VDYWxsU29vbic7XG5pbXBvcnQgeyBnZXREb2N1bWVudCB9IGZyb20gJy4uL3V0aWxzJztcbnZhciBlbGVtZW50c1RoYXRDYW5UYWtlVGV4dCA9IFsnaW5wdXQnLCAndGV4dGFyZWEnXTtcbmV4cG9ydCB2YXIgdXNlSG90a2V5ID0gZnVuY3Rpb24gKGNvbWJpbmF0aW9uTmFtZSwgb25IaXQsIGFjdGl2ZSwgYWN0aXZhdGFibGVXaGlsZUZvY3VzaW5nSW5wdXQpIHtcbiAgICBpZiAoYWN0aXZhdGFibGVXaGlsZUZvY3VzaW5nSW5wdXQgPT09IHZvaWQgMCkgeyBhY3RpdmF0YWJsZVdoaWxlRm9jdXNpbmdJbnB1dCA9IGZhbHNlOyB9XG4gICAgdmFyIHByZXNzZWRLZXlzID0gdXNlUmVmKFtdKTtcbiAgICB2YXIga2V5Ym9hcmRCaW5kaW5ncyA9IHVzZUtleWJvYXJkQmluZGluZ3MoKTtcbiAgICB2YXIgY2FsbFNvb24gPSB1c2VDYWxsU29vbigpO1xuICAgIHZhciBwb3NzaWJsZUNvbWJpbmF0aW9ucyA9IHVzZU1lbW8oZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4ga2V5Ym9hcmRCaW5kaW5nc1tjb21iaW5hdGlvbk5hbWVdLm1hcChmdW5jdGlvbiAoY29tYmluYXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBjb21iaW5hdGlvbi5zcGxpdCgnKycpO1xuICAgICAgICB9KTtcbiAgICB9LCBbY29tYmluYXRpb25OYW1lLCBrZXlib2FyZEJpbmRpbmdzXSk7XG4gICAgdXNlSHRtbEVsZW1lbnRFdmVudExpc3RlbmVyKGdldERvY3VtZW50KCksICdrZXlkb3duJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBpZiAoYWN0aXZlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICgoZWxlbWVudHNUaGF0Q2FuVGFrZVRleHQuaW5jbHVkZXMoKF9hID0gZS50YXJnZXQudGFnTmFtZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnRvTG93ZXJDYXNlKCkpIHx8XG4gICAgICAgICAgICBlLnRhcmdldC5pc0NvbnRlbnRFZGl0YWJsZSkgJiZcbiAgICAgICAgICAgICFhY3RpdmF0YWJsZVdoaWxlRm9jdXNpbmdJbnB1dCkge1xuICAgICAgICAgICAgLy8gU2tpcCBpZiBhbiBpbnB1dCBpcyBzZWxlY3RlZFxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICghcHJlc3NlZEtleXMuY3VycmVudC5pbmNsdWRlcyhlLmtleSkpIHtcbiAgICAgICAgICAgIHByZXNzZWRLZXlzLmN1cnJlbnQucHVzaChlLmtleSk7XG4gICAgICAgICAgICB2YXIgcHJlc3NlZEtleXNMb3dlcmNhc2VfMSA9IHByZXNzZWRLZXlzLmN1cnJlbnQubWFwKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ga2V5LnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciBwYXJ0aWFsTWF0Y2ggPSBwb3NzaWJsZUNvbWJpbmF0aW9uc1xuICAgICAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKGNvbWJpbmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByZXNzZWRLZXlzTG93ZXJjYXNlXzFcbiAgICAgICAgICAgICAgICAgICAgLm1hcChmdW5jdGlvbiAoa2V5KSB7IHJldHVybiBjb21iaW5hdGlvbi5pbmNsdWRlcyhrZXkudG9Mb3dlckNhc2UoKSk7IH0pXG4gICAgICAgICAgICAgICAgICAgIC5yZWR1Y2UoZnVuY3Rpb24gKGEsIGIpIHsgcmV0dXJuIGEgJiYgYjsgfSwgdHJ1ZSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5yZWR1Y2UoZnVuY3Rpb24gKGEsIGIpIHsgcmV0dXJuIGEgfHwgYjsgfSwgZmFsc2UpO1xuICAgICAgICAgICAgaWYgKHBhcnRpYWxNYXRjaCkge1xuICAgICAgICAgICAgICAgIGlmIChwcmVzc2VkS2V5cy5jdXJyZW50Lmxlbmd0aCA+IDEgfHwgIS9eW2EtekEtWl0kLy50ZXN0KGUua2V5KSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBQcmV2ZW50IGRlZmF1bHQsIGJ1dCBub3QgaWYgdGhpcyBpcyB0aGUgZmlyc3QgaW5wdXQgYW5kIGEgbGV0dGVyICh3aGljaCBzaG91bGQgdHJpZ2dlciBhIHNlYXJjaClcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHVzZUh0bWxFbGVtZW50RXZlbnRMaXN0ZW5lcihnZXREb2N1bWVudCgpLCAna2V5dXAnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoYWN0aXZlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwcmVzc2VkS2V5c0xvd2VyY2FzZSA9IHByZXNzZWRLZXlzLmN1cnJlbnQubWFwKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBrZXkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBtYXRjaCA9IHBvc3NpYmxlQ29tYmluYXRpb25zXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uIChjb21iaW5hdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIGNvbWJpbmF0aW9uXG4gICAgICAgICAgICAgICAgLm1hcChmdW5jdGlvbiAoa2V5KSB7IHJldHVybiBwcmVzc2VkS2V5c0xvd2VyY2FzZS5pbmNsdWRlcyhrZXkudG9Mb3dlckNhc2UoKSk7IH0pXG4gICAgICAgICAgICAgICAgLnJlZHVjZShmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gYSAmJiBiOyB9LCB0cnVlKTtcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC5yZWR1Y2UoZnVuY3Rpb24gKGEsIGIpIHsgcmV0dXJuIGEgfHwgYjsgfSwgZmFsc2UpO1xuICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgIGNhbGxTb29uKGZ1bmN0aW9uICgpIHsgcmV0dXJuIG9uSGl0KGUpOyB9KTtcbiAgICAgICAgfVxuICAgICAgICBwcmVzc2VkS2V5cy5jdXJyZW50ID0gcHJlc3NlZEtleXMuY3VycmVudC5maWx0ZXIoZnVuY3Rpb24gKGtleSkgeyByZXR1cm4ga2V5ICE9PSBlLmtleTsgfSk7XG4gICAgfSk7XG59O1xuIiwiaW1wb3J0IHsgdXNlVHJlZSB9IGZyb20gJy4vVHJlZSc7XG5pbXBvcnQgeyB1c2VUcmVlRW52aXJvbm1lbnQgfSBmcm9tICcuLi9jb250cm9sbGVkRW52aXJvbm1lbnQvQ29udHJvbGxlZFRyZWVFbnZpcm9ubWVudCc7XG5leHBvcnQgdmFyIHVzZVZpZXdTdGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgX2E7XG4gICAgdmFyIHRyZWVJZCA9IHVzZVRyZWUoKS50cmVlSWQ7XG4gICAgdmFyIHZpZXdTdGF0ZSA9IHVzZVRyZWVFbnZpcm9ubWVudCgpLnZpZXdTdGF0ZTtcbiAgICByZXR1cm4gKF9hID0gdmlld1N0YXRlW3RyZWVJZF0pICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IHt9O1xufTtcbiIsImltcG9ydCB7IHVzZVRyZWVFbnZpcm9ubWVudCB9IGZyb20gJy4vQ29udHJvbGxlZFRyZWVFbnZpcm9ubWVudCc7XG5leHBvcnQgdmFyIHVzZUxpbmVhckl0ZW1zID0gZnVuY3Rpb24gKHRyZWVJZCkge1xuICAgIHJldHVybiB1c2VUcmVlRW52aXJvbm1lbnQoKS5saW5lYXJJdGVtc1t0cmVlSWRdO1xufTtcbiIsImltcG9ydCB7IHVzZVZpZXdTdGF0ZSB9IGZyb20gJy4vdXNlVmlld1N0YXRlJztcbmltcG9ydCB7IHVzZVRyZWUgfSBmcm9tICcuL1RyZWUnO1xuaW1wb3J0IHsgdXNlVHJlZUVudmlyb25tZW50IH0gZnJvbSAnLi4vY29udHJvbGxlZEVudmlyb25tZW50L0NvbnRyb2xsZWRUcmVlRW52aXJvbm1lbnQnO1xuaW1wb3J0IHsgdXNlTGluZWFySXRlbXMgfSBmcm9tICcuLi9jb250cm9sbGVkRW52aXJvbm1lbnQvdXNlTGluZWFySXRlbXMnO1xuaW1wb3J0IHsgdXNlU3RhYmxlSGFuZGxlciB9IGZyb20gJy4uL3VzZVN0YWJsZUhhbmRsZXInO1xuZXhwb3J0IHZhciB1c2VNb3ZlRm9jdXNUb0luZGV4ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB0cmVlSWQgPSB1c2VUcmVlKCkudHJlZUlkO1xuICAgIHZhciBfYSA9IHVzZVRyZWVFbnZpcm9ubWVudCgpLCBvbkZvY3VzSXRlbSA9IF9hLm9uRm9jdXNJdGVtLCBpdGVtcyA9IF9hLml0ZW1zO1xuICAgIHZhciBsaW5lYXJJdGVtcyA9IHVzZUxpbmVhckl0ZW1zKHRyZWVJZCk7XG4gICAgdmFyIHZpZXdTdGF0ZSA9IHVzZVZpZXdTdGF0ZSgpO1xuICAgIHJldHVybiB1c2VTdGFibGVIYW5kbGVyKGZ1bmN0aW9uIChjb21wdXRlTmV3SW5kZXgpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICB2YXIgY3VycmVudEluZGV4ID0gKF9hID0gbGluZWFySXRlbXMuZmluZEluZGV4KGZ1bmN0aW9uIChpdGVtKSB7IHJldHVybiBpdGVtLml0ZW0gPT09IHZpZXdTdGF0ZS5mb2N1c2VkSXRlbTsgfSkpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IDA7XG4gICAgICAgIHZhciBuZXdJbmRleCA9IGNvbXB1dGVOZXdJbmRleChjdXJyZW50SW5kZXgsIGxpbmVhckl0ZW1zKTtcbiAgICAgICAgdmFyIG5ld0luZGV4Qm91bmRlZCA9IE1hdGgubWF4KDAsIE1hdGgubWluKGxpbmVhckl0ZW1zLmxlbmd0aCAtIDEsIG5ld0luZGV4KSk7XG4gICAgICAgIHZhciBuZXdGb2N1c0l0ZW0gPSBpdGVtc1tsaW5lYXJJdGVtc1tuZXdJbmRleEJvdW5kZWRdLml0ZW1dO1xuICAgICAgICBvbkZvY3VzSXRlbSA9PT0gbnVsbCB8fCBvbkZvY3VzSXRlbSA9PT0gdm9pZCAwID8gdm9pZCAwIDogb25Gb2N1c0l0ZW0obmV3Rm9jdXNJdGVtLCB0cmVlSWQpO1xuICAgICAgICByZXR1cm4gbmV3Rm9jdXNJdGVtO1xuICAgIH0pO1xufTtcbiIsInZhciBfX3NwcmVhZEFycmF5ID0gKHRoaXMgJiYgdGhpcy5fX3NwcmVhZEFycmF5KSB8fCBmdW5jdGlvbiAodG8sIGZyb20sIHBhY2spIHtcbiAgICBpZiAocGFjayB8fCBhcmd1bWVudHMubGVuZ3RoID09PSAyKSBmb3IgKHZhciBpID0gMCwgbCA9IGZyb20ubGVuZ3RoLCBhcjsgaSA8IGw7IGkrKykge1xuICAgICAgICBpZiAoYXIgfHwgIShpIGluIGZyb20pKSB7XG4gICAgICAgICAgICBpZiAoIWFyKSBhciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20sIDAsIGkpO1xuICAgICAgICAgICAgYXJbaV0gPSBmcm9tW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0by5jb25jYXQoYXIgfHwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSkpO1xufTtcbmltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VSZWYgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VWaWV3U3RhdGUgfSBmcm9tICcuL3VzZVZpZXdTdGF0ZSc7XG5pbXBvcnQgeyB1c2VUcmVlIH0gZnJvbSAnLi9UcmVlJztcbmltcG9ydCB7IHVzZVRyZWVFbnZpcm9ubWVudCB9IGZyb20gJy4uL2NvbnRyb2xsZWRFbnZpcm9ubWVudC9Db250cm9sbGVkVHJlZUVudmlyb25tZW50JztcbmltcG9ydCB7IHVzZUxpbmVhckl0ZW1zIH0gZnJvbSAnLi4vY29udHJvbGxlZEVudmlyb25tZW50L3VzZUxpbmVhckl0ZW1zJztcbnZhciB1c2VQcmV2aW91cyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHZhciByZWYgPSB1c2VSZWYoe1xuICAgICAgICB0YXJnZXQ6IHZhbHVlLFxuICAgICAgICBwcmV2aW91czogdW5kZWZpbmVkLFxuICAgIH0pO1xuICAgIGlmIChyZWYuY3VycmVudC50YXJnZXQgIT09IHZhbHVlKSB7XG4gICAgICAgIHJlZi5jdXJyZW50LnByZXZpb3VzID0gcmVmLmN1cnJlbnQudGFyZ2V0O1xuICAgICAgICByZWYuY3VycmVudC50YXJnZXQgPSB2YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHJlZi5jdXJyZW50LnByZXZpb3VzO1xufTtcbmV4cG9ydCB2YXIgdXNlU2VsZWN0VXBUbyA9IGZ1bmN0aW9uIChzdGFydGluZ0F0KSB7XG4gICAgdmFyIHZpZXdTdGF0ZSA9IHVzZVZpZXdTdGF0ZSgpO1xuICAgIHZhciB0cmVlSWQgPSB1c2VUcmVlKCkudHJlZUlkO1xuICAgIHZhciBsaW5lYXJJdGVtcyA9IHVzZUxpbmVhckl0ZW1zKHRyZWVJZCk7XG4gICAgdmFyIG9uU2VsZWN0SXRlbXMgPSB1c2VUcmVlRW52aXJvbm1lbnQoKS5vblNlbGVjdEl0ZW1zO1xuICAgIHZhciBmb2N1c2VkSXRlbVByZXZpb3VzID0gdXNlUHJldmlvdXModmlld1N0YXRlLmZvY3VzZWRJdGVtKTtcbiAgICByZXR1cm4gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKGl0ZW0sIG92ZXJyaWRlT2xkU2VsZWN0aW9uKSB7XG4gICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgIGlmIChvdmVycmlkZU9sZFNlbGVjdGlvbiA9PT0gdm9pZCAwKSB7IG92ZXJyaWRlT2xkU2VsZWN0aW9uID0gZmFsc2U7IH1cbiAgICAgICAgdmFyIGl0ZW1JbmRleCA9IGl0ZW0uaW5kZXg7XG4gICAgICAgIHZhciBzZWxlY3RNZXJnZWRJdGVtcyA9IGZ1bmN0aW9uIChvbGRTZWxlY3Rpb24sIG5ld1NlbGVjdGlvbikge1xuICAgICAgICAgICAgdmFyIG1lcmdlZCA9IF9fc3ByZWFkQXJyYXkoX19zcHJlYWRBcnJheShbXSwgKG92ZXJyaWRlT2xkU2VsZWN0aW9uID8gW10gOiBvbGRTZWxlY3Rpb24pLCB0cnVlKSwgbmV3U2VsZWN0aW9uLmZpbHRlcihmdW5jdGlvbiAoaSkgeyByZXR1cm4gb3ZlcnJpZGVPbGRTZWxlY3Rpb24gfHwgIW9sZFNlbGVjdGlvbi5pbmNsdWRlcyhpKTsgfSksIHRydWUpO1xuICAgICAgICAgICAgb25TZWxlY3RJdGVtcyA9PT0gbnVsbCB8fCBvblNlbGVjdEl0ZW1zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvblNlbGVjdEl0ZW1zKG1lcmdlZCwgdHJlZUlkKTtcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHZpZXdTdGF0ZSAmJlxuICAgICAgICAgICAgdmlld1N0YXRlLnNlbGVjdGVkSXRlbXMgJiZcbiAgICAgICAgICAgIHZpZXdTdGF0ZS5zZWxlY3RlZEl0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIC8vIERlcGVuZGluZyBvbiB3aGV0aGVyIGZvY3VzSXRlbSgpIG9yIHNlbGVjdFVwVG8oKSB3YXMgY2FsbGVkIGZpcnN0LCB3aGljaCBpdGVtIHdhcyB0aGUgbGFzdCBmb2N1c2VkIGl0ZW0gZGVwZW5kc1xuICAgICAgICAgICAgdmFyIGxhc3RGb2N1c18xID0gdmlld1N0YXRlLmZvY3VzZWRJdGVtID09PSBpdGVtSW5kZXhcbiAgICAgICAgICAgICAgICA/IGZvY3VzZWRJdGVtUHJldmlvdXNcbiAgICAgICAgICAgICAgICA6IHZpZXdTdGF0ZS5mb2N1c2VkSXRlbTtcbiAgICAgICAgICAgIHZhciBzZWxlY3Rpb25TdGFydCA9IHN0YXJ0aW5nQXQgPT09ICdsYXN0LWZvY3VzJ1xuICAgICAgICAgICAgICAgID8gbGluZWFySXRlbXMuZmluZEluZGV4KGZ1bmN0aW9uIChsaW5lYXJJdGVtKSB7IHJldHVybiBsYXN0Rm9jdXNfMSA9PT0gbGluZWFySXRlbS5pdGVtOyB9KVxuICAgICAgICAgICAgICAgIDogbGluZWFySXRlbXMuZmluZEluZGV4KGZ1bmN0aW9uIChsaW5lYXJJdGVtKSB7IHZhciBfYTsgcmV0dXJuIChfYSA9IHZpZXdTdGF0ZS5zZWxlY3RlZEl0ZW1zKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuaW5jbHVkZXMobGluZWFySXRlbS5pdGVtKTsgfSk7XG4gICAgICAgICAgICB2YXIgc2VsZWN0aW9uRW5kID0gbGluZWFySXRlbXMuZmluZEluZGV4KGZ1bmN0aW9uIChsaW5lYXJJdGVtKSB7IHJldHVybiBsaW5lYXJJdGVtLml0ZW0gPT09IGl0ZW1JbmRleDsgfSk7XG4gICAgICAgICAgICBpZiAoc2VsZWN0aW9uU3RhcnQgPCBzZWxlY3Rpb25FbmQpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZWN0aW9uID0gbGluZWFySXRlbXNcbiAgICAgICAgICAgICAgICAgICAgLnNsaWNlKHNlbGVjdGlvblN0YXJ0LCBzZWxlY3Rpb25FbmQgKyAxKVxuICAgICAgICAgICAgICAgICAgICAubWFwKGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IF9hLml0ZW07XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHNlbGVjdE1lcmdlZEl0ZW1zKChfYSA9IHZpZXdTdGF0ZS5zZWxlY3RlZEl0ZW1zKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBbXSwgc2VsZWN0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBzZWxlY3Rpb24gPSBsaW5lYXJJdGVtc1xuICAgICAgICAgICAgICAgICAgICAuc2xpY2Uoc2VsZWN0aW9uRW5kLCBzZWxlY3Rpb25TdGFydCArIDEpXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpdGVtID0gX2EuaXRlbTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgc2VsZWN0TWVyZ2VkSXRlbXMoKF9iID0gdmlld1N0YXRlLnNlbGVjdGVkSXRlbXMpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IFtdLCBzZWxlY3Rpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgb25TZWxlY3RJdGVtcyA9PT0gbnVsbCB8fCBvblNlbGVjdEl0ZW1zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvblNlbGVjdEl0ZW1zKFtpdGVtSW5kZXhdLCB0cmVlSWQpO1xuICAgICAgICB9XG4gICAgfSwgW1xuICAgICAgICB2aWV3U3RhdGUsXG4gICAgICAgIG9uU2VsZWN0SXRlbXMsXG4gICAgICAgIHRyZWVJZCxcbiAgICAgICAgc3RhcnRpbmdBdCxcbiAgICAgICAgbGluZWFySXRlbXMsXG4gICAgICAgIGZvY3VzZWRJdGVtUHJldmlvdXMsXG4gICAgXSk7XG59O1xuIiwidmFyIF9fc3ByZWFkQXJyYXkgPSAodGhpcyAmJiB0aGlzLl9fc3ByZWFkQXJyYXkpIHx8IGZ1bmN0aW9uICh0bywgZnJvbSwgcGFjaykge1xuICAgIGlmIChwYWNrIHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIGZvciAodmFyIGkgPSAwLCBsID0gZnJvbS5sZW5ndGgsIGFyOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGlmIChhciB8fCAhKGkgaW4gZnJvbSkpIHtcbiAgICAgICAgICAgIGlmICghYXIpIGFyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSwgMCwgaSk7XG4gICAgICAgICAgICBhcltpXSA9IGZyb21baV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRvLmNvbmNhdChhciB8fCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tKSk7XG59O1xuaW1wb3J0IHsgdXNlS2V5IH0gZnJvbSAnLi4vaG90a2V5cy91c2VLZXknO1xuaW1wb3J0IHsgdXNlSG90a2V5IH0gZnJvbSAnLi4vaG90a2V5cy91c2VIb3RrZXknO1xuaW1wb3J0IHsgdXNlTW92ZUZvY3VzVG9JbmRleCB9IGZyb20gJy4vdXNlTW92ZUZvY3VzVG9JbmRleCc7XG5pbXBvcnQgeyB1c2VWaWV3U3RhdGUgfSBmcm9tICcuL3VzZVZpZXdTdGF0ZSc7XG5pbXBvcnQgeyB1c2VUcmVlIH0gZnJvbSAnLi9UcmVlJztcbmltcG9ydCB7IHVzZVRyZWVFbnZpcm9ubWVudCB9IGZyb20gJy4uL2NvbnRyb2xsZWRFbnZpcm9ubWVudC9Db250cm9sbGVkVHJlZUVudmlyb25tZW50JztcbmltcG9ydCB7IHVzZURyYWdBbmREcm9wIH0gZnJvbSAnLi4vZHJhZy9EcmFnQW5kRHJvcFByb3ZpZGVyJztcbmltcG9ydCB7IHVzZVNlbGVjdFVwVG8gfSBmcm9tICcuL3VzZVNlbGVjdFVwVG8nO1xuaW1wb3J0IHsgdXNlTGluZWFySXRlbXMgfSBmcm9tICcuLi9jb250cm9sbGVkRW52aXJvbm1lbnQvdXNlTGluZWFySXRlbXMnO1xuZXhwb3J0IHZhciB1c2VUcmVlS2V5Ym9hcmRCaW5kaW5ncyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgX2E7XG4gICAgdmFyIGVudmlyb25tZW50ID0gdXNlVHJlZUVudmlyb25tZW50KCk7XG4gICAgdmFyIF9iID0gdXNlVHJlZSgpLCB0cmVlSWQgPSBfYi50cmVlSWQsIHNldFJlbmFtaW5nSXRlbSA9IF9iLnNldFJlbmFtaW5nSXRlbSwgc2V0U2VhcmNoID0gX2Iuc2V0U2VhcmNoLCByZW5hbWluZ0l0ZW0gPSBfYi5yZW5hbWluZ0l0ZW07XG4gICAgdmFyIGxpbmVhckl0ZW1zID0gdXNlTGluZWFySXRlbXModHJlZUlkKTtcbiAgICB2YXIgZG5kID0gdXNlRHJhZ0FuZERyb3AoKTtcbiAgICB2YXIgdmlld1N0YXRlID0gdXNlVmlld1N0YXRlKCk7XG4gICAgdmFyIG1vdmVGb2N1c1RvSW5kZXggPSB1c2VNb3ZlRm9jdXNUb0luZGV4KCk7XG4gICAgdmFyIHNlbGVjdFVwVG8gPSB1c2VTZWxlY3RVcFRvKCdmaXJzdC1zZWxlY3RlZCcpO1xuICAgIHZhciBpc0FjdGl2ZVRyZWUgPSBlbnZpcm9ubWVudC5hY3RpdmVUcmVlSWQgPT09IHRyZWVJZDtcbiAgICB2YXIgaXNSZW5hbWluZyA9ICEhcmVuYW1pbmdJdGVtO1xuICAgIHZhciBkaXNhYmxlQXJyb3dLZXlzID0gZW52aXJvbm1lbnQuZGlzYWJsZUFycm93S2V5cztcbiAgICB2YXIgZW5hYmxlQXJyb3dLZXlzID0gIWRpc2FibGVBcnJvd0tleXMgJiYgaXNBY3RpdmVUcmVlICYmICFpc1JlbmFtaW5nO1xuICAgIHVzZUtleSgnYXJyb3dkb3duJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBpZiAoZG5kLmlzUHJvZ3JhbW1hdGljYWxseURyYWdnaW5nKSB7XG4gICAgICAgICAgICBkbmQucHJvZ3JhbW1hdGljRHJhZ0Rvd24oKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBuZXdGb2N1c0l0ZW0gPSBtb3ZlRm9jdXNUb0luZGV4KGZ1bmN0aW9uIChjdXJyZW50SW5kZXgpIHsgcmV0dXJuIGN1cnJlbnRJbmRleCArIDE7IH0pO1xuICAgICAgICAgICAgaWYgKGUuc2hpZnRLZXkpIHtcbiAgICAgICAgICAgICAgICBzZWxlY3RVcFRvKG5ld0ZvY3VzSXRlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LCBlbmFibGVBcnJvd0tleXMpO1xuICAgIHVzZUtleSgnYXJyb3d1cCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgaWYgKGRuZC5pc1Byb2dyYW1tYXRpY2FsbHlEcmFnZ2luZykge1xuICAgICAgICAgICAgZG5kLnByb2dyYW1tYXRpY0RyYWdVcCgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIG5ld0ZvY3VzSXRlbSA9IG1vdmVGb2N1c1RvSW5kZXgoZnVuY3Rpb24gKGN1cnJlbnRJbmRleCkgeyByZXR1cm4gY3VycmVudEluZGV4IC0gMTsgfSk7XG4gICAgICAgICAgICBpZiAoZS5zaGlmdEtleSkge1xuICAgICAgICAgICAgICAgIHNlbGVjdFVwVG8obmV3Rm9jdXNJdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sIGVuYWJsZUFycm93S2V5cyk7XG4gICAgdXNlSG90a2V5KCdtb3ZlRm9jdXNUb0ZpcnN0SXRlbScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgbW92ZUZvY3VzVG9JbmRleChmdW5jdGlvbiAoKSB7IHJldHVybiAwOyB9KTtcbiAgICB9LCBpc0FjdGl2ZVRyZWUgJiYgIWRuZC5pc1Byb2dyYW1tYXRpY2FsbHlEcmFnZ2luZyAmJiAhaXNSZW5hbWluZyk7XG4gICAgdXNlSG90a2V5KCdtb3ZlRm9jdXNUb0xhc3RJdGVtJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBtb3ZlRm9jdXNUb0luZGV4KGZ1bmN0aW9uIChjdXJyZW50SW5kZXgsIGxpbmVhckl0ZW1zKSB7IHJldHVybiBsaW5lYXJJdGVtcy5sZW5ndGggLSAxOyB9KTtcbiAgICB9LCBpc0FjdGl2ZVRyZWUgJiYgIWRuZC5pc1Byb2dyYW1tYXRpY2FsbHlEcmFnZ2luZyAmJiAhaXNSZW5hbWluZyk7XG4gICAgdXNlS2V5KCdhcnJvd3JpZ2h0JywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBtb3ZlRm9jdXNUb0luZGV4KGZ1bmN0aW9uIChjdXJyZW50SW5kZXgsIGxpbmVhckl0ZW1zKSB7XG4gICAgICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSBlbnZpcm9ubWVudC5pdGVtc1tsaW5lYXJJdGVtc1tjdXJyZW50SW5kZXhdLml0ZW1dO1xuICAgICAgICAgICAgaWYgKGl0ZW0uaXNGb2xkZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAoKF9hID0gdmlld1N0YXRlLmV4cGFuZGVkSXRlbXMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5pbmNsdWRlcyhpdGVtLmluZGV4KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3VycmVudEluZGV4ICsgMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKF9iID0gZW52aXJvbm1lbnQub25FeHBhbmRJdGVtKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuY2FsbChlbnZpcm9ubWVudCwgaXRlbSwgdHJlZUlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50SW5kZXg7XG4gICAgICAgIH0pO1xuICAgIH0sIGVuYWJsZUFycm93S2V5cyAmJiAhZG5kLmlzUHJvZ3JhbW1hdGljYWxseURyYWdnaW5nKTtcbiAgICB1c2VLZXkoJ2Fycm93bGVmdCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgbW92ZUZvY3VzVG9JbmRleChmdW5jdGlvbiAoY3VycmVudEluZGV4LCBsaW5lYXJJdGVtcykge1xuICAgICAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgICAgIHZhciBpdGVtID0gZW52aXJvbm1lbnQuaXRlbXNbbGluZWFySXRlbXNbY3VycmVudEluZGV4XS5pdGVtXTtcbiAgICAgICAgICAgIHZhciBpdGVtRGVwdGggPSBsaW5lYXJJdGVtc1tjdXJyZW50SW5kZXhdLmRlcHRoO1xuICAgICAgICAgICAgaWYgKGl0ZW0uaXNGb2xkZXIgJiYgKChfYSA9IHZpZXdTdGF0ZS5leHBhbmRlZEl0ZW1zKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuaW5jbHVkZXMoaXRlbS5pbmRleCkpKSB7XG4gICAgICAgICAgICAgICAgKF9iID0gZW52aXJvbm1lbnQub25Db2xsYXBzZUl0ZW0pID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5jYWxsKGVudmlyb25tZW50LCBpdGVtLCB0cmVlSWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoaXRlbURlcHRoID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciBwYXJlbnRJbmRleCA9IGN1cnJlbnRJbmRleDtcbiAgICAgICAgICAgICAgICBmb3IgKHBhcmVudEluZGV4OyBsaW5lYXJJdGVtc1twYXJlbnRJbmRleF0uZGVwdGggIT09IGl0ZW1EZXB0aCAtIDE7IHBhcmVudEluZGV4IC09IDEpXG4gICAgICAgICAgICAgICAgICAgIDtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyZW50SW5kZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY3VycmVudEluZGV4O1xuICAgICAgICB9KTtcbiAgICB9LCBlbmFibGVBcnJvd0tleXMgJiYgIWRuZC5pc1Byb2dyYW1tYXRpY2FsbHlEcmFnZ2luZyk7XG4gICAgdXNlSG90a2V5KCdwcmltYXJ5QWN0aW9uJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBpZiAodmlld1N0YXRlLmZvY3VzZWRJdGVtICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIChfYSA9IGVudmlyb25tZW50Lm9uU2VsZWN0SXRlbXMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5jYWxsKGVudmlyb25tZW50LCBbdmlld1N0YXRlLmZvY3VzZWRJdGVtXSwgdHJlZUlkKTtcbiAgICAgICAgICAgIChfYiA9IGVudmlyb25tZW50Lm9uUHJpbWFyeUFjdGlvbikgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmNhbGwoZW52aXJvbm1lbnQsIGVudmlyb25tZW50Lml0ZW1zW3ZpZXdTdGF0ZS5mb2N1c2VkSXRlbV0sIHRyZWVJZCk7XG4gICAgICAgIH1cbiAgICB9LCBpc0FjdGl2ZVRyZWUgJiYgIWRuZC5pc1Byb2dyYW1tYXRpY2FsbHlEcmFnZ2luZyAmJiAhaXNSZW5hbWluZyk7XG4gICAgdXNlSG90a2V5KCd0b2dnbGVTZWxlY3RJdGVtJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIF9hLCBfYiwgX2M7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgaWYgKHZpZXdTdGF0ZS5mb2N1c2VkSXRlbSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZiAodmlld1N0YXRlLnNlbGVjdGVkSXRlbXMgJiZcbiAgICAgICAgICAgICAgICB2aWV3U3RhdGUuc2VsZWN0ZWRJdGVtcy5pbmNsdWRlcyh2aWV3U3RhdGUuZm9jdXNlZEl0ZW0pKSB7XG4gICAgICAgICAgICAgICAgKF9hID0gZW52aXJvbm1lbnQub25TZWxlY3RJdGVtcykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmNhbGwoZW52aXJvbm1lbnQsIHZpZXdTdGF0ZS5zZWxlY3RlZEl0ZW1zLmZpbHRlcihmdW5jdGlvbiAoaXRlbSkgeyByZXR1cm4gaXRlbSAhPT0gdmlld1N0YXRlLmZvY3VzZWRJdGVtOyB9KSwgdHJlZUlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIChfYiA9IGVudmlyb25tZW50Lm9uU2VsZWN0SXRlbXMpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5jYWxsKGVudmlyb25tZW50LCBfX3NwcmVhZEFycmF5KF9fc3ByZWFkQXJyYXkoW10sICgoX2MgPSB2aWV3U3RhdGUuc2VsZWN0ZWRJdGVtcykgIT09IG51bGwgJiYgX2MgIT09IHZvaWQgMCA/IF9jIDogW10pLCB0cnVlKSwgW3ZpZXdTdGF0ZS5mb2N1c2VkSXRlbV0sIGZhbHNlKSwgdHJlZUlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sIGlzQWN0aXZlVHJlZSAmJiAhZG5kLmlzUHJvZ3JhbW1hdGljYWxseURyYWdnaW5nICYmICFpc1JlbmFtaW5nKTtcbiAgICB1c2VIb3RrZXkoJ3NlbGVjdEFsbCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAoX2EgPSBlbnZpcm9ubWVudC5vblNlbGVjdEl0ZW1zKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuY2FsbChlbnZpcm9ubWVudCwgbGluZWFySXRlbXMubWFwKGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSBfYS5pdGVtO1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgIH0pLCB0cmVlSWQpO1xuICAgIH0sIGlzQWN0aXZlVHJlZSAmJiAhZG5kLmlzUHJvZ3JhbW1hdGljYWxseURyYWdnaW5nICYmICFpc1JlbmFtaW5nKTtcbiAgICB1c2VIb3RrZXkoJ3JlbmFtZUl0ZW0nLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIGlmICh2aWV3U3RhdGUuZm9jdXNlZEl0ZW0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdmFyIGl0ZW0gPSBlbnZpcm9ubWVudC5pdGVtc1t2aWV3U3RhdGUuZm9jdXNlZEl0ZW1dO1xuICAgICAgICBpZiAoaXRlbS5jYW5SZW5hbWUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgKF9hID0gZW52aXJvbm1lbnQub25TdGFydFJlbmFtaW5nSXRlbSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmNhbGwoZW52aXJvbm1lbnQsIGl0ZW0sIHRyZWVJZCk7XG4gICAgICAgIHNldFJlbmFtaW5nSXRlbShpdGVtLmluZGV4KTtcbiAgICB9LCBpc0FjdGl2ZVRyZWUgJiYgKChfYSA9IGVudmlyb25tZW50LmNhblJlbmFtZSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogdHJ1ZSkgJiYgIWlzUmVuYW1pbmcpO1xuICAgIHVzZUhvdGtleSgnc3RhcnRTZWFyY2gnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHNldFNlYXJjaCgnJyk7XG4gICAgICAgIChfYiA9IChfYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXJjdC1zZWFyY2gtaW5wdXQ9XCJ0cnVlXCJdJykpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5mb2N1cykgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmNhbGwoX2EpO1xuICAgIH0sIGlzQWN0aXZlVHJlZSAmJiAhZG5kLmlzUHJvZ3JhbW1hdGljYWxseURyYWdnaW5nICYmICFpc1JlbmFtaW5nKTtcbiAgICB1c2VIb3RrZXkoJ3N0YXJ0UHJvZ3JhbW1hdGljRG5kJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBkbmQuc3RhcnRQcm9ncmFtbWF0aWNEcmFnKCk7XG4gICAgfSwgaXNBY3RpdmVUcmVlICYmICFpc1JlbmFtaW5nKTtcbiAgICB1c2VIb3RrZXkoJ2NvbXBsZXRlUHJvZ3JhbW1hdGljRG5kJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBkbmQuY29tcGxldGVQcm9ncmFtbWF0aWNEcmFnKCk7XG4gICAgfSwgaXNBY3RpdmVUcmVlICYmIGRuZC5pc1Byb2dyYW1tYXRpY2FsbHlEcmFnZ2luZyAmJiAhaXNSZW5hbWluZyk7XG4gICAgdXNlSG90a2V5KCdhYm9ydFByb2dyYW1tYXRpY0RuZCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZG5kLmFib3J0UHJvZ3JhbW1hdGljRHJhZygpO1xuICAgIH0sIGlzQWN0aXZlVHJlZSAmJiBkbmQuaXNQcm9ncmFtbWF0aWNhbGx5RHJhZ2dpbmcgJiYgIWlzUmVuYW1pbmcpO1xufTtcbiIsImV4cG9ydCB2YXIgZGVmYXVsdE1hdGNoZXIgPSBmdW5jdGlvbiAoc2VhcmNoLCBpdGVtLCBpdGVtVGl0bGUpIHtcbiAgICByZXR1cm4gaXRlbVRpdGxlLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoc2VhcmNoLnRvTG93ZXJDYXNlKCkpO1xufTtcbiIsImltcG9ydCB7IHVzZVRyZWUgfSBmcm9tICcuLi90cmVlL1RyZWUnO1xuaW1wb3J0IHsgdXNlVHJlZUVudmlyb25tZW50IH0gZnJvbSAnLi4vY29udHJvbGxlZEVudmlyb25tZW50L0NvbnRyb2xsZWRUcmVlRW52aXJvbm1lbnQnO1xuaW1wb3J0IHsgZGVmYXVsdE1hdGNoZXIgfSBmcm9tICcuL2RlZmF1bHRNYXRjaGVyJztcbmltcG9ydCB7IHVzZVNpZGVFZmZlY3QgfSBmcm9tICcuLi91c2VTaWRlRWZmZWN0JztcbmltcG9ydCB7IHVzZUxpbmVhckl0ZW1zIH0gZnJvbSAnLi4vY29udHJvbGxlZEVudmlyb25tZW50L3VzZUxpbmVhckl0ZW1zJztcbmltcG9ydCB7IHVzZUNhbGxTb29uIH0gZnJvbSAnLi4vdXNlQ2FsbFNvb24nO1xuZXhwb3J0IHZhciB1c2VTZWFyY2hNYXRjaEZvY3VzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBfYSA9IHVzZVRyZWVFbnZpcm9ubWVudCgpLCBkb2VzU2VhcmNoTWF0Y2hJdGVtID0gX2EuZG9lc1NlYXJjaE1hdGNoSXRlbSwgaXRlbXMgPSBfYS5pdGVtcywgZ2V0SXRlbVRpdGxlID0gX2EuZ2V0SXRlbVRpdGxlLCBvbkZvY3VzSXRlbSA9IF9hLm9uRm9jdXNJdGVtO1xuICAgIHZhciBfYiA9IHVzZVRyZWUoKSwgc2VhcmNoID0gX2Iuc2VhcmNoLCB0cmVlSWQgPSBfYi50cmVlSWQ7XG4gICAgdmFyIGxpbmVhckl0ZW1zID0gdXNlTGluZWFySXRlbXModHJlZUlkKTtcbiAgICB2YXIgY2FsbFNvb24gPSB1c2VDYWxsU29vbigpO1xuICAgIHVzZVNpZGVFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoc2VhcmNoICYmIHNlYXJjaC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjYWxsU29vbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGZvY3VzSXRlbSA9IGxpbmVhckl0ZW1zLmZpbmQoZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpdGVtID0gX2EuaXRlbTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChkb2VzU2VhcmNoTWF0Y2hJdGVtICE9PSBudWxsICYmIGRvZXNTZWFyY2hNYXRjaEl0ZW0gIT09IHZvaWQgMCA/IGRvZXNTZWFyY2hNYXRjaEl0ZW0gOiBkZWZhdWx0TWF0Y2hlcikoc2VhcmNoLCBpdGVtc1tpdGVtXSwgZ2V0SXRlbVRpdGxlKGl0ZW1zW2l0ZW1dKSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKGZvY3VzSXRlbSkge1xuICAgICAgICAgICAgICAgICAgICBvbkZvY3VzSXRlbSA9PT0gbnVsbCB8fCBvbkZvY3VzSXRlbSA9PT0gdm9pZCAwID8gdm9pZCAwIDogb25Gb2N1c0l0ZW0oaXRlbXNbZm9jdXNJdGVtLml0ZW1dLCB0cmVlSWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSwgW1xuICAgICAgICBkb2VzU2VhcmNoTWF0Y2hJdGVtLFxuICAgICAgICBnZXRJdGVtVGl0bGUsXG4gICAgICAgIGxpbmVhckl0ZW1zLFxuICAgICAgICBpdGVtcyxcbiAgICAgICAgb25Gb2N1c0l0ZW0sXG4gICAgICAgIHNlYXJjaCxcbiAgICAgICAgdHJlZUlkLFxuICAgICAgICBjYWxsU29vbixcbiAgICBdLCBbc2VhcmNoXSk7XG59O1xuIiwidmFyIF9fYXNzaWduID0gKHRoaXMgJiYgdGhpcy5fX2Fzc2lnbikgfHwgZnVuY3Rpb24gKCkge1xuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0KSB7XG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSlcbiAgICAgICAgICAgICAgICB0W3BdID0gc1twXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdDtcbiAgICB9O1xuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcbmltcG9ydCB7IHVzZUh0bWxFbGVtZW50RXZlbnRMaXN0ZW5lciB9IGZyb20gJy4uL3VzZUh0bWxFbGVtZW50RXZlbnRMaXN0ZW5lcic7XG5pbXBvcnQgeyB1c2VIb3RrZXkgfSBmcm9tICcuLi9ob3RrZXlzL3VzZUhvdGtleSc7XG5pbXBvcnQgeyB1c2VUcmVlIH0gZnJvbSAnLi4vdHJlZS9UcmVlJztcbmltcG9ydCB7IHVzZVRyZWVFbnZpcm9ubWVudCB9IGZyb20gJy4uL2NvbnRyb2xsZWRFbnZpcm9ubWVudC9Db250cm9sbGVkVHJlZUVudmlyb25tZW50JztcbmltcG9ydCB7IHVzZVNlYXJjaE1hdGNoRm9jdXMgfSBmcm9tICcuL3VzZVNlYXJjaE1hdGNoRm9jdXMnO1xuaW1wb3J0IHsgdXNlVmlld1N0YXRlIH0gZnJvbSAnLi4vdHJlZS91c2VWaWV3U3RhdGUnO1xuaW1wb3J0IHsgdXNlQ2FsbFNvb24gfSBmcm9tICcuLi91c2VDYWxsU29vbic7XG5pbXBvcnQgeyBnZXREb2N1bWVudCB9IGZyb20gJy4uL3V0aWxzJztcbmV4cG9ydCB2YXIgU2VhcmNoSW5wdXQgPSBmdW5jdGlvbiAoX2EpIHtcbiAgICB2YXIgX2I7XG4gICAgdmFyIGNvbnRhaW5lclJlZiA9IF9hLmNvbnRhaW5lclJlZjtcbiAgICB2YXIgX2MgPSB1c2VUcmVlKCksIHNlYXJjaCA9IF9jLnNlYXJjaCwgc2V0U2VhcmNoID0gX2Muc2V0U2VhcmNoLCB0cmVlSWQgPSBfYy50cmVlSWQsIHJlbmRlcmVycyA9IF9jLnJlbmRlcmVycywgcmVuYW1pbmdJdGVtID0gX2MucmVuYW1pbmdJdGVtO1xuICAgIHZhciBlbnZpcm9ubWVudCA9IHVzZVRyZWVFbnZpcm9ubWVudCgpO1xuICAgIHVzZVZpZXdTdGF0ZSgpO1xuICAgIHZhciBpc0FjdGl2ZVRyZWUgPSBlbnZpcm9ubWVudC5hY3RpdmVUcmVlSWQgPT09IHRyZWVJZDtcbiAgICB2YXIgY2FsbFNvb24gPSB1c2VDYWxsU29vbigpO1xuICAgIHVzZVNlYXJjaE1hdGNoRm9jdXMoKTtcbiAgICB2YXIgY2xlYXJTZWFyY2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfYSwgX2IsIF9jO1xuICAgICAgICBzZXRTZWFyY2gobnVsbCk7XG4gICAgICAgIGlmICgoX2EgPSBlbnZpcm9ubWVudC5hdXRvRm9jdXMpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IHRydWUpIHtcbiAgICAgICAgICAgIC8vIFJlZm9jdXMgaXRlbSBpbiB0cmVlXG4gICAgICAgICAgICAvLyBUT0RPIG1vdmUgbG9naWMgYXMgcmV1c2FibGUgbWV0aG9kIGludG8gdHJlZSBvciB0cmVlIGVudmlyb25tZW50XG4gICAgICAgICAgICB2YXIgZm9jdXNJdGVtID0gKF9iID0gZ2V0RG9jdW1lbnQoKSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1yY3QtdHJlZT1cXFwiXCIuY29uY2F0KHRyZWVJZCwgXCJcXFwiXSBbZGF0YS1yY3QtaXRlbS1mb2N1cz1cXFwidHJ1ZVxcXCJdXCIpKTtcbiAgICAgICAgICAgIChfYyA9IGZvY3VzSXRlbSA9PT0gbnVsbCB8fCBmb2N1c0l0ZW0gPT09IHZvaWQgMCA/IHZvaWQgMCA6IGZvY3VzSXRlbS5mb2N1cykgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLmNhbGwoZm9jdXNJdGVtKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgdXNlSG90a2V5KCdhYm9ydFNlYXJjaCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gV2l0aG91dCB0aGUgY2FsbFNvb24sIGhpdHRpbmcgZW50ZXIgdG8gYWJvcnRcbiAgICAgICAgLy8gYW5kIHRoZW4gbW92aW5nIGZvY3VzIHdlaXJkbHkgbW92ZXMgdGhlIHNlbGVjdGVkIGl0ZW0gYWxvbmdcbiAgICAgICAgLy8gd2l0aCB0aGUgZm9jdXNlZCBpdGVtLlxuICAgICAgICBjYWxsU29vbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjbGVhclNlYXJjaCgpO1xuICAgICAgICB9KTtcbiAgICB9LCBpc0FjdGl2ZVRyZWUgJiYgc2VhcmNoICE9PSBudWxsLCB0cnVlKTtcbiAgICB1c2VIdG1sRWxlbWVudEV2ZW50TGlzdGVuZXIoY29udGFpbmVyUmVmLCAna2V5ZG93bicsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgIHZhciB1bmljb2RlID0gZS5rZXkuY2hhckNvZGVBdCgwKTtcbiAgICAgICAgaWYgKCgoX2EgPSBlbnZpcm9ubWVudC5jYW5TZWFyY2gpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IHRydWUpICYmXG4gICAgICAgICAgICAoKF9iID0gZW52aXJvbm1lbnQuY2FuU2VhcmNoQnlTdGFydGluZ1R5cGluZykgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogdHJ1ZSkgJiZcbiAgICAgICAgICAgIGlzQWN0aXZlVHJlZSAmJlxuICAgICAgICAgICAgc2VhcmNoID09PSBudWxsICYmXG4gICAgICAgICAgICAhcmVuYW1pbmdJdGVtICYmXG4gICAgICAgICAgICAhZS5jdHJsS2V5ICYmXG4gICAgICAgICAgICAhZS5zaGlmdEtleSAmJlxuICAgICAgICAgICAgIWUuYWx0S2V5ICYmXG4gICAgICAgICAgICAhZS5tZXRhS2V5ICYmXG4gICAgICAgICAgICAoKHVuaWNvZGUgPj0gNDggJiYgdW5pY29kZSA8PSA1NykgfHwgLy8gbnVtYmVyXG4gICAgICAgICAgICAgICAgLy8gKHVuaWNvZGUgPj0gNjUgJiYgdW5pY29kZSA8PSA5MCkgfHwgLy8gdXBwZXJjYXNlIGxldHRlclxuICAgICAgICAgICAgICAgICh1bmljb2RlID49IDk3ICYmIHVuaWNvZGUgPD0gMTIyKSkgLy8gbG93ZXJjYXNlIGxldHRlclxuICAgICAgICApIHtcbiAgICAgICAgICAgIHNldFNlYXJjaCgnJyk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoISgoX2IgPSBlbnZpcm9ubWVudC5jYW5TZWFyY2gpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IHRydWUpIHx8IHNlYXJjaCA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHJlbmRlcmVycy5yZW5kZXJTZWFyY2hJbnB1dCh7XG4gICAgICAgIGlucHV0UHJvcHM6IF9fYXNzaWduKHsgdmFsdWU6IHNlYXJjaCwgb25DaGFuZ2U6IGZ1bmN0aW9uIChlKSB7IHJldHVybiBzZXRTZWFyY2goZS50YXJnZXQudmFsdWUpOyB9LCBvbkJsdXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjbGVhclNlYXJjaCgpO1xuICAgICAgICAgICAgfSwgcmVmOiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICAgICAgKF9hID0gZWwgPT09IG51bGwgfHwgZWwgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGVsLmZvY3VzKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuY2FsbChlbCk7XG4gICAgICAgICAgICB9LCAnYXJpYS1sYWJlbCc6ICdTZWFyY2ggZm9yIGl0ZW1zJyB9LCB7XG4gICAgICAgICAgICAnZGF0YS1yY3Qtc2VhcmNoLWlucHV0JzogJ3RydWUnLFxuICAgICAgICB9KSxcbiAgICB9KTtcbn07XG4iLCJleHBvcnQgdmFyIGRlZmF1bHRMaXZlRGVzY3JpcHRvcnMgPSB7XG4gICAgaW50cm9kdWN0aW9uOiBcIlxcbiAgICA8cD5BY2Nlc3NpYmlsaXR5IGd1aWRlIGZvciB0cmVlIHt0cmVlTGFiZWx9LjwvcD5cXG4gICAgPHA+XFxuICAgICAgTmF2aWdhdGUgdGhlIHRyZWUgd2l0aCB0aGUgYXJyb3cga2V5cy4gQ29tbW9uIHRyZWUgaG90a2V5cyBhcHBseS4gRnVydGhlciBrZXliaW5kaW5ncyBhcmUgYXZhaWxhYmxlOlxcbiAgICA8L3A+XFxuICAgIDx1bD5cXG4gICAgICA8bGk+e2tleWJpbmRpbmc6cHJpbWFyeUFjdGlvbn0gdG8gZXhlY3V0ZSBwcmltYXJ5IGFjdGlvbiBvbiBmb2N1c2VkIGl0ZW08L2xpPlxcbiAgICAgIDxsaT57a2V5YmluZGluZzpyZW5hbWVJdGVtfSB0byBzdGFydCByZW5hbWluZyB0aGUgZm9jdXNlZCBpdGVtPC9saT5cXG4gICAgICA8bGk+e2tleWJpbmRpbmc6YWJvcnRSZW5hbWVJdGVtfSB0byBhYm9ydCByZW5hbWluZyBhbiBpdGVtPC9saT5cXG4gICAgICA8bGk+e2tleWJpbmRpbmc6c3RhcnRQcm9ncmFtbWF0aWNEbmR9IHRvIHN0YXJ0IGRyYWdnaW5nIHNlbGVjdGVkIGl0ZW1zPC9saT5cXG4gICAgPC91bD5cXG4gIFwiLFxuICAgIHJlbmFtaW5nSXRlbTogXCJcXG4gICAgPHA+UmVuYW1pbmcgdGhlIGl0ZW0ge3JlbmFtaW5nSXRlbX0uPC9wPlxcbiAgICA8cD5Vc2UgdGhlIGtleWJpbmRpbmcge2tleWJpbmRpbmc6YWJvcnRSZW5hbWVJdGVtfSB0byBhYm9ydCByZW5hbWluZy48L3A+XFxuICBcIixcbiAgICBzZWFyY2hpbmc6IFwiXFxuICAgIDxwPlNlYXJjaGluZzwvcD5cXG4gIFwiLFxuICAgIHByb2dyYW1tYXRpY2FsbHlEcmFnZ2luZzogXCJcXG4gICAgPHA+RHJhZ2dpbmcgaXRlbXMge2RyYWdJdGVtc30uPC9wPlxcbiAgICA8cD5QcmVzcyB0aGUgYXJyb3cga2V5cyB0byBtb3ZlIHRoZSBkcmFnIHRhcmdldC48L3A+XFxuICAgIDxwPlByZXNzIHtrZXliaW5kaW5nOmNvbXBsZXRlUHJvZ3JhbW1hdGljRG5kfSB0byBkcm9wIG9yIHtrZXliaW5kaW5nOmFib3J0UHJvZ3JhbW1hdGljRG5kfSB0byBhYm9ydC48L3A+XFxuICBcIixcbiAgICBwcm9ncmFtbWF0aWNhbGx5RHJhZ2dpbmdUYXJnZXQ6IFwiXFxuICAgIDxwPkRyb3AgdGFyZ2V0IGlzIHtkcm9wVGFyZ2V0fS48L3A+XFxuICBcIixcbn07XG4iLCJleHBvcnQgdmFyIHJlc29sdmVMaXZlRGVzY3JpcHRvciA9IGZ1bmN0aW9uIChkZXNjcmlwdG9yLCBlbnZpcm9ubWVudCwgZG5kLCB0cmVlLCBrZXlib2FyZEJpbmRpbmdzKSB7XG4gICAgdmFyIGdldEl0ZW1UaXRsZSA9IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICByZXR1cm4gZW52aXJvbm1lbnQuZ2V0SXRlbVRpdGxlKGVudmlyb25tZW50Lml0ZW1zW2luZGV4XSk7XG4gICAgfTtcbiAgICByZXR1cm4gZGVzY3JpcHRvci5yZXBsYWNlKC8oe1teXFxzfV0rKX0vZywgZnVuY3Rpb24gKHZhcmlhYmxlTmFtZVdpdGhCcmFja2V0cykge1xuICAgICAgICB2YXIgX2EsIF9iLCBfYztcbiAgICAgICAgdmFyIHZhcmlhYmxlTmFtZSA9IHZhcmlhYmxlTmFtZVdpdGhCcmFja2V0cy5zbGljZSgxLCAtMSk7XG4gICAgICAgIHN3aXRjaCAodmFyaWFibGVOYW1lKSB7XG4gICAgICAgICAgICBjYXNlICd0cmVlTGFiZWwnOlxuICAgICAgICAgICAgICAgIHJldHVybiAoX2EgPSB0cmVlLnRyZWVMYWJlbCkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogJyc7XG4gICAgICAgICAgICBjYXNlICdyZW5hbWluZ0l0ZW0nOlxuICAgICAgICAgICAgICAgIHJldHVybiB0cmVlLnJlbmFtaW5nSXRlbSA/IGdldEl0ZW1UaXRsZSh0cmVlLnJlbmFtaW5nSXRlbSkgOiAnTm9uZSc7XG4gICAgICAgICAgICBjYXNlICdkcmFnSXRlbXMnOlxuICAgICAgICAgICAgICAgIHJldHVybiAoKF9jID0gKF9iID0gZG5kLmRyYWdnaW5nSXRlbXMpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5tYXAoZnVuY3Rpb24gKGl0ZW0pIHsgcmV0dXJuIGVudmlyb25tZW50LmdldEl0ZW1UaXRsZShpdGVtKTsgfSkuam9pbignLCAnKSkgIT09IG51bGwgJiYgX2MgIT09IHZvaWQgMCA/IF9jIDogJ05vbmUnKTtcbiAgICAgICAgICAgIGNhc2UgJ2Ryb3BUYXJnZXQnOiB7XG4gICAgICAgICAgICAgICAgaWYgKCFkbmQuZHJhZ2dpbmdQb3NpdGlvbikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ05vbmUnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZG5kLmRyYWdnaW5nUG9zaXRpb24udGFyZ2V0VHlwZSA9PT0gJ2l0ZW0nIHx8XG4gICAgICAgICAgICAgICAgICAgIGRuZC5kcmFnZ2luZ1Bvc2l0aW9uLnRhcmdldFR5cGUgPT09ICdyb290Jykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJ3aXRoaW4gXCIuY29uY2F0KGdldEl0ZW1UaXRsZShkbmQuZHJhZ2dpbmdQb3NpdGlvbi50YXJnZXRJdGVtKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBwYXJlbnRJdGVtID0gZW52aXJvbm1lbnQuaXRlbXNbZG5kLmRyYWdnaW5nUG9zaXRpb24ucGFyZW50SXRlbV07XG4gICAgICAgICAgICAgICAgdmFyIHBhcmVudFRpdGxlID0gZW52aXJvbm1lbnQuZ2V0SXRlbVRpdGxlKHBhcmVudEl0ZW0pO1xuICAgICAgICAgICAgICAgIGlmIChkbmQuZHJhZ2dpbmdQb3NpdGlvbi5jaGlsZEluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcIndpdGhpbiBcIi5jb25jYXQocGFyZW50VGl0bGUsIFwiIGF0IHRoZSBzdGFydFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwid2l0aGluIFwiLmNvbmNhdChwYXJlbnRUaXRsZSwgXCIgYWZ0ZXIgXCIpLmNvbmNhdChnZXRJdGVtVGl0bGUocGFyZW50SXRlbS5jaGlsZHJlbltkbmQuZHJhZ2dpbmdQb3NpdGlvbi5jaGlsZEluZGV4IC0gMV0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgaWYgKHZhcmlhYmxlTmFtZS5zdGFydHNXaXRoKCdrZXliaW5kaW5nOicpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBrZXlib2FyZEJpbmRpbmdzW3ZhcmlhYmxlTmFtZS5zbGljZSgxMSldWzBdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcIlVua25vd24gbGl2ZSBkZXNjcmlwdG9yIHZhcmlhYmxlIHtcIi5jb25jYXQodmFyaWFibGVOYW1lLCBcIn1cIikpO1xuICAgICAgICB9XG4gICAgfSk7XG59O1xuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZVRyZWVFbnZpcm9ubWVudCB9IGZyb20gJy4uL2NvbnRyb2xsZWRFbnZpcm9ubWVudC9Db250cm9sbGVkVHJlZUVudmlyb25tZW50JztcbmltcG9ydCB7IGRlZmF1bHRMaXZlRGVzY3JpcHRvcnMgfSBmcm9tICcuL2RlZmF1bHRMaXZlRGVzY3JpcHRvcnMnO1xuaW1wb3J0IHsgdXNlVHJlZSB9IGZyb20gJy4vVHJlZSc7XG5pbXBvcnQgeyB1c2VEcmFnQW5kRHJvcCB9IGZyb20gJy4uL2RyYWcvRHJhZ0FuZERyb3BQcm92aWRlcic7XG5pbXBvcnQgeyByZXNvbHZlTGl2ZURlc2NyaXB0b3IgfSBmcm9tICcuL3Jlc29sdmVMaXZlRGVzY3JpcHRvcic7XG5pbXBvcnQgeyB1c2VLZXlib2FyZEJpbmRpbmdzIH0gZnJvbSAnLi4vaG90a2V5cy91c2VLZXlib2FyZEJpbmRpbmdzJztcbnZhciBMaXZlV3JhcHBlciA9IGZ1bmN0aW9uIChfYSkge1xuICAgIHZhciBjaGlsZHJlbiA9IF9hLmNoaWxkcmVuLCBsaXZlID0gX2EubGl2ZTtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IFwiYXJpYS1saXZlXCI6IGxpdmUsIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MOiB7IF9faHRtbDogY2hpbGRyZW4gfSB9KTtcbn07XG5leHBvcnQgdmFyIExpdmVEZXNjcmlwdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZW52ID0gdXNlVHJlZUVudmlyb25tZW50KCk7XG4gICAgdmFyIHRyZWUgPSB1c2VUcmVlKCk7XG4gICAgdmFyIGRuZCA9IHVzZURyYWdBbmREcm9wKCk7XG4gICAgdmFyIGtleXMgPSB1c2VLZXlib2FyZEJpbmRpbmdzKCk7XG4gICAgdmFyIGRlc2NyaXB0b3JzID0gdXNlTWVtbyhmdW5jdGlvbiAoKSB7IHZhciBfYTsgcmV0dXJuIChfYSA9IGVudi5saXZlRGVzY3JpcHRvcnMpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IGRlZmF1bHRMaXZlRGVzY3JpcHRvcnM7IH0sIFtlbnYubGl2ZURlc2NyaXB0b3JzXSk7XG4gICAgdmFyIE1haW5XcmFwcGVyID0gdHJlZS5yZW5kZXJlcnMucmVuZGVyTGl2ZURlc2NyaXB0b3JDb250YWluZXI7XG4gICAgaWYgKHRyZWUudHJlZUluZm9ybWF0aW9uLmlzUmVuYW1pbmcpIHtcbiAgICAgICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KE1haW5XcmFwcGVyLCB7IHRyZWU6IHRyZWUgfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTGl2ZVdyYXBwZXIsIHsgbGl2ZTogXCJwb2xpdGVcIiB9LCByZXNvbHZlTGl2ZURlc2NyaXB0b3IoZGVzY3JpcHRvcnMucmVuYW1pbmdJdGVtLCBlbnYsIGRuZCwgdHJlZSwga2V5cykpKSk7XG4gICAgfVxuICAgIGlmICh0cmVlLnRyZWVJbmZvcm1hdGlvbi5pc1NlYXJjaGluZykge1xuICAgICAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoTWFpbldyYXBwZXIsIHsgdHJlZTogdHJlZSB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChMaXZlV3JhcHBlciwgeyBsaXZlOiBcInBvbGl0ZVwiIH0sIHJlc29sdmVMaXZlRGVzY3JpcHRvcihkZXNjcmlwdG9ycy5zZWFyY2hpbmcsIGVudiwgZG5kLCB0cmVlLCBrZXlzKSkpKTtcbiAgICB9XG4gICAgaWYgKHRyZWUudHJlZUluZm9ybWF0aW9uLmlzUHJvZ3JhbW1hdGljYWxseURyYWdnaW5nKSB7XG4gICAgICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChNYWluV3JhcHBlciwgeyB0cmVlOiB0cmVlIH0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KExpdmVXcmFwcGVyLCB7IGxpdmU6IFwicG9saXRlXCIgfSwgcmVzb2x2ZUxpdmVEZXNjcmlwdG9yKGRlc2NyaXB0b3JzLnByb2dyYW1tYXRpY2FsbHlEcmFnZ2luZywgZW52LCBkbmQsIHRyZWUsIGtleXMpKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTGl2ZVdyYXBwZXIsIHsgbGl2ZTogXCJhc3NlcnRpdmVcIiB9LCByZXNvbHZlTGl2ZURlc2NyaXB0b3IoZGVzY3JpcHRvcnMucHJvZ3JhbW1hdGljYWxseURyYWdnaW5nVGFyZ2V0LCBlbnYsIGRuZCwgdHJlZSwga2V5cykpKSk7XG4gICAgfVxuICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChNYWluV3JhcHBlciwgeyB0cmVlOiB0cmVlIH0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTGl2ZVdyYXBwZXIsIHsgbGl2ZTogXCJvZmZcIiB9LCByZXNvbHZlTGl2ZURlc2NyaXB0b3IoZGVzY3JpcHRvcnMuaW50cm9kdWN0aW9uLCBlbnYsIGRuZCwgdHJlZSwga2V5cykpKSk7XG59O1xuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlVHJlZUVudmlyb25tZW50IH0gZnJvbSAnLi4vY29udHJvbGxlZEVudmlyb25tZW50L0NvbnRyb2xsZWRUcmVlRW52aXJvbm1lbnQnO1xuaW1wb3J0IHsgTGl2ZURlc2NyaXB0aW9uIH0gZnJvbSAnLi9MaXZlRGVzY3JpcHRpb24nO1xuZXhwb3J0IHZhciBNYXliZUxpdmVEZXNjcmlwdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgX2E7XG4gICAgdmFyIGVudiA9IHVzZVRyZWVFbnZpcm9ubWVudCgpO1xuICAgIGlmICghKChfYSA9IGVudi5zaG93TGl2ZURlc2NyaXB0aW9uKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiB0cnVlKSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTGl2ZURlc2NyaXB0aW9uLCBudWxsKTtcbn07XG4iLCJ2YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxuICAgICAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0O1xuICAgIH07XG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlUmVmIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgVHJlZUl0ZW1DaGlsZHJlbiB9IGZyb20gJy4uL3RyZWVJdGVtL1RyZWVJdGVtQ2hpbGRyZW4nO1xuaW1wb3J0IHsgRHJhZ0JldHdlZW5MaW5lIH0gZnJvbSAnLi9EcmFnQmV0d2VlbkxpbmUnO1xuaW1wb3J0IHsgdXNlRm9jdXNXaXRoaW4gfSBmcm9tICcuL3VzZUZvY3VzV2l0aGluJztcbmltcG9ydCB7IHVzZVRyZWVLZXlib2FyZEJpbmRpbmdzIH0gZnJvbSAnLi91c2VUcmVlS2V5Ym9hcmRCaW5kaW5ncyc7XG5pbXBvcnQgeyBTZWFyY2hJbnB1dCB9IGZyb20gJy4uL3NlYXJjaC9TZWFyY2hJbnB1dCc7XG5pbXBvcnQgeyB1c2VUcmVlIH0gZnJvbSAnLi9UcmVlJztcbmltcG9ydCB7IHVzZVRyZWVFbnZpcm9ubWVudCB9IGZyb20gJy4uL2NvbnRyb2xsZWRFbnZpcm9ubWVudC9Db250cm9sbGVkVHJlZUVudmlyb25tZW50JztcbmltcG9ydCB7IHVzZURyYWdBbmREcm9wIH0gZnJvbSAnLi4vZHJhZy9EcmFnQW5kRHJvcFByb3ZpZGVyJztcbmltcG9ydCB7IE1heWJlTGl2ZURlc2NyaXB0aW9uIH0gZnJvbSAnLi9NYXliZUxpdmVEZXNjcmlwdGlvbic7XG5leHBvcnQgdmFyIFRyZWVNYW5hZ2VyID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBfYSA9IHVzZVRyZWUoKSwgdHJlZUlkID0gX2EudHJlZUlkLCByb290SXRlbSA9IF9hLnJvb3RJdGVtLCByZW5kZXJlcnMgPSBfYS5yZW5kZXJlcnMsIHRyZWVJbmZvcm1hdGlvbiA9IF9hLnRyZWVJbmZvcm1hdGlvbjtcbiAgICB2YXIgZW52aXJvbm1lbnQgPSB1c2VUcmVlRW52aXJvbm1lbnQoKTtcbiAgICB2YXIgY29udGFpbmVyUmVmID0gdXNlUmVmKCk7XG4gICAgdmFyIGRuZCA9IHVzZURyYWdBbmREcm9wKCk7XG4gICAgdXNlVHJlZUtleWJvYXJkQmluZGluZ3MoKTtcbiAgICB1c2VGb2N1c1dpdGhpbihjb250YWluZXJSZWYuY3VycmVudCwgZnVuY3Rpb24gKCkge1xuICAgICAgICBlbnZpcm9ubWVudC5zZXRBY3RpdmVUcmVlKHRyZWVJZCk7XG4gICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICBlbnZpcm9ubWVudC5zZXRBY3RpdmVUcmVlKGZ1bmN0aW9uIChvbGRUcmVlSWQpIHtcbiAgICAgICAgICAgIHJldHVybiBvbGRUcmVlSWQgPT09IHRyZWVJZCA/IHVuZGVmaW5lZCA6IG9sZFRyZWVJZDtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgdmFyIHJvb3RDaGlsZHJlbiA9IGVudmlyb25tZW50Lml0ZW1zW3Jvb3RJdGVtXS5jaGlsZHJlbjtcbiAgICB2YXIgdHJlZUNoaWxkcmVuID0gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRnJhZ21lbnQsIG51bGwsXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTWF5YmVMaXZlRGVzY3JpcHRpb24sIG51bGwpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRyZWVJdGVtQ2hpbGRyZW4sIHsgZGVwdGg6IDAsIHBhcmVudElkOiByb290SXRlbSB9LCByb290Q2hpbGRyZW4gIT09IG51bGwgJiYgcm9vdENoaWxkcmVuICE9PSB2b2lkIDAgPyByb290Q2hpbGRyZW4gOiBbXSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRHJhZ0JldHdlZW5MaW5lLCB7IHRyZWVJZDogdHJlZUlkIH0pLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFNlYXJjaElucHV0LCB7IGNvbnRhaW5lclJlZjogY29udGFpbmVyUmVmLmN1cnJlbnQgfSkpKTtcbiAgICB2YXIgY29udGFpbmVyUHJvcHMgPSBfX2Fzc2lnbih7IG9uRHJhZ092ZXI6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7IC8vIEFsbG93IGRyb3AuIEFsc28gaW1wbGljaXRseSBzZXQgYnkgaXRlbXMsIGJ1dCBuZWVkZWQgaGVyZSBhcyB3ZWxsIGZvciBkcm9wcGluZyBvbiBlbXB0eSBzcGFjZVxuICAgICAgICAgICAgZG5kLm9uRHJhZ092ZXJUcmVlSGFuZGxlcihlLCB0cmVlSWQsIGNvbnRhaW5lclJlZik7XG4gICAgICAgIH0sIG9uRHJhZ0xlYXZlOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZG5kLm9uRHJhZ0xlYXZlQ29udGFpbmVySGFuZGxlcihlLCBjb250YWluZXJSZWYpO1xuICAgICAgICB9LCBvbk1vdXNlRG93bjogZnVuY3Rpb24gKCkgeyByZXR1cm4gZG5kLmFib3J0UHJvZ3JhbW1hdGljRHJhZygpOyB9LCByZWY6IGNvbnRhaW5lclJlZiwgc3R5bGU6IHsgcG9zaXRpb246ICdyZWxhdGl2ZScgfSwgcm9sZTogJ3RyZWUnLCAnYXJpYS1sYWJlbCc6ICF0cmVlSW5mb3JtYXRpb24udHJlZUxhYmVsbGVkQnlcbiAgICAgICAgICAgID8gdHJlZUluZm9ybWF0aW9uLnRyZWVMYWJlbFxuICAgICAgICAgICAgOiB1bmRlZmluZWQsICdhcmlhLWxhYmVsbGVkYnknOiB0cmVlSW5mb3JtYXRpb24udHJlZUxhYmVsbGVkQnkgfSwge1xuICAgICAgICAnZGF0YS1yY3QtdHJlZSc6IHRyZWVJZCxcbiAgICB9KTtcbiAgICByZXR1cm4gcmVuZGVyZXJzLnJlbmRlclRyZWVDb250YWluZXIoe1xuICAgICAgICBjaGlsZHJlbjogdHJlZUNoaWxkcmVuLFxuICAgICAgICBpbmZvOiB0cmVlSW5mb3JtYXRpb24sXG4gICAgICAgIGNvbnRhaW5lclByb3BzOiBjb250YWluZXJQcm9wcyxcbiAgICB9KTtcbn07XG4iLCJpbXBvcnQgeyB1c2VNZW1vIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlVHJlZUVudmlyb25tZW50IH0gZnJvbSAnLi4vY29udHJvbGxlZEVudmlyb25tZW50L0NvbnRyb2xsZWRUcmVlRW52aXJvbm1lbnQnO1xuaW1wb3J0IHsgdXNlRHJhZ0FuZERyb3AgfSBmcm9tICcuLi9kcmFnL0RyYWdBbmREcm9wUHJvdmlkZXInO1xuZXhwb3J0IHZhciB1c2VDcmVhdGVkVHJlZUluZm9ybWF0aW9uID0gZnVuY3Rpb24gKHRyZWUsIHJlbmFtaW5nSXRlbSwgc2VhcmNoKSB7XG4gICAgdmFyIF9hO1xuICAgIHZhciBlbnZpcm9ubWVudCA9IHVzZVRyZWVFbnZpcm9ubWVudCgpO1xuICAgIHZhciBkbmQgPSB1c2VEcmFnQW5kRHJvcCgpO1xuICAgIHZhciBzZWxlY3RlZEl0ZW1zID0gKF9hID0gZW52aXJvbm1lbnQudmlld1N0YXRlW3RyZWUudHJlZUlkXSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnNlbGVjdGVkSXRlbXM7XG4gICAgcmV0dXJuIHVzZU1lbW8oZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICByZXR1cm4gKHtcbiAgICAgICAgICAgIGlzRm9jdXNlZDogZW52aXJvbm1lbnQuYWN0aXZlVHJlZUlkID09PSB0cmVlLnRyZWVJZCxcbiAgICAgICAgICAgIGlzUmVuYW1pbmc6ICEhcmVuYW1pbmdJdGVtLFxuICAgICAgICAgICAgYXJlSXRlbXNTZWxlY3RlZDogKChfYSA9IHNlbGVjdGVkSXRlbXMgPT09IG51bGwgfHwgc2VsZWN0ZWRJdGVtcyA9PT0gdm9pZCAwID8gdm9pZCAwIDogc2VsZWN0ZWRJdGVtcy5sZW5ndGgpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IDApID4gMCxcbiAgICAgICAgICAgIGlzU2VhcmNoaW5nOiBzZWFyY2ggIT09IG51bGwsXG4gICAgICAgICAgICBzZWFyY2g6IHNlYXJjaCxcbiAgICAgICAgICAgIGlzUHJvZ3JhbW1hdGljYWxseURyYWdnaW5nOiAoX2IgPSBkbmQuaXNQcm9ncmFtbWF0aWNhbGx5RHJhZ2dpbmcpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IGZhbHNlLFxuICAgICAgICAgICAgdHJlZUlkOiB0cmVlLnRyZWVJZCxcbiAgICAgICAgICAgIHJvb3RJdGVtOiB0cmVlLnJvb3RJdGVtLFxuICAgICAgICAgICAgdHJlZUxhYmVsOiB0cmVlLnRyZWVMYWJlbCxcbiAgICAgICAgICAgIHRyZWVMYWJlbGxlZEJ5OiB0cmVlLnRyZWVMYWJlbGxlZEJ5LFxuICAgICAgICB9KTtcbiAgICB9LCBbXG4gICAgICAgIGVudmlyb25tZW50LmFjdGl2ZVRyZWVJZCxcbiAgICAgICAgdHJlZS50cmVlSWQsXG4gICAgICAgIHRyZWUucm9vdEl0ZW0sXG4gICAgICAgIHRyZWUudHJlZUxhYmVsLFxuICAgICAgICB0cmVlLnRyZWVMYWJlbGxlZEJ5LFxuICAgICAgICByZW5hbWluZ0l0ZW0sXG4gICAgICAgIHNlbGVjdGVkSXRlbXMgPT09IG51bGwgfHwgc2VsZWN0ZWRJdGVtcyA9PT0gdm9pZCAwID8gdm9pZCAwIDogc2VsZWN0ZWRJdGVtcy5sZW5ndGgsXG4gICAgICAgIHNlYXJjaCxcbiAgICAgICAgZG5kLmlzUHJvZ3JhbW1hdGljYWxseURyYWdnaW5nLFxuICAgIF0pO1xufTtcbiIsInZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IGZ1bmN0aW9uICgpIHtcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXG4gICAgICAgICAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5pbXBvcnQgeyB1c2VJbXBlcmF0aXZlSGFuZGxlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlVHJlZUVudmlyb25tZW50IH0gZnJvbSAnLi4vY29udHJvbGxlZEVudmlyb25tZW50L0NvbnRyb2xsZWRUcmVlRW52aXJvbm1lbnQnO1xuaW1wb3J0IHsgdXNlRHJhZ0FuZERyb3AgfSBmcm9tICcuLi9kcmFnL0RyYWdBbmREcm9wUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlVHJlZSB9IGZyb20gJy4uL3RyZWUvVHJlZSc7XG5leHBvcnQgdmFyIHVzZUNyZWF0ZWRUcmVlUmVmID0gZnVuY3Rpb24gKHJlZiwgYWN0aW9ucykge1xuICAgIHZhciBlbnZpcm9ubWVudCA9IHVzZVRyZWVFbnZpcm9ubWVudCgpO1xuICAgIHZhciB0cmVlID0gdXNlVHJlZSgpO1xuICAgIHZhciBkbmQgPSB1c2VEcmFnQW5kRHJvcCgpO1xuICAgIHVzZUltcGVyYXRpdmVIYW5kbGUocmVmLCBmdW5jdGlvbiAoKSB7IHJldHVybiAoX19hc3NpZ24oX19hc3NpZ24oX19hc3NpZ24oe30sIGFjdGlvbnMpLCB7IHRyZWVFbnZpcm9ubWVudENvbnRleHQ6IGVudmlyb25tZW50LCBkcmFnQW5kRHJvcENvbnRleHQ6IGRuZCwgdHJlZUNvbnRleHQ6IHRyZWUgfSksIHRyZWUudHJlZUluZm9ybWF0aW9uKSk7IH0pO1xufTtcbiIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZU1lbW8gfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VEcmFnQW5kRHJvcCB9IGZyb20gJy4uL2RyYWcvRHJhZ0FuZERyb3BQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VUcmVlRW52aXJvbm1lbnQgfSBmcm9tICcuLi9jb250cm9sbGVkRW52aXJvbm1lbnQvQ29udHJvbGxlZFRyZWVFbnZpcm9ubWVudCc7XG5pbXBvcnQgeyB1c2VDcmVhdGVkVHJlZVJlZiB9IGZyb20gJy4vdXNlQ3JlYXRlZFRyZWVSZWYnO1xuaW1wb3J0IHsgdXNlVHJlZSB9IGZyb20gJy4uL3RyZWUvVHJlZSc7XG5pbXBvcnQgeyB1c2VFbnZpcm9ubWVudEFjdGlvbnMgfSBmcm9tICcuLi9lbnZpcm9ubWVudEFjdGlvbnMvRW52aXJvbm1lbnRBY3Rpb25zUHJvdmlkZXInO1xudmFyIEVudmlyb25tZW50QWN0aW9uc0NvbnRleHQgPSBSZWFjdC5jcmVhdGVDb250ZXh0KG51bGwpO1xuZXhwb3J0IHZhciB1c2VUcmVlQWN0aW9ucyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIFJlYWN0LnVzZUNvbnRleHQoRW52aXJvbm1lbnRBY3Rpb25zQ29udGV4dCk7IH07XG5leHBvcnQgdmFyIFRyZWVBY3Rpb25zUHJvdmlkZXIgPSBSZWFjdC5mb3J3YXJkUmVmKGZ1bmN0aW9uIChwcm9wcywgcmVmKSB7XG4gICAgdXNlVHJlZUVudmlyb25tZW50KCk7XG4gICAgdmFyIHRyZWUgPSB1c2VUcmVlKCk7XG4gICAgdXNlRHJhZ0FuZERyb3AoKTtcbiAgICB2YXIgZW52QWN0aW9ucyA9IHVzZUVudmlyb25tZW50QWN0aW9ucygpO1xuICAgIC8vIFRPRE8gY2hhbmdlIHRyZWUgY2hpbGRzIHRvIHVzZSBhY3Rpb25zIHJhdGhlciB0aGFuIG91dHB1dCBldmVudHMgd2hlcmUgcG9zc2libGVcbiAgICAvLyBUT0RPIG1heWJlIHJlcGxhY2Ugd2l0aCBzdGFibGUgaGFuZGxlcnNcbiAgICB2YXIgYWN0aW9ucyA9IHVzZU1lbW8oZnVuY3Rpb24gKCkgeyByZXR1cm4gKHtcbiAgICAgICAgYWJvcnRSZW5hbWluZ0l0ZW06IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRyZWUuc2V0UmVuYW1pbmdJdGVtKG51bGwpO1xuICAgICAgICB9LFxuICAgICAgICBhYm9ydFNlYXJjaDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdHJlZS5zZXRTZWFyY2gobnVsbCk7XG4gICAgICAgIH0sXG4gICAgICAgIGNvbGxhcHNlSXRlbTogZnVuY3Rpb24gKGl0ZW1JZCkge1xuICAgICAgICAgICAgZW52QWN0aW9ucy5jb2xsYXBzZUl0ZW0oaXRlbUlkLCB0cmVlLnRyZWVJZCk7XG4gICAgICAgIH0sXG4gICAgICAgIGNvbXBsZXRlUmVuYW1pbmdJdGVtOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBUT0RPXG4gICAgICAgIH0sXG4gICAgICAgIGV4cGFuZEl0ZW06IGZ1bmN0aW9uIChpdGVtSWQpIHtcbiAgICAgICAgICAgIGVudkFjdGlvbnMuZXhwYW5kSXRlbShpdGVtSWQsIHRyZWUudHJlZUlkKTtcbiAgICAgICAgfSxcbiAgICAgICAgZm9jdXNJdGVtOiBmdW5jdGlvbiAoaXRlbUlkLCBzZXREb21Gb2N1cykge1xuICAgICAgICAgICAgaWYgKHNldERvbUZvY3VzID09PSB2b2lkIDApIHsgc2V0RG9tRm9jdXMgPSB0cnVlOyB9XG4gICAgICAgICAgICBlbnZBY3Rpb25zLmZvY3VzSXRlbShpdGVtSWQsIHRyZWUudHJlZUlkLCBzZXREb21Gb2N1cyk7XG4gICAgICAgIH0sXG4gICAgICAgIGZvY3VzVHJlZTogZnVuY3Rpb24gKGF1dG9Gb2N1cykge1xuICAgICAgICAgICAgaWYgKGF1dG9Gb2N1cyA9PT0gdm9pZCAwKSB7IGF1dG9Gb2N1cyA9IHRydWU7IH1cbiAgICAgICAgICAgIGVudkFjdGlvbnMuZm9jdXNUcmVlKHRyZWUudHJlZUlkLCBhdXRvRm9jdXMpO1xuICAgICAgICB9LFxuICAgICAgICBpbnZva2VQcmltYXJ5QWN0aW9uOiBmdW5jdGlvbiAoaXRlbUlkKSB7XG4gICAgICAgICAgICBlbnZBY3Rpb25zLmludm9rZVByaW1hcnlBY3Rpb24oaXRlbUlkLCB0cmVlLnRyZWVJZCk7XG4gICAgICAgIH0sXG4gICAgICAgIG1vdmVGb2N1c0Rvd246IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGVudkFjdGlvbnMubW92ZUZvY3VzRG93bih0cmVlLnRyZWVJZCk7XG4gICAgICAgIH0sXG4gICAgICAgIG1vdmVGb2N1c1VwOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBlbnZBY3Rpb25zLm1vdmVGb2N1c1VwKHRyZWUudHJlZUlkKTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVuYW1lSXRlbTogZnVuY3Rpb24gKGl0ZW1JZCwgbmFtZSkge1xuICAgICAgICAgICAgZW52QWN0aW9ucy5yZW5hbWVJdGVtKGl0ZW1JZCwgbmFtZSwgdHJlZS50cmVlSWQpO1xuICAgICAgICB9LFxuICAgICAgICBzZWxlY3RJdGVtczogZnVuY3Rpb24gKGl0ZW1zSWRzKSB7XG4gICAgICAgICAgICBlbnZBY3Rpb25zLnNlbGVjdEl0ZW1zKGl0ZW1zSWRzLCB0cmVlLnRyZWVJZCk7XG4gICAgICAgIH0sXG4gICAgICAgIHNldFNlYXJjaDogZnVuY3Rpb24gKHNlYXJjaCkge1xuICAgICAgICAgICAgdHJlZS5zZXRTZWFyY2goc2VhcmNoKTtcbiAgICAgICAgfSxcbiAgICAgICAgc3RhcnRSZW5hbWluZ0l0ZW06IGZ1bmN0aW9uIChpdGVtSWQpIHtcbiAgICAgICAgICAgIHRyZWUuc2V0UmVuYW1pbmdJdGVtKGl0ZW1JZCk7XG4gICAgICAgIH0sXG4gICAgICAgIHN0b3BSZW5hbWluZ0l0ZW06IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRyZWUuc2V0UmVuYW1pbmdJdGVtKG51bGwpO1xuICAgICAgICB9LFxuICAgICAgICB0b2dnbGVJdGVtRXhwYW5kZWRTdGF0ZTogZnVuY3Rpb24gKGl0ZW1JZCkge1xuICAgICAgICAgICAgZW52QWN0aW9ucy50b2dnbGVJdGVtRXhwYW5kZWRTdGF0ZShpdGVtSWQsIHRyZWUudHJlZUlkKTtcbiAgICAgICAgfSxcbiAgICAgICAgdG9nZ2xlSXRlbVNlbGVjdFN0YXR1czogZnVuY3Rpb24gKGl0ZW1JZCkge1xuICAgICAgICAgICAgZW52QWN0aW9ucy50b2dnbGVJdGVtU2VsZWN0U3RhdHVzKGl0ZW1JZCwgdHJlZS50cmVlSWQpO1xuICAgICAgICB9LFxuICAgICAgICBleHBhbmRBbGw6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGVudkFjdGlvbnMuZXhwYW5kQWxsKHRyZWUudHJlZUlkKTtcbiAgICAgICAgfSxcbiAgICAgICAgY29sbGFwc2VBbGw6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGVudkFjdGlvbnMuY29sbGFwc2VBbGwodHJlZS50cmVlSWQpO1xuICAgICAgICB9LFxuICAgICAgICBleHBhbmRTdWJzZXF1ZW50bHk6IGZ1bmN0aW9uIChpdGVtSWRzKSB7XG4gICAgICAgICAgICByZXR1cm4gZW52QWN0aW9ucy5leHBhbmRTdWJzZXF1ZW50bHkodHJlZS50cmVlSWQsIGl0ZW1JZHMpO1xuICAgICAgICB9LFxuICAgIH0pOyB9LCBbZW52QWN0aW9ucywgdHJlZV0pO1xuICAgIHVzZUNyZWF0ZWRUcmVlUmVmKHJlZiwgYWN0aW9ucyk7XG4gICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KEVudmlyb25tZW50QWN0aW9uc0NvbnRleHQuUHJvdmlkZXIsIHsgdmFsdWU6IGFjdGlvbnMgfSwgcHJvcHMuY2hpbGRyZW4pKTtcbn0pO1xuIiwidmFyIF9fYXNzaWduID0gKHRoaXMgJiYgdGhpcy5fX2Fzc2lnbikgfHwgZnVuY3Rpb24gKCkge1xuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0KSB7XG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSlcbiAgICAgICAgICAgICAgICB0W3BdID0gc1twXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdDtcbiAgICB9O1xuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZUNvbnRleHQsIHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VUcmVlRW52aXJvbm1lbnQgfSBmcm9tICcuLi9jb250cm9sbGVkRW52aXJvbm1lbnQvQ29udHJvbGxlZFRyZWVFbnZpcm9ubWVudCc7XG5pbXBvcnQgeyBUcmVlTWFuYWdlciB9IGZyb20gJy4vVHJlZU1hbmFnZXInO1xuaW1wb3J0IHsgdXNlQ3JlYXRlZFRyZWVJbmZvcm1hdGlvbiB9IGZyb20gJy4vdXNlQ3JlYXRlZFRyZWVJbmZvcm1hdGlvbic7XG5pbXBvcnQgeyBnZXRJdGVtc0xpbmVhcmx5IH0gZnJvbSAnLi9nZXRJdGVtc0xpbmVhcmx5JztcbmltcG9ydCB7IFRyZWVBY3Rpb25zUHJvdmlkZXIgfSBmcm9tICcuLi90cmVlQWN0aW9ucy9UcmVlQWN0aW9uc1Byb3ZpZGVyJztcbnZhciBUcmVlQ29udGV4dCA9IFJlYWN0LmNyZWF0ZUNvbnRleHQobnVsbCk7IC8vIFRPRE8gZGVmYXVsdCB2YWx1ZVxuZXhwb3J0IHZhciB1c2VUcmVlID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdXNlQ29udGV4dChUcmVlQ29udGV4dCk7IH07XG5leHBvcnQgdmFyIFRyZWUgPSBSZWFjdC5mb3J3YXJkUmVmKGZ1bmN0aW9uIChwcm9wcywgcmVmKSB7XG4gICAgdmFyIF9hO1xuICAgIHZhciBlbnZpcm9ubWVudCA9IHVzZVRyZWVFbnZpcm9ubWVudCgpO1xuICAgIHZhciByZW5kZXJlcnMgPSB1c2VNZW1vKGZ1bmN0aW9uICgpIHsgcmV0dXJuIChfX2Fzc2lnbihfX2Fzc2lnbih7fSwgZW52aXJvbm1lbnQpLCBwcm9wcykpOyB9LCBbcHJvcHMsIGVudmlyb25tZW50XSk7XG4gICAgdmFyIF9iID0gdXNlU3RhdGUobnVsbCksIHNlYXJjaCA9IF9iWzBdLCBzZXRTZWFyY2ggPSBfYlsxXTtcbiAgICB2YXIgX2MgPSB1c2VTdGF0ZShudWxsKSwgcmVuYW1pbmdJdGVtID0gX2NbMF0sIHNldFJlbmFtaW5nSXRlbSA9IF9jWzFdO1xuICAgIHZhciByb290SXRlbSA9IGVudmlyb25tZW50Lml0ZW1zW3Byb3BzLnJvb3RJdGVtXTtcbiAgICB2YXIgdmlld1N0YXRlID0gZW52aXJvbm1lbnQudmlld1N0YXRlW3Byb3BzLnRyZWVJZF07XG4gICAgdXNlRWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZW52aXJvbm1lbnQucmVnaXN0ZXJUcmVlKHtcbiAgICAgICAgICAgIHRyZWVJZDogcHJvcHMudHJlZUlkLFxuICAgICAgICAgICAgcm9vdEl0ZW06IHByb3BzLnJvb3RJdGVtLFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHsgcmV0dXJuIGVudmlyb25tZW50LnVucmVnaXN0ZXJUcmVlKHByb3BzLnRyZWVJZCk7IH07XG4gICAgICAgIC8vIFRPRE8gc2hvdWxkIGJlIGFibGUgdG8gcmVtb3ZlIHNvb24sIGFuZCBhZGQgZW52aXJvbm1lbnQucmVnaXN0ZXJUcmVlLCBlbnZpcm9ubWVudC51bnJlZ2lzdGVyVHJlZSBhcyBkZXBzXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC1ob29rcy9leGhhdXN0aXZlLWRlcHNcbiAgICB9LCBbcHJvcHMudHJlZUlkLCBwcm9wcy5yb290SXRlbV0pO1xuICAgIHZhciB0cmVlSW5mb3JtYXRpb24gPSB1c2VDcmVhdGVkVHJlZUluZm9ybWF0aW9uKHByb3BzLCByZW5hbWluZ0l0ZW0sIHNlYXJjaCk7XG4gICAgdmFyIHRyZWVDb250ZXh0UHJvcHMgPSB1c2VNZW1vKGZ1bmN0aW9uICgpIHsgcmV0dXJuICh7XG4gICAgICAgIHRyZWVJZDogcHJvcHMudHJlZUlkLFxuICAgICAgICByb290SXRlbTogcHJvcHMucm9vdEl0ZW0sXG4gICAgICAgIHRyZWVMYWJlbDogcHJvcHMudHJlZUxhYmVsLFxuICAgICAgICB0cmVlTGFiZWxsZWRCeTogcHJvcHMudHJlZUxhYmVsbGVkQnksXG4gICAgICAgIGdldEl0ZW1zTGluZWFybHk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBnZXRJdGVtc0xpbmVhcmx5KHByb3BzLnJvb3RJdGVtLCB2aWV3U3RhdGUgIT09IG51bGwgJiYgdmlld1N0YXRlICE9PSB2b2lkIDAgPyB2aWV3U3RhdGUgOiB7fSwgZW52aXJvbm1lbnQuaXRlbXMpO1xuICAgICAgICB9LFxuICAgICAgICB0cmVlSW5mb3JtYXRpb246IHRyZWVJbmZvcm1hdGlvbixcbiAgICAgICAgc2VhcmNoOiBzZWFyY2gsXG4gICAgICAgIHNldFNlYXJjaDogc2V0U2VhcmNoLFxuICAgICAgICByZW5hbWluZ0l0ZW06IHJlbmFtaW5nSXRlbSxcbiAgICAgICAgc2V0UmVuYW1pbmdJdGVtOiBzZXRSZW5hbWluZ0l0ZW0sXG4gICAgICAgIHJlbmRlcmVyczogcmVuZGVyZXJzLFxuICAgIH0pOyB9LCBbXG4gICAgICAgIGVudmlyb25tZW50Lml0ZW1zLFxuICAgICAgICBwcm9wcy5yb290SXRlbSxcbiAgICAgICAgcHJvcHMudHJlZUlkLFxuICAgICAgICBwcm9wcy50cmVlTGFiZWwsXG4gICAgICAgIHByb3BzLnRyZWVMYWJlbGxlZEJ5LFxuICAgICAgICByZW5hbWluZ0l0ZW0sXG4gICAgICAgIHJlbmRlcmVycyxcbiAgICAgICAgc2VhcmNoLFxuICAgICAgICB0cmVlSW5mb3JtYXRpb24sXG4gICAgICAgIHZpZXdTdGF0ZSxcbiAgICBdKTtcbiAgICBpZiAocm9vdEl0ZW0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAoX2EgPSBlbnZpcm9ubWVudC5vbk1pc3NpbmdJdGVtcykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmNhbGwoZW52aXJvbm1lbnQsIFtwcm9wcy5yb290SXRlbV0pO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFRyZWVDb250ZXh0LlByb3ZpZGVyLCB7IHZhbHVlOiB0cmVlQ29udGV4dFByb3BzIH0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVHJlZUFjdGlvbnNQcm92aWRlciwgeyByZWY6IHJlZiB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUcmVlTWFuYWdlciwgbnVsbCkpKSk7XG59KTtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBUcmVlSXRlbUVsZW1lbnQgfSBmcm9tICcuL1RyZWVJdGVtRWxlbWVudCc7XG5pbXBvcnQgeyB1c2VUcmVlIH0gZnJvbSAnLi4vdHJlZS9UcmVlJztcbmV4cG9ydCB2YXIgVHJlZUl0ZW1DaGlsZHJlbiA9IGZ1bmN0aW9uIChwcm9wcykge1xuICAgIHZhciBfYSA9IHVzZVRyZWUoKSwgcmVuZGVyZXJzID0gX2EucmVuZGVyZXJzLCB0cmVlSW5mb3JtYXRpb24gPSBfYS50cmVlSW5mb3JtYXRpb247XG4gICAgdmFyIGNoaWxkRWxlbWVudHMgPSBbXTtcbiAgICBmb3IgKHZhciBfaSA9IDAsIF9iID0gcHJvcHMuY2hpbGRyZW47IF9pIDwgX2IubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIHZhciBjaGlsZCA9IF9iW19pXTtcbiAgICAgICAgY2hpbGRFbGVtZW50cy5wdXNoKFJlYWN0LmNyZWF0ZUVsZW1lbnQoVHJlZUl0ZW1FbGVtZW50LCB7IGtleTogY2hpbGQsIGl0ZW1JbmRleDogY2hpbGQsIGRlcHRoOiBwcm9wcy5kZXB0aCB9KSk7XG4gICAgfVxuICAgIGlmIChjaGlsZEVsZW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgdmFyIGNvbnRhaW5lclByb3BzID0ge1xuICAgICAgICByb2xlOiBwcm9wcy5kZXB0aCAhPT0gMCA/ICdncm91cCcgOiB1bmRlZmluZWQsXG4gICAgfTtcbiAgICByZXR1cm4gcmVuZGVyZXJzLnJlbmRlckl0ZW1zQ29udGFpbmVyKHtcbiAgICAgICAgY2hpbGRyZW46IGNoaWxkRWxlbWVudHMsXG4gICAgICAgIGluZm86IHRyZWVJbmZvcm1hdGlvbixcbiAgICAgICAgY29udGFpbmVyUHJvcHM6IGNvbnRhaW5lclByb3BzLFxuICAgICAgICBkZXB0aDogcHJvcHMuZGVwdGgsXG4gICAgICAgIHBhcmVudElkOiBwcm9wcy5wYXJlbnRJZCxcbiAgICB9KTtcbn07XG4iLCJ2YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxuICAgICAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0O1xuICAgIH07XG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xudmFyIF9fc3ByZWFkQXJyYXkgPSAodGhpcyAmJiB0aGlzLl9fc3ByZWFkQXJyYXkpIHx8IGZ1bmN0aW9uICh0bywgZnJvbSwgcGFjaykge1xuICAgIGlmIChwYWNrIHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIGZvciAodmFyIGkgPSAwLCBsID0gZnJvbS5sZW5ndGgsIGFyOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGlmIChhciB8fCAhKGkgaW4gZnJvbSkpIHtcbiAgICAgICAgICAgIGlmICghYXIpIGFyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSwgMCwgaSk7XG4gICAgICAgICAgICBhcltpXSA9IGZyb21baV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRvLmNvbmNhdChhciB8fCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tKSk7XG59O1xuaW1wb3J0IHsgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGRlZmF1bHRNYXRjaGVyIH0gZnJvbSAnLi4vc2VhcmNoL2RlZmF1bHRNYXRjaGVyJztcbmltcG9ydCB7IHVzZVRyZWUgfSBmcm9tICcuLi90cmVlL1RyZWUnO1xuaW1wb3J0IHsgdXNlVHJlZUVudmlyb25tZW50IH0gZnJvbSAnLi4vY29udHJvbGxlZEVudmlyb25tZW50L0NvbnRyb2xsZWRUcmVlRW52aXJvbm1lbnQnO1xuaW1wb3J0IHsgdXNlSW50ZXJhY3Rpb25NYW5hZ2VyIH0gZnJvbSAnLi4vY29udHJvbGxlZEVudmlyb25tZW50L0ludGVyYWN0aW9uTWFuYWdlclByb3ZpZGVyJztcbmltcG9ydCB7IHVzZURyYWdBbmREcm9wIH0gZnJvbSAnLi4vZHJhZy9EcmFnQW5kRHJvcFByb3ZpZGVyJztcbmltcG9ydCB7IHVzZVNlbGVjdFVwVG8gfSBmcm9tICcuLi90cmVlL3VzZVNlbGVjdFVwVG8nO1xuaW1wb3J0IHsgdXNlR2V0T3JpZ2luYWxJdGVtT3JkZXIgfSBmcm9tICcuLi91c2VHZXRPcmlnaW5hbEl0ZW1PcmRlcic7XG4vLyBUT0RPIHJlc3RydWN0dXJlIGZpbGUuIEV2ZXJ5dGhpbmcgaW50byBvbmUgaG9vayBmaWxlIHdpdGhvdXQgaGVscGVyIG1ldGhvZHMsIGxldCBhbGwgcHJvcHMgYmUgZ2VuZXJhdGVkIG91dHNpZGUgKEludGVyYWN0aW9uTWFuYWdlciBhbmQgQWNjZXNzaWJpbGl0eVByb3BzTWFuYWdlciksIC4uLlxuZXhwb3J0IHZhciB1c2VUcmVlSXRlbVJlbmRlckNvbnRleHQgPSBmdW5jdGlvbiAoaXRlbSkge1xuICAgIHZhciBfYSwgX2IsIF9jLCBfZDtcbiAgICB2YXIgX2UgPSB1c2VUcmVlKCksIHRyZWVJZCA9IF9lLnRyZWVJZCwgc2VhcmNoID0gX2Uuc2VhcmNoLCByZW5hbWluZ0l0ZW0gPSBfZS5yZW5hbWluZ0l0ZW0sIHNldFJlbmFtaW5nSXRlbSA9IF9lLnNldFJlbmFtaW5nSXRlbTtcbiAgICB2YXIgZW52aXJvbm1lbnQgPSB1c2VUcmVlRW52aXJvbm1lbnQoKTtcbiAgICB2YXIgaW50ZXJhY3Rpb25NYW5hZ2VyID0gdXNlSW50ZXJhY3Rpb25NYW5hZ2VyKCk7XG4gICAgdmFyIGRuZCA9IHVzZURyYWdBbmREcm9wKCk7XG4gICAgdmFyIHNlbGVjdFVwVG8gPSB1c2VTZWxlY3RVcFRvKCdsYXN0LWZvY3VzJyk7XG4gICAgdmFyIGl0ZW1UaXRsZSA9IGl0ZW0gJiYgZW52aXJvbm1lbnQuZ2V0SXRlbVRpdGxlKGl0ZW0pO1xuICAgIHZhciBnZXRPcmlnaW5hbEl0ZW1PcmRlciA9IHVzZUdldE9yaWdpbmFsSXRlbU9yZGVyKCk7XG4gICAgdmFyIGlzU2VhcmNoTWF0Y2hpbmcgPSB1c2VNZW1vKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gc2VhcmNoID09PSBudWxsIHx8IHNlYXJjaC5sZW5ndGggPT09IDAgfHwgIWl0ZW0gfHwgIWl0ZW1UaXRsZVxuICAgICAgICAgICAgPyBmYWxzZVxuICAgICAgICAgICAgOiAoKF9hID0gZW52aXJvbm1lbnQuZG9lc1NlYXJjaE1hdGNoSXRlbSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogZGVmYXVsdE1hdGNoZXIpKHNlYXJjaCwgaXRlbSwgaXRlbVRpdGxlKTtcbiAgICB9LCBbc2VhcmNoLCBpdGVtLCBpdGVtVGl0bGUsIGVudmlyb25tZW50LmRvZXNTZWFyY2hNYXRjaEl0ZW1dKTtcbiAgICB2YXIgaXNTZWxlY3RlZCA9IGl0ZW0gJiYgKChfYiA9IChfYSA9IGVudmlyb25tZW50LnZpZXdTdGF0ZVt0cmVlSWRdKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Euc2VsZWN0ZWRJdGVtcykgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmluY2x1ZGVzKGl0ZW0uaW5kZXgpKTtcbiAgICB2YXIgaXNFeHBhbmRlZCA9IGl0ZW0gJiYgKChfZCA9IChfYyA9IGVudmlyb25tZW50LnZpZXdTdGF0ZVt0cmVlSWRdKSA9PT0gbnVsbCB8fCBfYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2MuZXhwYW5kZWRJdGVtcykgPT09IG51bGwgfHwgX2QgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9kLmluY2x1ZGVzKGl0ZW0uaW5kZXgpKTtcbiAgICB2YXIgaXNSZW5hbWluZyA9IGl0ZW0gJiYgcmVuYW1pbmdJdGVtID09PSBpdGVtLmluZGV4O1xuICAgIHJldHVybiB1c2VNZW1vKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF9hLCBfYiwgX2MsIF9kLCBfZSwgX2YsIF9nLCBfaCwgX2o7XG4gICAgICAgIGlmICghaXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdmlld1N0YXRlID0gZW52aXJvbm1lbnQudmlld1N0YXRlW3RyZWVJZF07XG4gICAgICAgIHZhciBjdXJyZW50bHlTZWxlY3RlZEl0ZW1zID0gKChfYiA9IChfYSA9IHZpZXdTdGF0ZSA9PT0gbnVsbCB8fCB2aWV3U3RhdGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHZpZXdTdGF0ZS5zZWxlY3RlZEl0ZW1zKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EubWFwKGZ1bmN0aW9uIChpdGVtKSB7IHJldHVybiBlbnZpcm9ubWVudC5pdGVtc1tpdGVtXTsgfSkpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6ICgodmlld1N0YXRlID09PSBudWxsIHx8IHZpZXdTdGF0ZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogdmlld1N0YXRlLmZvY3VzZWRJdGVtKVxuICAgICAgICAgICAgPyBbZW52aXJvbm1lbnQuaXRlbXNbdmlld1N0YXRlID09PSBudWxsIHx8IHZpZXdTdGF0ZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogdmlld1N0YXRlLmZvY3VzZWRJdGVtXV1cbiAgICAgICAgICAgIDogW10pKS5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHsgcmV0dXJuICEhaXRlbTsgfSk7XG4gICAgICAgIHZhciBpc0l0ZW1QYXJ0T2ZTZWxlY3RlZEl0ZW1zID0gISFjdXJyZW50bHlTZWxlY3RlZEl0ZW1zLmZpbmQoZnVuY3Rpb24gKHNlbGVjdGVkSXRlbSkgeyByZXR1cm4gc2VsZWN0ZWRJdGVtLmluZGV4ID09PSBpdGVtLmluZGV4OyB9KTtcbiAgICAgICAgdmFyIGNhbkRyYWdDdXJyZW50bHlTZWxlY3RlZEl0ZW1zID0gY3VycmVudGx5U2VsZWN0ZWRJdGVtcyAmJlxuICAgICAgICAgICAgKChfZCA9IChfYyA9IGVudmlyb25tZW50LmNhbkRyYWcpID09PSBudWxsIHx8IF9jID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYy5jYWxsKGVudmlyb25tZW50LCBjdXJyZW50bHlTZWxlY3RlZEl0ZW1zKSkgIT09IG51bGwgJiYgX2QgIT09IHZvaWQgMCA/IF9kIDogdHJ1ZSkgJiZcbiAgICAgICAgICAgIGN1cnJlbnRseVNlbGVjdGVkSXRlbXNcbiAgICAgICAgICAgICAgICAubWFwKGZ1bmN0aW9uIChpdGVtKSB7IHZhciBfYTsgcmV0dXJuIChfYSA9IGl0ZW0uY2FuTW92ZSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogdHJ1ZTsgfSlcbiAgICAgICAgICAgICAgICAucmVkdWNlKGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiBhICYmIGI7IH0sIHRydWUpO1xuICAgICAgICB2YXIgY2FuRHJhZ1RoaXNJdGVtID0gKChfZiA9IChfZSA9IGVudmlyb25tZW50LmNhbkRyYWcpID09PSBudWxsIHx8IF9lID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZS5jYWxsKGVudmlyb25tZW50LCBbaXRlbV0pKSAhPT0gbnVsbCAmJiBfZiAhPT0gdm9pZCAwID8gX2YgOiB0cnVlKSAmJiAoKF9nID0gaXRlbS5jYW5Nb3ZlKSAhPT0gbnVsbCAmJiBfZyAhPT0gdm9pZCAwID8gX2cgOiB0cnVlKTtcbiAgICAgICAgdmFyIGNhbkRyYWcgPSBlbnZpcm9ubWVudC5jYW5EcmFnQW5kRHJvcCAmJlxuICAgICAgICAgICAgKChpc0l0ZW1QYXJ0T2ZTZWxlY3RlZEl0ZW1zICYmIGNhbkRyYWdDdXJyZW50bHlTZWxlY3RlZEl0ZW1zKSB8fFxuICAgICAgICAgICAgICAgICghaXNJdGVtUGFydE9mU2VsZWN0ZWRJdGVtcyAmJiBjYW5EcmFnVGhpc0l0ZW0pKTtcbiAgICAgICAgdmFyIGNhbkRyb3BPbiA9IGVudmlyb25tZW50LmNhbkRyYWdBbmREcm9wICYmXG4gICAgICAgICAgICAhISgoX2ogPSAoX2ggPSBkbmQudmlhYmxlRHJhZ1Bvc2l0aW9ucykgPT09IG51bGwgfHwgX2ggPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9oW3RyZWVJZF0pID09PSBudWxsIHx8IF9qID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfai5maW5kKGZ1bmN0aW9uIChwb3NpdGlvbikge1xuICAgICAgICAgICAgICAgIHJldHVybiBwb3NpdGlvbi50YXJnZXRUeXBlID09PSAnaXRlbScgJiYgcG9zaXRpb24udGFyZ2V0SXRlbSA9PT0gaXRlbS5pbmRleDtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgdmFyIGFjdGlvbnMgPSB7XG4gICAgICAgICAgICAvLyBUT0RPIGRpc2FibGUgbW9zdCBhY3Rpb25zIGR1cmluZyByZW5hbWVcbiAgICAgICAgICAgIHByaW1hcnlBY3Rpb246IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICAgICAgKF9hID0gZW52aXJvbm1lbnQub25QcmltYXJ5QWN0aW9uKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuY2FsbChlbnZpcm9ubWVudCwgZW52aXJvbm1lbnQuaXRlbXNbaXRlbS5pbmRleF0sIHRyZWVJZCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29sbGFwc2VJdGVtOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgICAgIChfYSA9IGVudmlyb25tZW50Lm9uQ29sbGFwc2VJdGVtKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuY2FsbChlbnZpcm9ubWVudCwgaXRlbSwgdHJlZUlkKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBleHBhbmRJdGVtOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgICAgIChfYSA9IGVudmlyb25tZW50Lm9uRXhwYW5kSXRlbSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmNhbGwoZW52aXJvbm1lbnQsIGl0ZW0sIHRyZWVJZCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9nZ2xlRXhwYW5kZWRTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgICAgICAgICAgaWYgKGlzRXhwYW5kZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgKF9hID0gZW52aXJvbm1lbnQub25Db2xsYXBzZUl0ZW0pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5jYWxsKGVudmlyb25tZW50LCBpdGVtLCB0cmVlSWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgKF9iID0gZW52aXJvbm1lbnQub25FeHBhbmRJdGVtKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuY2FsbChlbnZpcm9ubWVudCwgaXRlbSwgdHJlZUlkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2VsZWN0SXRlbTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgICAgICAoX2EgPSBlbnZpcm9ubWVudC5vblNlbGVjdEl0ZW1zKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuY2FsbChlbnZpcm9ubWVudCwgW2l0ZW0uaW5kZXhdLCB0cmVlSWQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFkZFRvU2VsZWN0ZWRJdGVtczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgICAgICAgICAgKF9hID0gZW52aXJvbm1lbnQub25TZWxlY3RJdGVtcykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmNhbGwoZW52aXJvbm1lbnQsIF9fc3ByZWFkQXJyYXkoX19zcHJlYWRBcnJheShbXSwgKChfYiA9IHZpZXdTdGF0ZSA9PT0gbnVsbCB8fCB2aWV3U3RhdGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHZpZXdTdGF0ZS5zZWxlY3RlZEl0ZW1zKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiBbXSksIHRydWUpLCBbaXRlbS5pbmRleF0sIGZhbHNlKSwgdHJlZUlkKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB1bnNlbGVjdEl0ZW06IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgX2EsIF9iLCBfYztcbiAgICAgICAgICAgICAgICAoX2EgPSBlbnZpcm9ubWVudC5vblNlbGVjdEl0ZW1zKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuY2FsbChlbnZpcm9ubWVudCwgKF9jID0gKF9iID0gdmlld1N0YXRlID09PSBudWxsIHx8IHZpZXdTdGF0ZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogdmlld1N0YXRlLnNlbGVjdGVkSXRlbXMpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5maWx0ZXIoZnVuY3Rpb24gKGlkKSB7IHJldHVybiBpZCAhPT0gaXRlbS5pbmRleDsgfSkpICE9PSBudWxsICYmIF9jICE9PSB2b2lkIDAgPyBfYyA6IFtdLCB0cmVlSWQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNlbGVjdFVwVG86IGZ1bmN0aW9uIChvdmVycmlkZU9sZFNlbGVjdGlvbikge1xuICAgICAgICAgICAgICAgIHNlbGVjdFVwVG8oaXRlbSwgb3ZlcnJpZGVPbGRTZWxlY3Rpb24pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN0YXJ0UmVuYW1pbmdJdGVtOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2V0UmVuYW1pbmdJdGVtKGl0ZW0uaW5kZXgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN0b3BSZW5hbWluZ0l0ZW06IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZXRSZW5hbWluZ0l0ZW0obnVsbCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZm9jdXNJdGVtOiBmdW5jdGlvbiAoc2V0RG9tRm9jdXMpIHtcbiAgICAgICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICAgICAgaWYgKHNldERvbUZvY3VzID09PSB2b2lkIDApIHsgc2V0RG9tRm9jdXMgPSB0cnVlOyB9XG4gICAgICAgICAgICAgICAgKF9hID0gZW52aXJvbm1lbnQub25Gb2N1c0l0ZW0pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5jYWxsKGVudmlyb25tZW50LCBpdGVtLCB0cmVlSWQsIHNldERvbUZvY3VzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdGFydERyYWdnaW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZWN0ZWRJdGVtcyA9IChfYSA9IHZpZXdTdGF0ZSA9PT0gbnVsbCB8fCB2aWV3U3RhdGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHZpZXdTdGF0ZS5zZWxlY3RlZEl0ZW1zKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBbXTtcbiAgICAgICAgICAgICAgICBpZiAoIXNlbGVjdGVkSXRlbXMuaW5jbHVkZXMoaXRlbS5pbmRleCkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRJdGVtcyA9IFtpdGVtLmluZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgKF9iID0gZW52aXJvbm1lbnQub25TZWxlY3RJdGVtcykgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmNhbGwoZW52aXJvbm1lbnQsIHNlbGVjdGVkSXRlbXMsIHRyZWVJZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChjYW5EcmFnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvcmRlcmVkSXRlbXMgPSBnZXRPcmlnaW5hbEl0ZW1PcmRlcih0cmVlSWQsIHNlbGVjdGVkSXRlbXMubWFwKGZ1bmN0aW9uIChpZCkgeyByZXR1cm4gZW52aXJvbm1lbnQuaXRlbXNbaWRdOyB9KSk7XG4gICAgICAgICAgICAgICAgICAgIGRuZC5vblN0YXJ0RHJhZ2dpbmdJdGVtcyhvcmRlcmVkSXRlbXMsIHRyZWVJZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIHJlbmRlckZsYWdzID0ge1xuICAgICAgICAgICAgaXNTZWxlY3RlZDogaXNTZWxlY3RlZCxcbiAgICAgICAgICAgIGlzRXhwYW5kZWQ6IGlzRXhwYW5kZWQsXG4gICAgICAgICAgICBpc0ZvY3VzZWQ6ICh2aWV3U3RhdGUgPT09IG51bGwgfHwgdmlld1N0YXRlID09PSB2b2lkIDAgPyB2b2lkIDAgOiB2aWV3U3RhdGUuZm9jdXNlZEl0ZW0pID09PSBpdGVtLmluZGV4LFxuICAgICAgICAgICAgaXNSZW5hbWluZzogaXNSZW5hbWluZyxcbiAgICAgICAgICAgIGlzRHJhZ2dpbmdPdmVyOiBkbmQuZHJhZ2dpbmdQb3NpdGlvbiAmJlxuICAgICAgICAgICAgICAgIGRuZC5kcmFnZ2luZ1Bvc2l0aW9uLnRhcmdldFR5cGUgPT09ICdpdGVtJyAmJlxuICAgICAgICAgICAgICAgIGRuZC5kcmFnZ2luZ1Bvc2l0aW9uLnRhcmdldEl0ZW0gPT09IGl0ZW0uaW5kZXggJiZcbiAgICAgICAgICAgICAgICBkbmQuZHJhZ2dpbmdQb3NpdGlvbi50cmVlSWQgPT09IHRyZWVJZCxcbiAgICAgICAgICAgIGlzRHJhZ2dpbmdPdmVyUGFyZW50OiBmYWxzZSxcbiAgICAgICAgICAgIGlzU2VhcmNoTWF0Y2hpbmc6IGlzU2VhcmNoTWF0Y2hpbmcsXG4gICAgICAgICAgICBjYW5EcmFnOiBjYW5EcmFnLFxuICAgICAgICAgICAgY2FuRHJvcE9uOiBjYW5Ecm9wT24sXG4gICAgICAgIH07XG4gICAgICAgIHZhciBpbnRlcmFjdGl2ZUVsZW1lbnRQcm9wcyA9IF9fYXNzaWduKF9fYXNzaWduKHt9LCBpbnRlcmFjdGlvbk1hbmFnZXIuY3JlYXRlSW50ZXJhY3RpdmVFbGVtZW50UHJvcHMoaXRlbSwgdHJlZUlkLCBhY3Rpb25zLCByZW5kZXJGbGFncywgdmlld1N0YXRlKSksIHtcbiAgICAgICAgICAgICdkYXRhLXJjdC1pdGVtLWludGVyYWN0aXZlJzogdHJ1ZSxcbiAgICAgICAgICAgICdkYXRhLXJjdC1pdGVtLWZvY3VzJzogcmVuZGVyRmxhZ3MuaXNGb2N1c2VkID8gJ3RydWUnIDogJ2ZhbHNlJyxcbiAgICAgICAgICAgICdkYXRhLXJjdC1pdGVtLWlkJzogaXRlbS5pbmRleCxcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBpdGVtQ29udGFpbmVyV2l0aG91dENoaWxkcmVuUHJvcHMgPSBfX2Fzc2lnbih7fSwge1xuICAgICAgICAgICAgJ2RhdGEtcmN0LWl0ZW0tY29udGFpbmVyJzogJ3RydWUnLFxuICAgICAgICB9KTtcbiAgICAgICAgdmFyIGl0ZW1Db250YWluZXJXaXRoQ2hpbGRyZW5Qcm9wcyA9IHtcbiAgICAgICAgICAgIHJvbGU6ICd0cmVlaXRlbScsXG4gICAgICAgICAgICAnYXJpYS1zZWxlY3RlZCc6IHJlbmRlckZsYWdzLmlzU2VsZWN0ZWQsXG4gICAgICAgICAgICAnYXJpYS1leHBhbmRlZCc6IGl0ZW0uaXNGb2xkZXJcbiAgICAgICAgICAgICAgICA/IHJlbmRlckZsYWdzLmlzRXhwYW5kZWRcbiAgICAgICAgICAgICAgICAgICAgPyAndHJ1ZSdcbiAgICAgICAgICAgICAgICAgICAgOiAnZmFsc2UnXG4gICAgICAgICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgIH07XG4gICAgICAgIHZhciBhcnJvd1Byb3BzID0ge1xuICAgICAgICAgICAgb25DbGljazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmIChpdGVtLmlzRm9sZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbnMudG9nZ2xlRXhwYW5kZWRTdGF0ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhY3Rpb25zLnNlbGVjdEl0ZW0oKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvbkZvY3VzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgYWN0aW9ucy5mb2N1c0l0ZW0oKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvbkRyYWdPdmVyOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTsgLy8gQWxsb3cgZHJvcFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdhcmlhLWhpZGRlbic6IHRydWUsXG4gICAgICAgICAgICB0YWJJbmRleDogLTEsXG4gICAgICAgIH07XG4gICAgICAgIHZhciB2aWV3U3RhdGVGbGFncyA9ICF2aWV3U3RhdGVcbiAgICAgICAgICAgID8ge31cbiAgICAgICAgICAgIDogT2JqZWN0LmVudHJpZXModmlld1N0YXRlKS5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgX2EpIHtcbiAgICAgICAgICAgICAgICB2YXIga2V5ID0gX2FbMF0sIHZhbHVlID0gX2FbMV07XG4gICAgICAgICAgICAgICAgYWNjW2tleV0gPSBBcnJheS5pc0FycmF5KHZhbHVlKVxuICAgICAgICAgICAgICAgICAgICA/IHZhbHVlLmluY2x1ZGVzKGl0ZW0uaW5kZXgpXG4gICAgICAgICAgICAgICAgICAgIDogdmFsdWUgPT09IGl0ZW0uaW5kZXg7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgICAgIH0sIHt9KTtcbiAgICAgICAgcmV0dXJuIF9fYXNzaWduKF9fYXNzaWduKF9fYXNzaWduKHt9LCBhY3Rpb25zKSwgcmVuZGVyRmxhZ3MpLCB7IGludGVyYWN0aXZlRWxlbWVudFByb3BzOiBpbnRlcmFjdGl2ZUVsZW1lbnRQcm9wcywgaXRlbUNvbnRhaW5lcldpdGhDaGlsZHJlblByb3BzOiBpdGVtQ29udGFpbmVyV2l0aENoaWxkcmVuUHJvcHMsIGl0ZW1Db250YWluZXJXaXRob3V0Q2hpbGRyZW5Qcm9wczogaXRlbUNvbnRhaW5lcldpdGhvdXRDaGlsZHJlblByb3BzLCBhcnJvd1Byb3BzOiBhcnJvd1Byb3BzLCB2aWV3U3RhdGVGbGFnczogdmlld1N0YXRlRmxhZ3MgfSk7XG4gICAgfSwgW1xuICAgICAgICBpdGVtLFxuICAgICAgICBlbnZpcm9ubWVudCxcbiAgICAgICAgdHJlZUlkLFxuICAgICAgICBkbmQsXG4gICAgICAgIGlzU2VsZWN0ZWQsXG4gICAgICAgIGlzRXhwYW5kZWQsXG4gICAgICAgIGlzUmVuYW1pbmcsXG4gICAgICAgIGlzU2VhcmNoTWF0Y2hpbmcsXG4gICAgICAgIGludGVyYWN0aW9uTWFuYWdlcixcbiAgICAgICAgc2VsZWN0VXBUbyxcbiAgICAgICAgc2V0UmVuYW1pbmdJdGVtLFxuICAgICAgICBnZXRPcmlnaW5hbEl0ZW1PcmRlcixcbiAgICBdKTtcbn07XG4iLCJpbXBvcnQgeyB1c2VSZWYsIHVzZVN0YXRlLCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZVRyZWUgfSBmcm9tICcuLi90cmVlL1RyZWUnO1xuaW1wb3J0IHsgdXNlVHJlZUVudmlyb25tZW50IH0gZnJvbSAnLi4vY29udHJvbGxlZEVudmlyb25tZW50L0NvbnRyb2xsZWRUcmVlRW52aXJvbm1lbnQnO1xuaW1wb3J0IHsgdXNlSG90a2V5IH0gZnJvbSAnLi4vaG90a2V5cy91c2VIb3RrZXknO1xuaW1wb3J0IHsgdXNlU2lkZUVmZmVjdCB9IGZyb20gJy4uL3VzZVNpZGVFZmZlY3QnO1xuaW1wb3J0IHsgdXNlQ2FsbFNvb24gfSBmcm9tICcuLi91c2VDYWxsU29vbic7XG5leHBvcnQgdmFyIFRyZWVJdGVtUmVuYW1pbmdJbnB1dCA9IGZ1bmN0aW9uIChwcm9wcykge1xuICAgIHZhciBfYSA9IHVzZVRyZWUoKSwgcmVuZGVyZXJzID0gX2EucmVuZGVyZXJzLCB0cmVlSW5mb3JtYXRpb24gPSBfYS50cmVlSW5mb3JtYXRpb24sIHNldFJlbmFtaW5nSXRlbSA9IF9hLnNldFJlbmFtaW5nSXRlbSwgdHJlZUlkID0gX2EudHJlZUlkO1xuICAgIHZhciBlbnZpcm9ubWVudCA9IHVzZVRyZWVFbnZpcm9ubWVudCgpO1xuICAgIHZhciBpbnB1dFJlZiA9IHVzZVJlZihudWxsKTtcbiAgICB2YXIgc3VibWl0QnV0dG9uUmVmID0gdXNlUmVmKG51bGwpO1xuICAgIHZhciBpdGVtID0gZW52aXJvbm1lbnQuaXRlbXNbcHJvcHMuaXRlbUluZGV4XTtcbiAgICB2YXIgX2IgPSB1c2VTdGF0ZShlbnZpcm9ubWVudC5nZXRJdGVtVGl0bGUoaXRlbSkpLCB0aXRsZSA9IF9iWzBdLCBzZXRUaXRsZSA9IF9iWzFdO1xuICAgIHZhciBjYWxsU29vbiA9IHVzZUNhbGxTb29uKHRydWUpO1xuICAgIHZhciBhYm9ydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICAoX2EgPSBlbnZpcm9ubWVudC5vbkFib3J0UmVuYW1pbmdJdGVtKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuY2FsbChlbnZpcm9ubWVudCwgaXRlbSwgdHJlZUluZm9ybWF0aW9uLnRyZWVJZCk7XG4gICAgICAgIHNldFJlbmFtaW5nSXRlbShudWxsKTtcbiAgICAgICAgY2FsbFNvb24oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZW52aXJvbm1lbnQuc2V0QWN0aXZlVHJlZSh0cmVlSWQpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBjb25maXJtID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIChfYSA9IGVudmlyb25tZW50Lm9uUmVuYW1lSXRlbSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmNhbGwoZW52aXJvbm1lbnQsIGl0ZW0sIHRpdGxlLCB0cmVlSW5mb3JtYXRpb24udHJlZUlkKTtcbiAgICAgICAgc2V0UmVuYW1pbmdJdGVtKG51bGwpO1xuICAgICAgICBjYWxsU29vbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBlbnZpcm9ubWVudC5zZXRBY3RpdmVUcmVlKHRyZWVJZCk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgdXNlU2lkZUVmZmVjdChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfYSwgX2IsIF9jLCBfZDtcbiAgICAgICAgZW52aXJvbm1lbnQuc2V0QWN0aXZlVHJlZSh0cmVlSWQpO1xuICAgICAgICBpZiAoKF9hID0gZW52aXJvbm1lbnQuYXV0b0ZvY3VzKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiB0cnVlKSB7XG4gICAgICAgICAgICAoX2IgPSBpbnB1dFJlZi5jdXJyZW50KSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Iuc2VsZWN0KCk7XG4gICAgICAgICAgICAoX2QgPSAoX2MgPSBpbnB1dFJlZi5jdXJyZW50KSA9PT0gbnVsbCB8fCBfYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2MuZm9jdXMpID09PSBudWxsIHx8IF9kID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZC5jYWxsKF9jKTtcbiAgICAgICAgfVxuICAgIH0sIFtlbnZpcm9ubWVudCwgdHJlZUlkXSwgW10pO1xuICAgIHVzZUhvdGtleSgnYWJvcnRSZW5hbWVJdGVtJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBhYm9ydCgpO1xuICAgIH0sIHRydWUsIHRydWUpO1xuICAgIHZhciBpbnB1dFByb3BzID0ge1xuICAgICAgICB2YWx1ZTogdGl0bGUsXG4gICAgICAgIG9uQ2hhbmdlOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgc2V0VGl0bGUoZS50YXJnZXQudmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBvbkJsdXI6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBpZiAoIWUucmVsYXRlZFRhcmdldCB8fCBlLnJlbGF0ZWRUYXJnZXQgIT09IHN1Ym1pdEJ1dHRvblJlZi5jdXJyZW50KSB7XG4gICAgICAgICAgICAgICAgYWJvcnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgJ2FyaWEtbGFiZWwnOiAnTmV3IGl0ZW0gbmFtZScsXG4gICAgICAgIHRhYkluZGV4OiAwLFxuICAgIH07XG4gICAgdmFyIHN1Ym1pdEJ1dHRvblByb3BzID0ge1xuICAgICAgICBvbkNsaWNrOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIGNvbmZpcm0oKTtcbiAgICAgICAgfSxcbiAgICB9O1xuICAgIHZhciBmb3JtUHJvcHMgPSB7XG4gICAgICAgIG9uU3VibWl0OiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgY29uZmlybSgpO1xuICAgICAgICB9LFxuICAgIH07XG4gICAgcmV0dXJuIHJlbmRlcmVycy5yZW5kZXJSZW5hbWVJbnB1dCh7XG4gICAgICAgIGl0ZW06IGl0ZW0sXG4gICAgICAgIGlucHV0UmVmOiBpbnB1dFJlZixcbiAgICAgICAgc3VibWl0QnV0dG9uUHJvcHM6IHN1Ym1pdEJ1dHRvblByb3BzLFxuICAgICAgICBzdWJtaXRCdXR0b25SZWY6IHN1Ym1pdEJ1dHRvblJlZixcbiAgICAgICAgZm9ybVByb3BzOiBmb3JtUHJvcHMsXG4gICAgICAgIGlucHV0UHJvcHM6IGlucHV0UHJvcHMsXG4gICAgfSk7XG59O1xuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZU1lbW8sIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgVHJlZUl0ZW1DaGlsZHJlbiB9IGZyb20gJy4vVHJlZUl0ZW1DaGlsZHJlbic7XG5pbXBvcnQgeyB1c2VWaWV3U3RhdGUgfSBmcm9tICcuLi90cmVlL3VzZVZpZXdTdGF0ZSc7XG5pbXBvcnQgeyB1c2VUcmVlIH0gZnJvbSAnLi4vdHJlZS9UcmVlJztcbmltcG9ydCB7IHVzZVRyZWVFbnZpcm9ubWVudCB9IGZyb20gJy4uL2NvbnRyb2xsZWRFbnZpcm9ubWVudC9Db250cm9sbGVkVHJlZUVudmlyb25tZW50JztcbmltcG9ydCB7IHVzZVRyZWVJdGVtUmVuZGVyQ29udGV4dCB9IGZyb20gJy4vdXNlVHJlZUl0ZW1SZW5kZXJDb250ZXh0JztcbmltcG9ydCB7IFRyZWVJdGVtUmVuYW1pbmdJbnB1dCB9IGZyb20gJy4vVHJlZUl0ZW1SZW5hbWluZ0lucHV0JztcbmV4cG9ydCB2YXIgVHJlZUl0ZW1FbGVtZW50ID0gZnVuY3Rpb24gKHByb3BzKSB7XG4gICAgdmFyIF9hLCBfYiwgX2MsIF9kO1xuICAgIHZhciBfZSA9IHVzZVN0YXRlKGZhbHNlKSwgaGFzQmVlblJlcXVlc3RlZCA9IF9lWzBdLCBzZXRIYXNCZWVuUmVxdWVzdGVkID0gX2VbMV07XG4gICAgdmFyIF9mID0gdXNlVHJlZSgpLCByZW5kZXJlcnMgPSBfZi5yZW5kZXJlcnMsIHRyZWVJbmZvcm1hdGlvbiA9IF9mLnRyZWVJbmZvcm1hdGlvbiwgcmVuYW1pbmdJdGVtID0gX2YucmVuYW1pbmdJdGVtO1xuICAgIHZhciBlbnZpcm9ubWVudCA9IHVzZVRyZWVFbnZpcm9ubWVudCgpO1xuICAgIHZhciB2aWV3U3RhdGUgPSB1c2VWaWV3U3RhdGUoKTtcbiAgICB2YXIgaXRlbSA9IGVudmlyb25tZW50Lml0ZW1zW3Byb3BzLml0ZW1JbmRleF07XG4gICAgdmFyIGlzRXhwYW5kZWQgPSB1c2VNZW1vKGZ1bmN0aW9uICgpIHsgdmFyIF9hOyByZXR1cm4gKF9hID0gdmlld1N0YXRlLmV4cGFuZGVkSXRlbXMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5pbmNsdWRlcyhwcm9wcy5pdGVtSW5kZXgpOyB9LCBbcHJvcHMuaXRlbUluZGV4LCB2aWV3U3RhdGUuZXhwYW5kZWRJdGVtc10pO1xuICAgIHZhciByZW5kZXJDb250ZXh0ID0gdXNlVHJlZUl0ZW1SZW5kZXJDb250ZXh0KGl0ZW0pO1xuICAgIGlmIChpdGVtID09PSB1bmRlZmluZWQgfHwgcmVuZGVyQ29udGV4dCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICghaGFzQmVlblJlcXVlc3RlZCkge1xuICAgICAgICAgICAgc2V0SGFzQmVlblJlcXVlc3RlZCh0cnVlKTtcbiAgICAgICAgICAgIChfYSA9IGVudmlyb25tZW50Lm9uTWlzc2luZ0l0ZW1zKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuY2FsbChlbnZpcm9ubWVudCwgW3Byb3BzLml0ZW1JbmRleF0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICB2YXIgc2hvdWxkUmVuZGVyQ2hpbGRyZW4gPSAoX2MgPSAoX2IgPSBlbnZpcm9ubWVudC5zaG91bGRSZW5kZXJDaGlsZHJlbikgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmNhbGwoZW52aXJvbm1lbnQsIGl0ZW0sIHJlbmRlckNvbnRleHQpKSAhPT0gbnVsbCAmJiBfYyAhPT0gdm9pZCAwID8gX2MgOiAoaXRlbS5pc0ZvbGRlciAmJiBpc0V4cGFuZGVkKTtcbiAgICB2YXIgY2hpbGRyZW4gPSBpdGVtLmNoaWxkcmVuICYmIHNob3VsZFJlbmRlckNoaWxkcmVuICYmIChSZWFjdC5jcmVhdGVFbGVtZW50KFRyZWVJdGVtQ2hpbGRyZW4sIHsgZGVwdGg6IHByb3BzLmRlcHRoICsgMSwgcGFyZW50SWQ6IHByb3BzLml0ZW1JbmRleCB9LCBpdGVtLmNoaWxkcmVuKSk7XG4gICAgdmFyIHRpdGxlID0gZW52aXJvbm1lbnQuZ2V0SXRlbVRpdGxlKGl0ZW0pO1xuICAgIHZhciB0aXRsZUNvbXBvbmVudCA9IHJlbmFtaW5nSXRlbSA9PT0gcHJvcHMuaXRlbUluZGV4ID8gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoVHJlZUl0ZW1SZW5hbWluZ0lucHV0LCB7IGl0ZW1JbmRleDogcHJvcHMuaXRlbUluZGV4IH0pKSA6IChyZW5kZXJlcnMucmVuZGVySXRlbVRpdGxlKHtcbiAgICAgICAgaW5mbzogdHJlZUluZm9ybWF0aW9uLFxuICAgICAgICBjb250ZXh0OiByZW5kZXJDb250ZXh0LFxuICAgICAgICB0aXRsZTogdGl0bGUsXG4gICAgICAgIGl0ZW06IGl0ZW0sXG4gICAgfSkpO1xuICAgIHZhciBhcnJvd0NvbXBvbmVudCA9IHJlbmRlcmVycy5yZW5kZXJJdGVtQXJyb3coe1xuICAgICAgICBpbmZvOiB0cmVlSW5mb3JtYXRpb24sXG4gICAgICAgIGNvbnRleHQ6IHJlbmRlckNvbnRleHQsXG4gICAgICAgIGl0ZW06IGVudmlyb25tZW50Lml0ZW1zW3Byb3BzLml0ZW1JbmRleF0sXG4gICAgfSk7XG4gICAgcmV0dXJuICgoX2QgPSByZW5kZXJlcnMucmVuZGVySXRlbSh7XG4gICAgICAgIGl0ZW06IGVudmlyb25tZW50Lml0ZW1zW3Byb3BzLml0ZW1JbmRleF0sXG4gICAgICAgIGRlcHRoOiBwcm9wcy5kZXB0aCxcbiAgICAgICAgdGl0bGU6IHRpdGxlQ29tcG9uZW50LFxuICAgICAgICBhcnJvdzogYXJyb3dDb21wb25lbnQsXG4gICAgICAgIGNvbnRleHQ6IHJlbmRlckNvbnRleHQsXG4gICAgICAgIGluZm86IHRyZWVJbmZvcm1hdGlvbixcbiAgICAgICAgY2hpbGRyZW46IGNoaWxkcmVuLFxuICAgIH0pKSAhPT0gbnVsbCAmJiBfZCAhPT0gdm9pZCAwID8gX2QgOiBudWxsKTsgLy8gVHlwZSB0byB1c2UgQWxsVHJlZVJlbmRlclByb3BzXG59O1xuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdHJlZURhdGFSZWR1Y2VyKHRyZWVEYXRhLCBhY3Rpb24pIHtcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgICAgIGNhc2UgXCJyZWxvYWRcIjoge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAuLi50cmVlRGF0YSxcbiAgICAgICAgICAgICAgICBkYXRhOiBhY3Rpb24uZGF0YVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBjYXNlIFwidXBkYXRlXCI6IHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICAgICAgICAgICAuLi50cmVlRGF0YVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJlc3VsdC5kYXRhID0ge1xuICAgICAgICAgICAgICAgIC4uLnJlc3VsdC5kYXRhLFxuICAgICAgICAgICAgICAgIC4uLmFjdGlvbi5kYXRhXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKGFjdGlvbi5kZWxldGVkTm9kZUlEcykge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgZGVsZXRlZE5vZGVJRCBvZiBhY3Rpb24uZGVsZXRlZE5vZGVJRHMuc3BsaXQoXCIsXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSByZXN1bHQuZGF0YVtkZWxldGVkTm9kZUlEXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgXCJzZXREYXRhQ2hhbmdlZERhdGVcIjoge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAuLi50cmVlRGF0YSxcbiAgICAgICAgICAgICAgICBkYXRhQ2hhbmdlZERhdGU6IGFjdGlvbi5kYXRhQ2hhbmdlZERhdGVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgZGVmYXVsdDoge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJVbmtub3duIGFjdGlvbjogXCIgKyBhY3Rpb24udHlwZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby10cmFpbGluZy1zcGFjZXMgKi9cbi8qIGVzbGludC1kaXNhYmxlIGNvbW1hLXNwYWNpbmcgKi9cbi8qIGVzbGludC1kaXNhYmxlIHByZXR0aWVyL3ByZXR0aWVyICovXG5pbXBvcnQgeyBDb250cm9sbGVkVHJlZUVudmlyb25tZW50LCBUcmVlIH0gZnJvbSBcInJlYWN0LWNvbXBsZXgtdHJlZVwiO1xuaW1wb3J0IHsgY3JlYXRlRWxlbWVudCwgdXNlQ2FsbGJhY2ssIHVzZUVmZmVjdCwgdXNlUmVkdWNlciwgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IEljb24gfSBmcm9tIFwibWVuZGl4L2NvbXBvbmVudHMvd2ViL0ljb25cIjtcbmltcG9ydCB0cmVlRGF0YVJlZHVjZXIgZnJvbSBcIi4uL3V0aWxzL3RyZWVEYXRhUmVkdWNlclwiO1xuaW1wb3J0IEZpbGVMaXN0VmlldyBmcm9tIFwiLi9GaWxlTGlzdFZpZXdcIjtcblxuXG4vLyDtj7TrjZQg67CPIO2MjOydvCDslYTsnbTsvZgg7Lu07Y+s64SM7Yq4IOy2lOqwgFxuY29uc3QgRm9sZGVySWNvbiA9ICh7IGlzT3BlbiB9KSA9PiAoXG4gICAgPHNwYW4gY2xhc3NOYW1lPVwiZm9sZGVyLWljb25cIj5cbiAgICAgICAge2lzT3BlbiA/IChcbiAgICAgICAgICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMTZcIiBoZWlnaHQ9XCIxNlwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIj5cbiAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTIyIDE5YTIgMiAwIDAgMS0yIDJINGEyIDIgMCAwIDEtMi0yVjVhMiAyIDAgMCAxIDItMmg1bDIgM2g5YTIgMiAwIDAgMSAyIDJ2MTF6XCI+PC9wYXRoPlxuICAgICAgICAgICAgICAgIDxsaW5lIHgxPVwiOVwiIHkxPVwiMTRcIiB4Mj1cIjE1XCIgeTI9XCIxNFwiPjwvbGluZT5cbiAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICApIDogKFxuICAgICAgICAgICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjE2XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiPlxuICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMjIgMTlhMiAyIDAgMCAxLTIgMkg0YTIgMiAwIDAgMS0yLTJWNWEyIDIgMCAwIDEgMi0yaDVsMiAzaDlhMiAyIDAgMCAxIDIgMnYxMXpcIj48L3BhdGg+XG4gICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgKX1cbiAgICA8L3NwYW4+XG4pO1xuXG5jb25zdCBGaWxlSWNvbiA9ICh7IGZpbGVUeXBlIH0pID0+IHtcbiAgICAvLyDtjIzsnbwg7YOA7J6F7JeQIOuUsOudvCDri6Trpbgg7JWE7J207L2YIO2RnOyLnFxuICAgIGNvbnN0IGdldEZpbGVJY29uID0gKCkgPT4ge1xuICAgICAgICBzd2l0Y2ggKGZpbGVUeXBlKSB7XG4gICAgICAgICAgICBjYXNlICdwcHR4JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjE2XCIgaGVpZ2h0PVwiMTZcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCIjRkY1NzMzXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0xNCAySDZhMiAyIDAgMCAwLTIgMnYxNmEyIDIgMCAwIDAgMiAyaDEyYTIgMiAwIDAgMCAyLTJWOHpcIj48L3BhdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cG9seWxpbmUgcG9pbnRzPVwiMTQgMiAxNCA4IDIwIDhcIj48L3BvbHlsaW5lPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD1cIjhcIiB5PVwiMTlcIiBmb250U2l6ZT1cIjhcIiBmaWxsPVwiI0ZGNTczM1wiPlBQVDwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNhc2UgJ3hsc3gnOlxuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMTZcIiBoZWlnaHQ9XCIxNlwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cIiMyRTdEMzJcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTE0IDJINmEyIDIgMCAwIDAtMiAydjE2YTIgMiAwIDAgMCAyIDJoMTJhMiAyIDAgMCAwIDItMlY4elwiPjwvcGF0aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5bGluZSBwb2ludHM9XCIxNCAyIDE0IDggMjAgOFwiPjwvcG9seWxpbmU+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PVwiOVwiIHk9XCIxOVwiIGZvbnRTaXplPVwiOFwiIGZpbGw9XCIjMkU3RDMyXCI+WEw8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjYXNlICdkb2N4JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjE2XCIgaGVpZ2h0PVwiMTZcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCIjMjE5NkYzXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0xNCAySDZhMiAyIDAgMCAwLTIgMnYxNmEyIDIgMCAwIDAgMiAyaDEyYTIgMiAwIDAgMCAyLTJWOHpcIj48L3BhdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cG9seWxpbmUgcG9pbnRzPVwiMTQgMiAxNCA4IDIwIDhcIj48L3BvbHlsaW5lPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD1cIjlcIiB5PVwiMTlcIiBmb250U2l6ZT1cIjhcIiBmaWxsPVwiIzIxOTZGM1wiPkRPQzwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNhc2UgJ3BkZic6XG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjE2XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiI0Y0NDMzNlwiIHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMTQgMkg2YTIgMiAwIDAgMC0yIDJ2MTZhMiAyIDAgMCAwIDIgMmgxMmEyIDIgMCAwIDAgMi0yVjh6XCI+PC9wYXRoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlsaW5lIHBvaW50cz1cIjE0IDIgMTQgOCAyMCA4XCI+PC9wb2x5bGluZT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9XCI4XCIgeT1cIjE5XCIgZm9udFNpemU9XCI4XCIgZmlsbD1cIiNGNDQzMzZcIj5QREY8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMTZcIiBoZWlnaHQ9XCIxNlwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMTQgMkg2YTIgMiAwIDAgMC0yIDJ2MTZhMiAyIDAgMCAwIDIgMmgxMmEyIDIgMCAwIDAgMi0yVjh6XCI+PC9wYXRoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlsaW5lIHBvaW50cz1cIjE0IDIgMTQgOCAyMCA4XCI+PC9wb2x5bGluZT5cbiAgICAgICAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gPHNwYW4gY2xhc3NOYW1lPVwiZmlsZS1pY29uXCI+e2dldEZpbGVJY29uKCl9PC9zcGFuPjtcbn07XG5cblxuXG5cblxuXG5cblxuZXhwb3J0IGZ1bmN0aW9uIFRyZWVDb250YWluZXIoe1xuICAgIGRhdGFDaGFuZ2VkRGF0ZSxcbiAgICBzZXJ2aWNlVXJsLFxuICAgIHdpZGdldE5hbWUsXG4gICAgd2lkZ2V0Q2xhc3NOYW1lLFxuICAgIHRvZ2dsZUV4cGFuZGVkSWNvbk9ubHksXG4gICAgYWxsb3dOb2RlUmVuYW1lLFxuICAgIGFsbG93RHJhZ1Jlb3JkZXJpbmcsXG4gICAgYWxsb3dEcmFnTW92ZSxcbiAgICBjb2xsYXBzZUFsbEJ1dHRvbkljb24sXG4gICAgY29sbGFwc2VBbGxCdXR0b25DYXB0aW9uLFxuICAgIGNvbGxhcHNlQWxsQnV0dG9uQ2xhc3MsXG4gICAgc2hvd0V4cGFuZEFsbEJ1dHRvbixcbiAgICBleHBhbmRBbGxCdXR0b25JY29uLFxuICAgIGV4cGFuZEFsbEJ1dHRvbkNhcHRpb24sXG4gICAgZXhwYW5kQWxsQnV0dG9uQ2xhc3MsXG4gICAgb25TZWxlY3Rpb25DaGFuZ2VkLFxuICAgIG9uTWlzc2luZ05vZGVzLFxuICAgIG9uTm9kZVJlbmFtZWQsXG4gICAgb25Ecm9wLFxuICAgIGxvZ01lc3NhZ2VUb0NvbnNvbGUsXG4gICAgbG9nVG9Db25zb2xlLFxuICAgIGR1bXBTZXJ2aWNlUmVzcG9uc2VJbkNvbnNvbGVcbn0pIHtcbiAgICBjb25zdCBbdHJlZURhdGEsIGRpc3BhdGNoXSA9IHVzZVJlZHVjZXIodHJlZURhdGFSZWR1Y2VyLCBudWxsKTtcbiAgICBjb25zdCBbZm9jdXNlZEl0ZW0sIHNldEZvY3VzZWRJdGVtXSA9IHVzZVN0YXRlKCk7XG4gICAgY29uc3QgW2V4cGFuZGVkSXRlbXMsIHNldEV4cGFuZGVkSXRlbXNdID0gdXNlU3RhdGUoW10pO1xuICAgIGNvbnN0IFtzZWxlY3RlZEl0ZW1zLCBzZXRTZWxlY3RlZEl0ZW1zXSA9IHVzZVN0YXRlKFtdKTtcblxuXG4gLy8g7Jes6riw7JeQIHJlbmRlckl0ZW1UaXRsZSDtlajsiJjrpbwg7LaU6rCAXG4gY29uc3QgcmVuZGVySXRlbVRpdGxlID0gaXRlbSA9PiB7XG4gICAgY29uc3QgZmlsZUV4dGVuc2lvbiA9IGl0ZW0uZGF0YS5uYW1lID8gaXRlbS5kYXRhLm5hbWUuc3BsaXQoJy4nKS5wb3AoKS50b0xvd2VyQ2FzZSgpIDogJyc7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0cmVlLWl0ZW0tY29udGVudFwiPlxuICAgICAgICAgICAge2l0ZW0uaXNGb2xkZXIgPyAoXG4gICAgICAgICAgICAgICAgPEZvbGRlckljb24gaXNPcGVuPXtleHBhbmRlZEl0ZW1zLmluY2x1ZGVzKGl0ZW0uaW5kZXgpfSAvPlxuICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICA8RmlsZUljb24gZmlsZVR5cGU9e2ZpbGVFeHRlbnNpb259IC8+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaXRlbS10ZXh0XCI+e2l0ZW0uZGF0YS5uYW1lfTwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn07XG5cblxuXG5cbiAgICBjb25zb2xlLmxvZyhcInRyZWVEYXRhXCIsIHRyZWVEYXRhKVxuICAgIGNvbnNvbGUuZGlyKFwidHJlZURhdGFcIix0cmVlRGF0YSlcbiAgICBjb25zdCBvblNlbGVjdGlvbkNoYW5nZWRIYW5kbGVyID0gdXNlQ2FsbGJhY2soXG4gICAgICAgIGl0ZW1zID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkSURzID0gaXRlbXMuam9pbihcIixcIik7XG4gICAgICAgICAgICBpZiAobG9nVG9Db25zb2xlKSB7XG4gICAgICAgICAgICAgICAgbG9nTWVzc2FnZVRvQ29uc29sZShcIm9uU2VsZWN0aW9uQ2hhbmdlZEhhbmRsZXIgY2FsbGVkIGZvciBpdGVtcyBcIiArIHNlbGVjdGVkSURzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gU2V0IHRoZSBuZXcgc2VsZWN0aW9uIG9uIHRoZSBzdGF0ZVxuICAgICAgICAgICAgc2V0U2VsZWN0ZWRJdGVtcyhpdGVtcyk7XG5cbiAgICAgICAgICAgIC8vIENhbGwgaGFuZGxlciB3aXRoIGl0ZW0gSURzIGpvaW5lZCBpbnRvIG9uZSBzdHJpbmdcbiAgICAgICAgICAgIG9uU2VsZWN0aW9uQ2hhbmdlZChzZWxlY3RlZElEcyk7XG4gICAgICAgIH0sXG4gICAgICAgIFtsb2dNZXNzYWdlVG9Db25zb2xlLCBsb2dUb0NvbnNvbGUsIG9uU2VsZWN0aW9uQ2hhbmdlZF1cbiAgICApO1xuXG4gICAgLy8g7ZmV7J6lIOyVhOydtO2FnCDslYTsnbTsvZgg7ZW465Ok65+sXG4gICAgY29uc3Qgb25FeHBhbmRJdGVtSGFuZGxlciA9IHVzZUNhbGxiYWNrKFxuICAgICAgICBpdGVtID0+IHtcbiAgICAgICAgICAgIGlmIChsb2dUb0NvbnNvbGUpIHtcbiAgICAgICAgICAgICAgICBsb2dNZXNzYWdlVG9Db25zb2xlKFwib25FeHBhbmRJdGVtSGFuZGxlcjogY2FsbGVkIGZvciBpdGVtIFwiICsgaXRlbS5pbmRleCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBGaXJzdCBzZXQgdGhlIHN0YXRlIHNvIHRoZSB0cmVlIHJlbmRlcnMgdGhlIGV4cGFuZGVkIGl0ZW1cbiAgICAgICAgICAgIHNldEV4cGFuZGVkSXRlbXMoWy4uLmV4cGFuZGVkSXRlbXMsIGl0ZW0uaW5kZXhdKTtcblxuICAgICAgICAgICAgLy8gVGhlIGxpYnJhcnkgaGFzIGEgbWlzc2luZyBjaGlsZCBpdGVtIGNhbGxiYWNrIGJ1dCBpdCBkb2VzIG5vdCB3b3JrIHZlcnkgd2VsbC5cbiAgICAgICAgICAgIC8vIEl0ZW0gaW5kZWVkIGhhcyBjaGlsZHJlblxuICAgICAgICAgICAgaWYgKGl0ZW0uY2hpbGRyZW4gJiYgaXRlbS5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaXJzdENoaWxkSUQgPSBpdGVtLmNoaWxkcmVuWzBdO1xuICAgICAgICAgICAgICAgIC8vIFJlcXVlc3QgY2hpbGQgbm9kZXMgaWYgbm90IGFscmVhZHkgYXZhaWxhYmxlXG4gICAgICAgICAgICAgICAgaWYgKCF0cmVlRGF0YS5kYXRhW2ZpcnN0Q2hpbGRJRF0pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2FsbCBoYW5kbGVyIHdpdGggZXhwYW5kZWQgaXRlbSBJRCBhbmQgaXRzIGNoaWxkIElEc1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXF1ZXN0ZWRJRHMgPSBpdGVtLmluZGV4ICsgXCIsXCIgKyBpdGVtLmNoaWxkcmVuLmpvaW4oXCIsXCIpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobG9nVG9Db25zb2xlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dNZXNzYWdlVG9Db25zb2xlKFwib25FeHBhbmRJdGVtSGFuZGxlcjogcmVxdWVzdCBpdGVtcyBcIiArIHJlcXVlc3RlZElEcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgb25NaXNzaW5nTm9kZXMocmVxdWVzdGVkSURzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFtleHBhbmRlZEl0ZW1zLCBsb2dNZXNzYWdlVG9Db25zb2xlLCBsb2dUb0NvbnNvbGUsIG9uTWlzc2luZ05vZGVzLCB0cmVlRGF0YT8uZGF0YV1cbiAgICApO1xuXG4gICAgLy8g7LaV7IaMIOynhO2WiVxuICAgIGNvbnN0IG9uQ29sbGFwc2VBbGxCdXR0b25DbGljayA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICAgICAgc2V0RXhwYW5kZWRJdGVtcyhbXSk7IC8vIOy2leyGjCDsi5ztgqTri4jquZAg7ZmV7J6l65CY64qU6rG0IOyXhuycvOuLiCDruYgg67Cw7Je07J2YIOqwkuycvOuhnCDshKTsoJXsoJVcbiAgICB9LCBbXSk7XG5cbiAgICAvLyDtmZXsnqUg7KeE7ZaJXG4gICAgY29uc3Qgb25FeHBhbmRBbGxCdXR0b25DbGljayA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICAgICAgY29uc3QgZXhwYW5kYWJsZUl0ZW1JRHMgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBpdGVtSUQgaW4gdHJlZURhdGEuZGF0YSkge1xuXG4gICAgICAgICAgICBpZiAodHJlZURhdGEuZGF0YVtpdGVtSURdLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgZXhwYW5kYWJsZUl0ZW1JRHMucHVzaChpdGVtSUQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHNldEV4cGFuZGVkSXRlbXMoZXhwYW5kYWJsZUl0ZW1JRHMpO1xuICAgIH0sIFt0cmVlRGF0YT8uZGF0YV0pO1xuXG4gICAgLy8gdHJlZeyGjeyEseuCtCBub2Rl7J2YIOydtOumhCDshKTsoJVcbiAgICBjb25zdCBvblJlbmFtZU5vZGVIYW5kbGVyID0gdXNlQ2FsbGJhY2soXG4gICAgICAgIChpdGVtLCBuZXdOYW1lKSA9PiB7XG4gICAgICAgICAgICBvbk5vZGVSZW5hbWVkKGl0ZW0uaW5kZXgsIG5ld05hbWUpO1xuICAgICAgICB9LFxuICAgICAgICBbb25Ob2RlUmVuYW1lZF1cbiAgICApO1xuXG4gICAgLy8g66eI7Jqw7IqkIOuTnOuejeydtOuypO2KuFxuICAgIGNvbnN0IG9uRHJvcEhhbmRsZXIgPSB1c2VDYWxsYmFjayhcbiAgICAgICAgKGl0ZW1zLCB0YXJnZXQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGRyYWdnZWRJdGVtSURzID0gaXRlbXMucmVkdWNlKChhY2N1bXVsYXRvciwgaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChhY2N1bXVsYXRvcikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWNjdW11bGF0b3IgKyBcIixcIiArIGl0ZW0uaW5kZXg7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0uaW5kZXg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgbnVsbCk7XG4gICAgICAgICAgICBpZiAobG9nVG9Db25zb2xlKSB7XG4gICAgICAgICAgICAgICAgbG9nTWVzc2FnZVRvQ29uc29sZShcbiAgICAgICAgICAgICAgICAgICAgXCJvbkRyb3BIYW5kbGVyOiBpdGVtcyBcIiArIGRyYWdnZWRJdGVtSURzICsgXCIgZHJhZ2dlZCwgZHJvcCBpbmZvOiBcIiArIEpTT04uc3RyaW5naWZ5KHRhcmdldClcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb25Ecm9wKGRyYWdnZWRJdGVtSURzLCB0YXJnZXQpO1xuICAgICAgICB9LFxuICAgICAgICBbbG9nTWVzc2FnZVRvQ29uc29sZSwgbG9nVG9Db25zb2xlLCBvbkRyb3BdXG4gICAgKTtcblxuICAgIC8vIOuniOyasOyKpCDrk5zrnpjqt7gg7J2067Kk7Yq4IChyZXN1bHQgOiB0cnVlIHx8IGZhbHNlKVxuICAgIGNvbnN0IGNhbkRyYWdIYW5kbGVyID0gdXNlQ2FsbGJhY2soaXRlbXMgPT4ge1xuICAgICAgICBpZiAoIWl0ZW1zIHx8IGl0ZW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXRlbXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlbXNbMF0uY2FuTW92ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZpcnN0UGFyZW50SUQgPSBpdGVtc1swXS5kYXRhLnBhcmVudElEO1xuICAgICAgICByZXR1cm4gaXRlbXMuZXZlcnkoaXRlbSA9PiBpdGVtLmRhdGEucGFyZW50SUQgPT09IGZpcnN0UGFyZW50SUQgJiYgaXRlbS5jYW5Nb3ZlKTtcbiAgICB9LCBbXSk7XG5cbiAgICBjb25zdCBjYW5Ecm9wQXRIYW5kbGVyID0gdXNlQ2FsbGJhY2soXG4gICAgICAgIChpdGVtcywgdGFyZ2V0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXROb2RlSUQgPSB0YXJnZXQudGFyZ2V0VHlwZSA9PT0gXCJiZXR3ZWVuLWl0ZW1zXCIgPyB0YXJnZXQucGFyZW50SXRlbSA6IHRhcmdldC50YXJnZXRJdGVtO1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0Tm9kZSA9IHRyZWVEYXRhLmRhdGFbdGFyZ2V0Tm9kZUlEXTtcblxuICAgICAgICAgICAgLy8gVGFyZ2V0IGRvZXMgbm90IHNwZWNpZnkgYWNjZXB0ZWQgZHJhZyB0eXBlcyBzbyBhbnl0aGluZyBpcyBhbGxvd2VkXG4gICAgICAgICAgICBpZiAoIXRhcmdldE5vZGUuZGF0YS5hY2NlcHREcmFnVHlwZXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSXRlbSBjYW4gYmUgZHJvcHBlZCBhdCB0aGUgdGFyZ2V0IGlmIGl0IGhhcyBhIGRyYWcgdHlwZSBhbmQgdGhlIHRhcmdldCBhY2NlcHRzIGl0LlxuICAgICAgICAgICAgLy8gTm90ZSB0aGF0IHRoZSBpbmNsdWRlcyBmdW5jdGlvbiBpcyBjYXNlIHNlbnNpdGl2ZSFcbiAgICAgICAgICAgIC8vIEZvciBwZXJmb3JtYW5jZSwgbm8gY2FzZSBjb252ZXJzaW9uIGlzIGRvbmUsIHRoaXMgaXMgdXAgdG8gdGhlIGRldmVsb3BlciB0aGF0IHVzZXMgdGhpcyB3aWRnZXQuXG4gICAgICAgICAgICByZXR1cm4gaXRlbXMuZXZlcnkoXG4gICAgICAgICAgICAgICAgaXRlbSA9PiAhIWl0ZW0uZGF0YS5kcmFnVHlwZSAmJiB0YXJnZXROb2RlLmRhdGEuYWNjZXB0RHJhZ1R5cGVzLmluY2x1ZGVzKGl0ZW0uZGF0YS5kcmFnVHlwZSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0sXG4gICAgICAgIFt0cmVlRGF0YT8uZGF0YV1cbiAgICApO1xuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCLsnbTqsbAg7Ya16rO87ZWp64uI6rmMP1wiKVxuICAgICAgICBjb25zdCBwcm9jZXNzRGF0YUZyb21TZXJ2aWNlID0gZGF0YSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIuyVvCDsnbTqsbAg642w7J207YSw64OQP2RhdGFcIiwgZGF0YSlcbiAgICAgICAgICAgIGNvbnNvbGUuZGlyKFwi7JW8IOydtOqxsCDrjbDsnbTthLDrg5A/ZGF0YVwiLCBkYXRhKVxuICAgICAgICAgICAgLy9SZXNwb25zZU5vZGVz66W8IG5vZGVz66GcIOunpO2VkSBcbiAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGRhdGEuUmVzcG9uc2VOb2Rlcykge1xuICAgICAgICAgICAgICAgIGRhdGEubm9kZXMgPSBBcnJheS5pc0FycmF5KGRhdGEuUmVzcG9uc2VOb2RlcykgPyBkYXRhLlJlc3BvbnNlTm9kZXMgOiBcbiAgICAgICAgICAgICAgICAodHlwZW9mIGRhdGEuUmVzcG9uc2VOb2RlcyA9PT0gJ29iamVjdCcgPyBPYmplY3QudmFsdWVzKGRhdGEuUmVzcG9uc2VOb2RlcykgOiBbXSk7XG4gICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIOunpO2VkSDtm4Qg7ZmV7J24XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIuunpO2VkSDtm4Qgbm9kZXM6XCIsIGRhdGEubm9kZXMpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJub2Rlc+uKlCDrsLDsl7Q/XCIsIEFycmF5LmlzQXJyYXkoZGF0YS5ub2RlcykpO1xuICAgICAgICAgICAgY29uc3QgY3JlYXRlVHJlZURhdGFPYmplY3QgPSAoKSA9PiB7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWRhdGEgfHwgIWRhdGEubm9kZXMgfHwgIUFycmF5LmlzQXJyYXkoZGF0YS5ub2Rlcykpe1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiZGF0YS5ub2Rlc+qwgCDrsLDsl7TsnbQg7JWE64uZ64uI64ukLiBcIixkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1RyZWVEYXRhID0ge307XG5cbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IG5vZGUgb2YgZGF0YS5ub2Rlcykge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5vZGVzXCIsbm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZGlyKFwibm9kZVwiLG5vZGUpXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBjb25zdCBub2RlRGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4OiBub2RlLmluZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNGb2xkZXI6ICEhbm9kZS5jaGlsZHJlbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbk1vdmU6IG5vZGUuY2FuTW92ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhblJlbmFtZTogbm9kZS5jYW5SZW5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogbm9kZS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudElEOiBub2RlLnBhcmVudElEXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIC8vIENvbnZlcnQgY2hpbGRyZW4gZnJvbSBjb21tYSBzZXBhcmF0ZWQgdmFsdWUgaW50byBhcnJheVxuICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5jaGlsZHJlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZURhdGEuY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuLnNwbGl0KFwiLFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBPbmx5IGluY2x1ZGUgdGhlIGRyYWcvZHJvcCBzZXR0aW5ncyBpZiB0aGV5IGFyZSBzZXQuIEtlZXBzIG5vZGUgZGF0YSBvYmplY3QgYXMgc21hbGwgYXMgcG9zc2libGVcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUuZHJhZ1R5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVEYXRhLmRhdGEuZHJhZ1R5cGUgPSBub2RlLmRyYWdUeXBlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChub2RlLmFjY2VwdERyYWdUeXBlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZURhdGEuZGF0YS5hY2NlcHREcmFnVHlwZXMgPSBub2RlLmFjY2VwdERyYWdUeXBlcztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBuZXdUcmVlRGF0YVtub2RlLmluZGV4XSA9IG5vZGVEYXRhO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIuyVvCDsnbTqsbAg7IOI66Gc7Jq0IO2KuOumrOuDkD9cIixuZXdUcmVlRGF0YSlcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3VHJlZURhdGE7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCByZWxvYWRUcmVlID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1RyZWVEYXRhID0gY3JlYXRlVHJlZURhdGFPYmplY3QoKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIuyVvCDrgpjsmYDrnbwgbmV3VHJlZURhdGFcIixuZXdUcmVlRGF0YSlcbiAgICAgICAgICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwicmVsb2FkXCIsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IG5ld1RyZWVEYXRhXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCB1cGRhdGVUcmVlID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1RyZWVEYXRhID0gY3JlYXRlVHJlZURhdGFPYmplY3QoKTtcbiAgICAgICAgICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwidXBkYXRlXCIsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IG5ld1RyZWVEYXRhLFxuICAgICAgICAgICAgICAgICAgICBkZWxldGVkTm9kZUlEczogZGF0YS5kZWxldGVkTm9kZUlEc1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKGxvZ1RvQ29uc29sZSkge1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLm5vZGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvZ01lc3NhZ2VUb0NvbnNvbGUoXCJSZWNlaXZlZCBcIiArIGRhdGEubm9kZXMubGVuZ3RoICsgXCIgbm9kZXMsIGFjdGlvbjogXCIgKyBkYXRhLmFjdGlvbik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nTWVzc2FnZVRvQ29uc29sZShcIlJlY2VpdmVkIG5vIG5vZGVzLCBhY3Rpb246IFwiICsgZGF0YS5hY3Rpb24pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZHVtcFNlcnZpY2VSZXNwb25zZUluQ29uc29sZSkge1xuICAgICAgICAgICAgICAgICAgICBsb2dNZXNzYWdlVG9Db25zb2xlKFwiUmVjZWl2ZWQgc2VydmljZSByZXNwb25zZTpcIik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuaW5mbyhKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3dpdGNoIChkYXRhLmFjdGlvbikge1xuICAgICAgICAgICAgICAgIGNhc2UgXCJyZWxvYWRcIjpcbiAgICAgICAgICAgICAgICAgICAgcmVsb2FkVHJlZShkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIFwidXBkYXRlXCI6XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVRyZWUoZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSBcImZvY3VzXCI6XG4gICAgICAgICAgICAgICAgICAgIC8vIE5vIHNwZWNpZmljIGxvZ2ljLCBmb2N1cyBpcyBoYW5kbGVkIHdoZW5ldmVyIHRoZSBmb2N1c05vZGVJRCBpcyByZXR1cm5lZC4gRm9jdXMgYWN0aW9uIGlzIGFkZGVkIHRvIGFsbG93IHNldHRpbmcgZm9jdXMgb25seS5cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIFwibm9uZVwiOlxuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIiBSZWFjdCBjb21wbGV4IHRyZWUgdW5rbm93biBhY3Rpb246IFwiICsgZGF0YS5hY3Rpb24pO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEZvY3VzIGFuZCBzZWxlY3QgaXRlbSBpZiByZXF1ZXN0ZWQuXG4gICAgICAgICAgICBpZiAoZGF0YS5mb2N1c05vZGVJRCkge1xuICAgICAgICAgICAgICAgIGlmIChsb2dUb0NvbnNvbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nTWVzc2FnZVRvQ29uc29sZShcIlNldCBmb2N1cyB0byBcIiArIGRhdGEuZm9jdXNOb2RlSUQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZXRGb2N1c2VkSXRlbShkYXRhLmZvY3VzTm9kZUlEKTtcbiAgICAgICAgICAgICAgICBzZXRTZWxlY3RlZEl0ZW1zKFtkYXRhLmZvY3VzTm9kZUlEXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEV4cGFuZCBpdGVtcyBpZiByZXF1ZXN0ZWQuXG4gICAgICAgICAgICBpZiAoZGF0YS5leHBhbmRJdGVtSURzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXhwYW5kSXRlbUlEQXJyYXkgPSBkYXRhLmV4cGFuZEl0ZW1JRHMuc3BsaXQoXCIsXCIpO1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLnJlc2V0RXhwYW5kZWRJdGVtcykge1xuICAgICAgICAgICAgICAgICAgICAvLyBPbmx5IGV4cGFuZCB0aGUgcmVxdWVzdGVkIGl0ZW1zXG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2dUb0NvbnNvbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ01lc3NhZ2VUb0NvbnNvbGUoXCJFeHBhbmQgb25seSBpdGVtcyBcIiArIGRhdGEuZXhwYW5kSXRlbUlEcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc2V0RXhwYW5kZWRJdGVtcyhleHBhbmRJdGVtSURBcnJheSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRXhwYW5kIHRoZSByZXF1ZXN0ZWQgaXRlbXMgaW4gYWRkaXRpb24gdG8gYW55IGFscmVhZHkgZXhwYW5kZWQgaXRlbXNcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvZ1RvQ29uc29sZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nTWVzc2FnZVRvQ29uc29sZShcIkV4cGFuZCBpdGVtcyBcIiArIGRhdGEuZXhwYW5kSXRlbUlEcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc2V0RXhwYW5kZWRJdGVtcyhbLi4uZXhwYW5kZWRJdGVtcywgLi4uZXhwYW5kSXRlbUlEQXJyYXldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLnJlc2V0RXhwYW5kZWRJdGVtcykge1xuICAgICAgICAgICAgICAgICAgICAvLyBDbGVhciBleHBhbmRlZCBzdGF0ZSwgY2F1c2luZyBhbGwgbm9kZXMgdG8gYmUgY29sbGFwc2VkXG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2dUb0NvbnNvbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ01lc3NhZ2VUb0NvbnNvbGUoXCJSZXNldCBleHBhbmRlZCBzdGF0ZSwgY29sbGFwc2UgYWxsIG5vZGVzXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHNldEV4cGFuZGVkSXRlbXMoW10pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoZGF0YUNoYW5nZWREYXRlKSB7XG4gICAgICAgICAgICBpZiAobG9nVG9Db25zb2xlKSB7XG4gICAgICAgICAgICAgICAgbG9nTWVzc2FnZVRvQ29uc29sZShcIkRhdGEgY2hhbmdlZCBkYXRlOiBcIiArIGRhdGFDaGFuZ2VkRGF0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAobG9nVG9Db25zb2xlKSB7XG4gICAgICAgICAgICAgICAgbG9nTWVzc2FnZVRvQ29uc29sZShcIkRhdGEgY2hhbmdlZCBkYXRlIG5vdCBzZXRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBFdmVuIHRob3VnaCB0aGUgZGVwZW5kZW5jaWVzIGRpZCBub3QgY2hhbmdlLCB0aGUgZWZmZWN0IGdvdCBjYWxsZWQgd2F5IHRvbyBvZnRlbi5cbiAgICAgICAgLy8gRG91YmxlIGNoZWNrZWQgYnkgbG9nZ2luZyB0aGUgZGVwZW5kZW5jaWVzIGFuZCBjb21wYXJpbmcgdGhlbSBhcyBtZW50aW9uZWQgaW4gdGhlIFJlYWN0IHVzZUVmZmVjdCBkb2N1bWVudGF0aW9uLlxuICAgICAgICAvLyBLZWVwIHRyYWNrIG9mIGRhdGFDaGFuZ2VkRGF0ZSBpbiB0aGUgcmVkdWNlciBhbmQgb25seSBjYWxsIHRoZSBzZXJ2aWNlIGlmIHRoZSBkYXRlIHJlYWxseSBpcyBkaWZmZXJlbnQuXG4gICAgICAgIGlmIChkYXRhQ2hhbmdlZERhdGUuZ2V0VGltZSgpID09PSB0cmVlRGF0YT8uZGF0YUNoYW5nZWREYXRlLmdldFRpbWUoKSkge1xuICAgICAgICAgICAgaWYgKGxvZ1RvQ29uc29sZSkge1xuICAgICAgICAgICAgICAgIGxvZ01lc3NhZ2VUb0NvbnNvbGUoXCJEYXRhIGNoYW5nZWQgZGF0ZSBzdGlsbCB0aGUgc2FtZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAobG9nVG9Db25zb2xlKSB7XG4gICAgICAgICAgICBsb2dNZXNzYWdlVG9Db25zb2xlKFwiRGF0YSBjaGFuZ2VkIGRhdGUgY2hhbmdlZFwiKTtcbiAgICAgICAgfVxuICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgICB0eXBlOiBcInNldERhdGFDaGFuZ2VkRGF0ZVwiLFxuICAgICAgICAgICAgZGF0YUNoYW5nZWREYXRlOiBkYXRhQ2hhbmdlZERhdGVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IHNlcnZpY2VVcmxMb2NhbCA9IHNlcnZpY2VVcmw7XG4gICAgICAgIGlmIChzZXJ2aWNlVXJsTG9jYWwpIHtcbiAgICAgICAgICAgIGlmICghdHJlZURhdGE/LmRhdGEpIHtcblxuICAgICAgICAgICAgICAgIGlmIChsb2dUb0NvbnNvbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nTWVzc2FnZVRvQ29uc29sZShcIk5vIHRyZWUgZGF0YSwgcmVxdWVzdCBmdWxsIHJlbG9hZFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHNlcnZpY2VVcmxMb2NhbC5pbmNsdWRlcyhcIj9cIikpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VydmljZVVybExvY2FsICs9IFwiJlwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNlcnZpY2VVcmxMb2NhbCArPSBcIj9cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2VydmljZVVybExvY2FsICs9IFwiZnVsbHJlbG9hZD10cnVlXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobG9nVG9Db25zb2xlKSB7XG4gICAgICAgICAgICAgICAgbG9nTWVzc2FnZVRvQ29uc29sZShcIkNhbGwgc2VydmljZSB1c2luZyBVUkw6IFwiICsgc2VydmljZVVybExvY2FsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChsb2dUb0NvbnNvbGUpIHtcbiAgICAgICAgICAgICAgICBsb2dNZXNzYWdlVG9Db25zb2xlKFwiU2VydmljZSBVUkwgaGFzIG5vIHZhbHVlXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKFwi7JW8IOuvuOy5nOyduOqwhOyVhCDsnbTroIfqsowg7IK06rGw7JW8P1wiLCB3aW5kb3cubXguc2Vzc2lvbilcbiAgICAgICAgY29uc3QgdG9rZW4gPSB3aW5kb3cubXguc2Vzc2lvbi5nZXRDb25maWcoXCJjc3JmdG9rZW5cIik7XG4gICAgICAgIGNvbnNvbGUubG9nKFwidG9rZW5cIiwgdG9rZW4pXG4gICAgICAgIHdpbmRvd1xuICAgICAgICAgICAgLmZldGNoKHNlcnZpY2VVcmxMb2NhbCwge1xuICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcImluY2x1ZGVcIixcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiWC1Dc3JmLVRva2VuXCI6IHRva2VuLFxuICAgICAgICAgICAgICAgICAgICBBY2NlcHQ6IFwiYXBwbGljYXRpb24vanNvblwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInJlc3BvbnNlIOydtOqxsCDtmZXsnbjtlZzri6Qg7KGw7Ius7ZW06528XCIpXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLmpzb24oKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCLsnbTqsbAg7Ya16rO87ZWp64uI6rmMPyByZXNwb25zZeuDkFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzc0RhdGFGcm9tU2VydmljZShkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY3JlYXRlVHJlZURhdGFPYmplY3Tsl5Ag7KCE64us65CcIOuNsOydtO2EsDpcIiwgSlNPTi5zdHJpbmdpZnkoZGF0YSwgbnVsbCwgMikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJkYXRhXCIsIGRhdGEpXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkNhbGwgdG8gVVJMIFwiICsgc2VydmljZVVybExvY2FsICsgXCIgZmFpbGVkOiBcIiArIHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgIH0sIFtcbiAgICAgICAgZGF0YUNoYW5nZWREYXRlLFxuICAgICAgICBzZXJ2aWNlVXJsLFxuICAgICAgICBsb2dNZXNzYWdlVG9Db25zb2xlLFxuICAgICAgICBsb2dUb0NvbnNvbGUsXG4gICAgICAgIGR1bXBTZXJ2aWNlUmVzcG9uc2VJbkNvbnNvbGUsXG4gICAgICAgIHRyZWVEYXRhLFxuICAgICAgICBleHBhbmRlZEl0ZW1zXG4gICAgXSk7XG5cbiAgICBjb25zdCBjbGFzc05hbWUgPSBcInJlYWN0LWNvbXBsZXgtdHJlZS13aWRnZXQgXCIgKyB3aWRnZXRDbGFzc05hbWU7XG5cbiAgICBpZiAoIXRyZWVEYXRhPy5kYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwi7Yq466as642w7J207YSwIO2GteqzvOyXrOu2gCDtmZXsnbjspJHsnoXri4jri6RcIilcbiAgICAgICAgaWYgKGxvZ1RvQ29uc29sZSkge1xuICAgICAgICAgICAgbG9nTWVzc2FnZVRvQ29uc29sZShcIk5vIHRyZWUgZGF0YVwiKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhcImNsYXNzTmFtZVwiLGNsYXNzTmFtZSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiIXRyZWVEYXRhPy5kYXRhXCIsIXRyZWVEYXRhPy5kYXRhKTtcbiAgICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPXtjbGFzc05hbWUgKyBcIiBub2RhdGFcIn0+PC9kaXY+O1xuICAgIH1cblxuICAgIGNvbnN0IHRyZWVOYW1lID0gXCJ0cmVlLVwiICsgd2lkZ2V0TmFtZTtcbiAgICBjb25zdCBpbnRlcmFjdGlvbk1vZGUgPSB0b2dnbGVFeHBhbmRlZEljb25Pbmx5ID8gXCJjbGljay1hcnJvdy10by1leHBhbmRcIiA6IFwiY2xpY2staXRlbS10by1leHBhbmRcIjtcblxuICAgIGNvbnNvbGUubG9nKFwi7Yq466asIOuNsOydtO2EsCBDSElMRCDsnbTrpoRcIiwgdHJlZU5hbWUpXG4gICAgY29uc29sZS5sb2coXCLtirjrpqwg642w7J207YSwIENISUxEIOqwklwiLCB0cmVlRGF0YT8uZGF0YSlcbiAgICBcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NOYW1lfT5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHJlZS13aWRnZXQtYnV0dG9uLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJidXR0b25Db2xsYXBzZUFsbFwiIGNsYXNzTmFtZT17Y29sbGFwc2VBbGxCdXR0b25DbGFzc30gb25DbGljaz17b25Db2xsYXBzZUFsbEJ1dHRvbkNsaWNrfT5cbiAgICAgICAgICAgICAgICAgICAge2NvbGxhcHNlQWxsQnV0dG9uSWNvbiAmJiA8SWNvbiBpY29uPXtjb2xsYXBzZUFsbEJ1dHRvbkljb259IC8+fVxuICAgICAgICAgICAgICAgICAgICA8c3Bhbj57Y29sbGFwc2VBbGxCdXR0b25DYXB0aW9uID8gY29sbGFwc2VBbGxCdXR0b25DYXB0aW9uIDogXCJcIn08L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAge3Nob3dFeHBhbmRBbGxCdXR0b24gJiYgKFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwiYnV0dG9uRXhwYW5kQWxsXCIgY2xhc3NOYW1lPXtleHBhbmRBbGxCdXR0b25DbGFzc30gb25DbGljaz17b25FeHBhbmRBbGxCdXR0b25DbGlja30+XG4gICAgICAgICAgICAgICAgICAgICAgICB7ZXhwYW5kQWxsQnV0dG9uSWNvbiAmJiA8SWNvbiBpY29uPXtleHBhbmRBbGxCdXR0b25JY29ufSAvPn1cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPntleHBhbmRBbGxCdXR0b25DYXB0aW9uID8gZXhwYW5kQWxsQnV0dG9uQ2FwdGlvbiA6IFwiXCJ9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8Q29udHJvbGxlZFRyZWVFbnZpcm9ubWVudFxuICAgICAgICAgICAgICAgIGl0ZW1zPXt0cmVlRGF0YS5kYXRhfVxuICAgICAgICAgICAgICAgIGdldEl0ZW1UaXRsZT17cmVuZGVySXRlbVRpdGxlfVxuICAgICAgICAgICAgICAgIC8vIHtpdGVtID0+IGl0ZW0uZGF0YS5uYW1lfVxuICAgICAgICAgICAgICAgIHZpZXdTdGF0ZT17e1xuICAgICAgICAgICAgICAgICAgICBbdHJlZU5hbWVdOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb2N1c2VkSXRlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4cGFuZGVkSXRlbXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZEl0ZW1zXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgIGRlZmF1bHRJbnRlcmFjdGlvbk1vZGU9e2ludGVyYWN0aW9uTW9kZX1cbiAgICAgICAgICAgICAgICBjYW5SZW5hbWU9e2FsbG93Tm9kZVJlbmFtZX1cbiAgICAgICAgICAgICAgICBjYW5EcmFnQW5kRHJvcD17YWxsb3dEcmFnUmVvcmRlcmluZyB8fCBhbGxvd0RyYWdNb3ZlfVxuICAgICAgICAgICAgICAgIGNhblJlb3JkZXJJdGVtcz17YWxsb3dEcmFnUmVvcmRlcmluZ31cbiAgICAgICAgICAgICAgICBjYW5Ecm9wT25Gb2xkZXI9e2FsbG93RHJhZ01vdmV9XG4gICAgICAgICAgICAgICAgY2FuRHJvcE9uTm9uRm9sZGVyPXthbGxvd0RyYWdNb3ZlfVxuICAgICAgICAgICAgICAgIG9uRm9jdXNJdGVtPXtpdGVtID0+IHNldEZvY3VzZWRJdGVtKGl0ZW0uaW5kZXgpfVxuICAgICAgICAgICAgICAgIG9uRXhwYW5kSXRlbT17b25FeHBhbmRJdGVtSGFuZGxlcn1cbiAgICAgICAgICAgICAgICBvbkNvbGxhcHNlSXRlbT17aXRlbSA9PlxuICAgICAgICAgICAgICAgICAgICBzZXRFeHBhbmRlZEl0ZW1zKGV4cGFuZGVkSXRlbXMuZmlsdGVyKGV4cGFuZGVkSXRlbUluZGV4ID0+IGV4cGFuZGVkSXRlbUluZGV4ICE9PSBpdGVtLmluZGV4KSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgb25TZWxlY3RJdGVtcz17b25TZWxlY3Rpb25DaGFuZ2VkSGFuZGxlcn1cbiAgICAgICAgICAgICAgICBvblJlbmFtZUl0ZW09e29uUmVuYW1lTm9kZUhhbmRsZXJ9XG4gICAgICAgICAgICAgICAgY2FuRHJhZz17Y2FuRHJhZ0hhbmRsZXJ9XG4gICAgICAgICAgICAgICAgY2FuRHJvcEF0PXtjYW5Ecm9wQXRIYW5kbGVyfVxuICAgICAgICAgICAgICAgIG9uRHJvcD17b25Ecm9wSGFuZGxlcn1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8VHJlZSB0cmVlSWQ9e3RyZWVOYW1lfSByb290SXRlbT1cInJvb3RcIiAvPlxuICAgICAgICAgICAgPC9Db250cm9sbGVkVHJlZUVudmlyb25tZW50PlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tdHJhaWxpbmctc3BhY2VzICovXG4vKiBlc2xpbnQtZGlzYWJsZSBwcmV0dGllci9wcmV0dGllciAqL1xuaW1wb3J0IHsgY3JlYXRlRWxlbWVudCwgdXNlQ2FsbGJhY2sgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IFRyZWVDb250YWluZXIgfSBmcm9tIFwiLi9jb21wb25lbnRzL1RyZWVDb250YWluZXJcIjtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHNvcnQtaW1wb3J0c1xuaW1wb3J0IFwicmVhY3QtY29tcGxleC10cmVlL2xpYi9zdHlsZS1tb2Rlcm4uY3NzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFjdENvbXBsZXhUcmVlV2lkZ2V0KHByb3BzKSB7XG4gICAgY29uc3QgbG9nTWVzc2FnZVRvQ29uc29sZSA9IHVzZUNhbGxiYWNrKFxuICAgICAgICBtZXNzYWdlID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbyhwcm9wcy5uYW1lICsgXCIgXCIgKyBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkgKyBcIiBcIiArIG1lc3NhZ2UpO1xuICAgICAgICB9LFxuICAgICAgICBbcHJvcHMubmFtZV1cbiAgICApO1xuXG4gICAgY29uc3QgeyBvblNlbGVjdGlvbkNoYW5nZWRBY3Rpb24sIHNlbGVjdGVkTm9kZUlEc0F0dHIgfSA9IHByb3BzO1xuXG4gICAgY29uc3Qgb25TZWxlY3Rpb25DaGFuZ2VkSGFuZGxlciA9IHVzZUNhbGxiYWNrKFxuICAgICAgICBzZWxlY3RlZEl0ZW1JRHMgPT4ge1xuICAgICAgICAgICAgaWYgKHNlbGVjdGVkTm9kZUlEc0F0dHIgJiYgc2VsZWN0ZWROb2RlSURzQXR0ci5zdGF0dXMgPT09IFwiYXZhaWxhYmxlXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWROb2RlSURzQXR0ci5yZWFkT25seSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJSZWFjdENvbXBsZXhUcmVlV2lkZ2V0OiBTZWxlY3RlZCBub2RlIElEcyBhdHRyaWJ1dGUgaXMgcmVhZG9ubHlcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWROb2RlSURzQXR0ci5zZXRWYWx1ZShzZWxlY3RlZEl0ZW1JRHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBvblNlbGVjdGlvbkNoYW5nZWRBY3Rpb24gJiZcbiAgICAgICAgICAgICAgICBvblNlbGVjdGlvbkNoYW5nZWRBY3Rpb24uY2FuRXhlY3V0ZSAmJlxuICAgICAgICAgICAgICAgICFvblNlbGVjdGlvbkNoYW5nZWRBY3Rpb24uaXNFeGVjdXRpbmdcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIG9uU2VsZWN0aW9uQ2hhbmdlZEFjdGlvbi5leGVjdXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFtvblNlbGVjdGlvbkNoYW5nZWRBY3Rpb24sIHNlbGVjdGVkTm9kZUlEc0F0dHJdXG4gICAgKTtcblxuICAgIGNvbnN0IHsgb25NaXNzaW5nTm9kZXNBY3Rpb24sIG1pc3NpbmdOb2RlSURzQXR0ciB9ID0gcHJvcHM7XG5cbiAgICBjb25zdCBvbk1pc3NpbmdOb2Rlc0hhbmRsZXIgPSB1c2VDYWxsYmFjayhcbiAgICAgICAgbWlzc2luZ0l0ZW1JRHMgPT4ge1xuICAgICAgICAgICAgaWYgKG1pc3NpbmdOb2RlSURzQXR0ciAmJiBtaXNzaW5nTm9kZUlEc0F0dHIuc3RhdHVzID09PSBcImF2YWlsYWJsZVwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKG1pc3NpbmdOb2RlSURzQXR0ci5yZWFkT25seSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJSZWFjdENvbXBsZXhUcmVlV2lkZ2V0OiBNaXNzaW5nIG5vZGUgSURzIGF0dHJpYnV0ZSBpcyByZWFkb25seVwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBtaXNzaW5nTm9kZUlEc0F0dHIuc2V0VmFsdWUobWlzc2luZ0l0ZW1JRHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvbk1pc3NpbmdOb2Rlc0FjdGlvbiAmJiBvbk1pc3NpbmdOb2Rlc0FjdGlvbi5jYW5FeGVjdXRlICYmICFvbk1pc3NpbmdOb2Rlc0FjdGlvbi5pc0V4ZWN1dGluZykge1xuICAgICAgICAgICAgICAgIG9uTWlzc2luZ05vZGVzQWN0aW9uLmV4ZWN1dGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgW21pc3NpbmdOb2RlSURzQXR0ciwgb25NaXNzaW5nTm9kZXNBY3Rpb25dXG4gICAgKTtcblxuICAgIGNvbnN0IHsgb25Ob2RlUmVuYW1lZEFjdGlvbiwgcmVuYW1lZE5vZGVJREF0dHIsIG5ld05vZGVOYW1lQXR0ciB9ID0gcHJvcHM7XG5cbiAgICBjb25zdCBvbk5vZGVSZW5hbWVkSGFuZGxlciA9IHVzZUNhbGxiYWNrKFxuICAgICAgICAobm9kZUlELCBuZXdOYW1lKSA9PiB7XG4gICAgICAgICAgICBpZiAocmVuYW1lZE5vZGVJREF0dHIgJiYgcmVuYW1lZE5vZGVJREF0dHIuc3RhdHVzID09PSBcImF2YWlsYWJsZVwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlbmFtZWROb2RlSURBdHRyLnJlYWRPbmx5KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIlJlYWN0Q29tcGxleFRyZWVXaWRnZXQ6IEV2ZW50IG5vZGUgSUQgYXR0cmlidXRlIGlzIHJlYWRvbmx5XCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlbmFtZWROb2RlSURBdHRyLnNldFZhbHVlKG5vZGVJRCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5ld05vZGVOYW1lQXR0ciAmJiBuZXdOb2RlTmFtZUF0dHIuc3RhdHVzID09PSBcImF2YWlsYWJsZVwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5ld05vZGVOYW1lQXR0ci5yZWFkT25seSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJSZWFjdENvbXBsZXhUcmVlV2lkZ2V0OiBFdmVudCBub2RlIElEIGF0dHJpYnV0ZSBpcyByZWFkb25seVwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBuZXdOb2RlTmFtZUF0dHIuc2V0VmFsdWUobmV3TmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAob25Ob2RlUmVuYW1lZEFjdGlvbiAmJiBvbk5vZGVSZW5hbWVkQWN0aW9uLmNhbkV4ZWN1dGUgJiYgIW9uTm9kZVJlbmFtZWRBY3Rpb24uaXNFeGVjdXRpbmcpIHtcbiAgICAgICAgICAgICAgICBvbk5vZGVSZW5hbWVkQWN0aW9uLmV4ZWN1dGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgW3JlbmFtZWROb2RlSURBdHRyLCBuZXdOb2RlTmFtZUF0dHIsIG9uTm9kZVJlbmFtZWRBY3Rpb25dXG4gICAgKTtcbiAgICAvLyDrk5zrnpjqt7gg7JWkIOuTnOuejVxuICAgIGNvbnN0IHsgb25Ecm9wQWN0aW9uLCBkcmFnZ2VkTm9kZUlEc0F0dHIsIGRyb3BUYXJnZXRBdHRyIH0gPSBwcm9wcztcblxuICAgIGNvbnN0IG9uRHJvcEhhbmRsZXIgPSB1c2VDYWxsYmFjayhcbiAgICAgICAgKGRyb3BwZWROb2RlSURzLCB0YXJnZXQpID0+IHtcbiAgICAgICAgICAgIGlmIChkcmFnZ2VkTm9kZUlEc0F0dHIgJiYgZHJhZ2dlZE5vZGVJRHNBdHRyLnN0YXR1cyA9PT0gXCJhdmFpbGFibGVcIikge1xuICAgICAgICAgICAgICAgIGlmIChkcmFnZ2VkTm9kZUlEc0F0dHIucmVhZE9ubHkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiUmVhY3RDb21wbGV4VHJlZVdpZGdldDogRHJhZ2dlZCBub2RlIElEcyBhdHRyaWJ1dGUgaXMgcmVhZG9ubHlcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZHJhZ2dlZE5vZGVJRHNBdHRyLnNldFZhbHVlKGRyb3BwZWROb2RlSURzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZHJvcFRhcmdldEF0dHIgJiYgZHJvcFRhcmdldEF0dHIuc3RhdHVzID09PSBcImF2YWlsYWJsZVwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRyb3BUYXJnZXRBdHRyLnJlYWRPbmx5KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIlJlYWN0Q29tcGxleFRyZWVXaWRnZXQ6IERyb3AgdGFyZ2V0IElEIGF0dHJpYnV0ZSBpcyByZWFkb25seVwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkcm9wVGFyZ2V0QXR0ci5zZXRWYWx1ZShKU09OLnN0cmluZ2lmeSh0YXJnZXQpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob25Ecm9wQWN0aW9uICYmIG9uRHJvcEFjdGlvbi5jYW5FeGVjdXRlICYmICFvbkRyb3BBY3Rpb24uaXNFeGVjdXRpbmcpIHtcbiAgICAgICAgICAgICAgICBvbkRyb3BBY3Rpb24uZXhlY3V0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBbZHJhZ2dlZE5vZGVJRHNBdHRyLCBkcm9wVGFyZ2V0QXR0ciwgb25Ecm9wQWN0aW9uXVxuICAgICk7XG4gIFxuICAgIGNvbnNvbGUubG9nKFwi7J206rG0IO2FjOyKpO2KuCDsnoXri4jri6QuIOyasOuRkOuouOumrFwiLCBwcm9wcylcbiAgICBjb25zb2xlLmxvZyhcIuydtOqxtCDthYzsiqTtirgg7J6F64uI64ukLiDsnbTrpoRcIiwgcHJvcHMubmFtZSlcbiAgICBjb25zb2xlLmxvZyhcIuydtOqxtCDthYzsiqTtirgg7J6F64uI64ukLiDrs4Dqsr3rkJjripQg642w7J207YSwXCIsIHByb3BzLmRhdGFDaGFuZ2VEYXRlQXR0cilcbiAgICBjb25zb2xlLmxvZyhcIuydtOqxtCDthYzsiqTtirgg7J6F64uI64ukLiDrk5zrnpjqt7gg7JuA7KeB7J6EXCIsIHByb3BzLmFsbG93RHJhZ01vdmUpXG4gICAgY29uc29sZS5sb2coXCLsnbTqsbQg7YWM7Iqk7Yq4IOyeheuLiOuLpC4g7JWE7J207L2YIO2GoOq4gCDtgbTrpq3rpq1cIiwgcHJvcHMudG9nZ2xlRXhwYW5kZWRJY29uT25seSlcbiAgICBcbiAgICByZXR1cm4gKFxuICAgICAgICA8VHJlZUNvbnRhaW5lclxuICAgICAgICAgICAgZGF0YUNoYW5nZWREYXRlPXtwcm9wcy5kYXRhQ2hhbmdlRGF0ZUF0dHIudmFsdWV9XG4gICAgICAgICAgICBzZXJ2aWNlVXJsPXtwcm9wcy5zZXJ2aWNlVXJsLnZhbHVlfVxuICAgICAgICAgICAgd2lkZ2V0TmFtZT17cHJvcHMubmFtZX1cbiAgICAgICAgICAgIHdpZGdldENsYXNzTmFtZT17cHJvcHMuY2xhc3N9XG4gICAgICAgICAgICB0b2dnbGVFeHBhbmRlZEljb25Pbmx5PXtwcm9wcy50b2dnbGVFeHBhbmRlZEljb25Pbmx5fVxuICAgICAgICAgICAgYWxsb3dOb2RlUmVuYW1lPXtwcm9wcy5hbGxvd05vZGVSZW5hbWV9XG4gICAgICAgICAgICBhbGxvd0RyYWdSZW9yZGVyaW5nPXtwcm9wcy5hbGxvd0RyYWdSZW9yZGVyaW5nfVxuICAgICAgICAgICAgYWxsb3dEcmFnTW92ZT17cHJvcHMuYWxsb3dEcmFnTW92ZX1cbiAgICAgICAgICAgIGNvbGxhcHNlQWxsQnV0dG9uSWNvbj17cHJvcHMuY29sbGFwc2VBbGxCdXR0b25JY29uPy52YWx1ZX1cbiAgICAgICAgICAgIGNvbGxhcHNlQWxsQnV0dG9uQ2FwdGlvbj17cHJvcHMuY29sbGFwc2VBbGxCdXR0b25DYXB0aW9uPy52YWx1ZX1cbiAgICAgICAgICAgIGNvbGxhcHNlQWxsQnV0dG9uQ2xhc3M9e3Byb3BzLmNvbGxhcHNlQWxsQnV0dG9uQ2xhc3N9XG4gICAgICAgICAgICBzaG93RXhwYW5kQWxsQnV0dG9uPXshIXByb3BzLnNob3dFeHBhbmRBbGxCdXR0b24/LnZhbHVlfVxuICAgICAgICAgICAgZXhwYW5kQWxsQnV0dG9uSWNvbj17cHJvcHMuZXhwYW5kQWxsQnV0dG9uSWNvbj8udmFsdWV9XG4gICAgICAgICAgICBleHBhbmRBbGxCdXR0b25DYXB0aW9uPXtwcm9wcy5leHBhbmRBbGxCdXR0b25DYXB0aW9uPy52YWx1ZX1cbiAgICAgICAgICAgIGV4cGFuZEFsbEJ1dHRvbkNsYXNzPXtwcm9wcy5leHBhbmRBbGxCdXR0b25DbGFzc31cbiAgICAgICAgICAgIG9uU2VsZWN0aW9uQ2hhbmdlZD17b25TZWxlY3Rpb25DaGFuZ2VkSGFuZGxlcn1cbiAgICAgICAgICAgIG9uTWlzc2luZ05vZGVzPXtvbk1pc3NpbmdOb2Rlc0hhbmRsZXJ9XG4gICAgICAgICAgICBvbk5vZGVSZW5hbWVkPXtvbk5vZGVSZW5hbWVkSGFuZGxlcn1cbiAgICAgICAgICAgIG9uRHJvcD17b25Ecm9wSGFuZGxlcn1cbiAgICAgICAgICAgIGxvZ01lc3NhZ2VUb0NvbnNvbGU9e2xvZ01lc3NhZ2VUb0NvbnNvbGV9XG4gICAgICAgICAgICBsb2dUb0NvbnNvbGU9e3Byb3BzLmxvZ1RvQ29uc29sZX1cbiAgICAgICAgICAgIGR1bXBTZXJ2aWNlUmVzcG9uc2VJbkNvbnNvbGU9e3Byb3BzLmR1bXBTZXJ2aWNlUmVzcG9uc2VJbkNvbnNvbGV9XG4gICAgICAgIC8+XG4gICAgKTtcbn1cbiJdLCJuYW1lcyI6WyJJbnRlcmFjdGlvbk1vZGUiLCJfX2Fzc2lnbiIsInRoaXMiLCJPYmplY3QiLCJhc3NpZ24iLCJ0IiwicyIsImkiLCJuIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwicCIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwiY2FsbCIsImFwcGx5IiwibWVyZ2VJbnRlcmFjdGlvbk1hbmFnZXJzIiwibWFpbiIsImZhbGxiYWNrIiwibW9kZSIsImNyZWF0ZUludGVyYWN0aXZlRWxlbWVudFByb3BzIiwiaXRlbSIsInRyZWVJZCIsImFjdGlvbnMiLCJyZW5kZXJGbGFncyIsImlzQ29udHJvbEtleSIsImUiLCJjdHJsS2V5IiwibmF2aWdhdG9yIiwicGxhdGZvcm0iLCJ0b1VwcGVyQ2FzZSIsImluZGV4T2YiLCJtZXRhS2V5IiwiRG91YmxlQ2xpY2tJdGVtVG9FeHBhbmRJbnRlcmFjdGlvbk1hbmFnZXIiLCJlbnZpcm9ubWVudCIsIkRvdWJsZUNsaWNrSXRlbVRvRXhwYW5kIiwiX3RoaXMiLCJvbkNsaWNrIiwiZm9jdXNJdGVtIiwic2hpZnRLZXkiLCJzZWxlY3RVcFRvIiwiaXNTZWxlY3RlZCIsInVuc2VsZWN0SXRlbSIsImFkZFRvU2VsZWN0ZWRJdGVtcyIsInNlbGVjdEl0ZW0iLCJvbkRvdWJsZUNsaWNrIiwiaXNGb2xkZXIiLCJ0b2dnbGVFeHBhbmRlZFN0YXRlIiwiY2FuSW52b2tlUHJpbWFyeUFjdGlvbk9uSXRlbUNvbnRhaW5lciIsInByaW1hcnlBY3Rpb24iLCJvbkZvY3VzIiwib25EcmFnU3RhcnQiLCJkYXRhVHJhbnNmZXIiLCJkcm9wRWZmZWN0Iiwic3RhcnREcmFnZ2luZyIsIm9uRHJhZ092ZXIiLCJwcmV2ZW50RGVmYXVsdCIsImRyYWdnYWJsZSIsImNhbkRyYWciLCJpc1JlbmFtaW5nIiwidGFiSW5kZXgiLCJpc0ZvY3VzZWQiLCJ1bmRlZmluZWQiLCJDbGlja0l0ZW1Ub0V4cGFuZEludGVyYWN0aW9uTWFuYWdlciIsIkNsaWNrSXRlbVRvRXhwYW5kIiwiQ2xpY2tBcnJvd1RvRXhwYW5kSW50ZXJhY3Rpb25NYW5hZ2VyIiwiYnVpbGRJbnRlcmFjdGlvbk1vZGUiLCJDbGlja0Fycm93VG9FeHBhbmQiLCJFcnJvciIsImNvbmNhdCIsIkludGVyYWN0aW9uTWFuYWdlckNvbnRleHQiLCJSZWFjdCIsImNyZWF0ZUNvbnRleHQiLCJ1c2VJbnRlcmFjdGlvbk1hbmFnZXIiLCJ1c2VDb250ZXh0IiwiSW50ZXJhY3Rpb25NYW5hZ2VyUHJvdmlkZXIiLCJfYSIsImNoaWxkcmVuIiwidXNlVHJlZUVudmlyb25tZW50IiwiZGVmYXVsdEludGVyYWN0aW9uTW9kZSIsImludGVyYWN0aW9uTWFuYWdlciIsInVzZU1lbW8iLCJleHRlbmRzIiwiY3JlYXRlRWxlbWVudCIsIlByb3ZpZGVyIiwidmFsdWUiLCJ1c2VDYW5Ecm9wQXQiLCJ1c2VDYWxsYmFjayIsImRyYWdnaW5nUG9zaXRpb24iLCJkcmFnZ2luZ0l0ZW1zIiwidGFyZ2V0VHlwZSIsImNhblJlb3JkZXJJdGVtcyIsImNhbkRyb3BPbkZvbGRlciIsInJlc29sdmVkSXRlbSIsIml0ZW1zIiwidGFyZ2V0SXRlbSIsImNhbkRyb3BPbk5vbkZvbGRlciIsInNvbWUiLCJkcmFnZ2luZ0l0ZW0iLCJpbmRleCIsImNhbkRyb3BBdCIsInVzZUdldEdldFBhcmVudE9mTGluZWFySXRlbSIsIml0ZW1MaW5lYXJJbmRleCIsImxpbmVhckl0ZW1zIiwiZGVwdGgiLCJwYXJlbnRMaW5lYXJJbmRleCIsInBhcmVudCIsInRyZWVzIiwicm9vdEl0ZW0iLCJ1c2VHZXRWaWFibGVEcmFnUG9zaXRpb25zIiwiZ2V0UGFyZW50T2ZMaW5lYXJJdGVtIiwiaXNEZXNjZW5kYW50IiwicG90ZW50aWFsUGFyZW50cyIsIl9iIiwidGFyZ2V0cyIsInNraXBVbnRpbERlcHRoSXNMb3dlclRoYW4iLCJsaW5lYXJJbmRleCIsIl9jIiwicGFyZW50XzEiLCJjaGlsZEluZGV4IiwiaXRlbVBvc2l0aW9uIiwicGFyZW50SXRlbSIsInRvcFBvc2l0aW9uIiwibGluZVBvc2l0aW9uIiwiYm90dG9tUG9zaXRpb24iLCJza2lwVG9wUG9zaXRpb24iLCJwdXNoIiwiX19zcHJlYWRBcnJheSIsInRvIiwiZnJvbSIsInBhY2siLCJsIiwiYXIiLCJBcnJheSIsInNsaWNlIiwidXNlU2lkZUVmZmVjdCIsImVmZmVjdCIsImRlcHMiLCJjaGFuZ2VPbiIsInByZXZpb3VzUmVmIiwidXNlUmVmIiwidXNlRWZmZWN0IiwiY3VycmVudCIsImNoYW5nZWQiLCJ2IiwiYnVpbGRNYXBGb3JUcmVlcyIsInRyZWVJZHMiLCJidWlsZCIsIm1hcCIsImlkIiwicmVkdWNlIiwiYSIsIm9iaiIsImdldERvY3VtZW50IiwiZG9jdW1lbnQiLCJ1c2VDYWxsU29vbiIsImRvbnRDbGVhbiIsImhhbmRsZVJlZiIsImhhbmRsZXMiLCJmb3JFYWNoIiwiaGFuZGxlIiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJjYWxsYmFjayIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsInNwbGljZSIsInVzZVJlZkNvcHkiLCJyZWYiLCJ1c2VTdGFibGVIYW5kbGVyIiwiaGFuZGxlciIsImhhbmRsZXJSZWYiLCJhcmdzIiwiX2kiLCJ1c2VHZXRPcmlnaW5hbEl0ZW1PcmRlciIsImVudiIsImZpbmRJbmRleCIsImxpbmVhckl0ZW0iLCJzb3J0IiwiYVBvcyIsImJQb3MiLCJjb21wdXRlSXRlbUhlaWdodCIsImZpcnN0SXRlbSIsInF1ZXJ5U2VsZWN0b3IiLCJzdHlsZSIsImdldENvbXB1dGVkU3R5bGUiLCJvZmZzZXRIZWlnaHQiLCJNYXRoIiwibWF4IiwicGFyc2VGbG9hdCIsIm1hcmdpblRvcCIsIm1hcmdpbkJvdHRvbSIsImlzT3V0c2lkZU9mQ29udGFpbmVyIiwidHJlZUJiIiwiY2xpZW50WCIsImxlZnQiLCJyaWdodCIsImNsaWVudFkiLCJ0b3AiLCJib3R0b20iLCJEcmFnZ2luZ1Bvc2l0aW9uRXZhbHVhdGlvbiIsImhvdmVyaW5nUG9zaXRpb24iLCJvZmZzZXQiLCJpbmRlbnRhdGlvbiIsImdldEVtcHR5VHJlZURyYWdQb3NpdGlvbiIsIm1heWJlUmVkaXJlY3RUb1BhcmVudCIsInJlZGlyZWN0VGFyZ2V0VG9QYXJlbnQiLCJtYXliZVJlcGFyZW50VXB3YXJkcyIsInRyZWVMaW5lYXJJdGVtcyIsImRlZXBlc3REZXB0aCIsImxlZ2FsRHJvcERlcHRoQ291bnQiLCJjYW5SZXBhcmVudFVwd2FyZHMiLCJkcm9wcGluZ0luZGVudCIsIm5ld1BhcmVudCIsImluc2VydGlvbkl0ZW1BYm92ZSIsInJlcGFyZW50ZWRDaGlsZEluZGV4IiwibWF5YmVSZWRpcmVjdEluc2lkZU9wZW5Gb2xkZXIiLCJuZXh0SXRlbSIsInJlZGlyZWN0SW5zaWRlT3BlbkZvbGRlciIsImNhbkRyb3BCZWxvd09wZW5Gb2xkZXJzIiwibWF5YmVNYXBUb0JvdHRvbU9mZnNldCIsInByaW9ySXRlbSIsImRlcHRoRGlzdGFuY2VUb1ByaW9yIiwiY2FuRHJvcEF0Q3VycmVudFRhcmdldCIsInRhcmdldEl0ZW1EYXRhIiwiZ2V0RHJhZ2dpbmdQb3NpdGlvbiIsInJlcGFyZW50ZWQiLCJhcmVEcmFnZ2luZ0l0ZW1zRGVzY2VuZGFudE9mVGFyZ2V0IiwibmV3Q2hpbGRJbmRleCIsInVzZURyYWdnaW5nUG9zaXRpb24iLCJkcmFnQ29kZSIsInVzZVN0YXRlIiwic2V0RHJhZ2dpbmdJdGVtcyIsIml0ZW1IZWlnaHQiLCJpc05ld0RyYWdQb3NpdGlvbiIsIm5ld0RyYWdDb2RlIiwiZ2V0SG92ZXJpbmdQb3NpdGlvbiIsImNvbnRhaW5lclJlZiIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsIm1pbiIsImZsb29yIiwidGFyZ2V0TGluZWFySXRlbSIsInJlbmRlckRlcHRoT2Zmc2V0IiwibGluZVRocmVzaG9sZCIsImNhbkRyYWdBbmREcm9wIiwiaW5pdGlhdGVEcmFnZ2luZ1Bvc2l0aW9uIiwicmVzZXREcmFnZ2luZ1Bvc2l0aW9uIiwiRHJhZ0FuZERyb3BDb250ZXh0IiwidXNlRHJhZ0FuZERyb3AiLCJEcmFnQW5kRHJvcFByb3ZpZGVyIiwiaXNQcm9ncmFtbWF0aWNhbGx5RHJhZ2dpbmciLCJzZXRJc1Byb2dyYW1tYXRpY2FsbHlEcmFnZ2luZyIsInZpYWJsZURyYWdQb3NpdGlvbnMiLCJzZXRWaWFibGVEcmFnUG9zaXRpb25zIiwiX2QiLCJwcm9ncmFtbWF0aWNEcmFnSW5kZXgiLCJzZXRQcm9ncmFtbWF0aWNEcmFnSW5kZXgiLCJfZSIsInNldERyYWdnaW5nUG9zaXRpb24iLCJnZXRWaWFibGVEcmFnUG9zaXRpb25zIiwiY2FsbFNvb24iLCJnZXRPcmlnaW5hbEl0ZW1PcmRlciIsIl9mIiwicmVzZXRQcm9ncmFtbWF0aWNEcmFnSW5kZXhGb3JDdXJyZW50VHJlZSIsImFjdGl2ZVRyZWVJZCIsInZpZXdTdGF0ZSIsImZvY3VzZWRJdGVtIiwiZm9jdXNJdGVtXzEiLCJ0cmVlRHJhZ1Bvc2l0aW9ucyIsIm5ld1BvcyIsInBvcyIsInJlc2V0U3RhdGUiLCJwZXJmb3JtRHJhZyIsInNldEFjdGl2ZVRyZWUiLCJvblNlbGVjdEl0ZW1zIiwib25EcmFnT3ZlclRyZWVIYW5kbGVyIiwibmV3RHJhZ2dpbmdQb3NpdGlvbiIsIm9uRHJhZ0xlYXZlQ29udGFpbmVySGFuZGxlciIsIm9uRHJvcEhhbmRsZXIiLCJvbkRyb3AiLCJvbkZvY3VzSXRlbSIsIm9uU3RhcnREcmFnZ2luZ0l0ZW1zIiwidHJlZVZpYWJsZURyYWdQb3NpdGlvbnMiLCJzdGFydFByb2dyYW1tYXRpY0RyYWciLCJkcmFnZ2luZ0l0ZW1zXzEiLCJzZWxlY3RlZEl0ZW1zIiwicmVzb2x2ZWREcmFnZ2luZ0l0ZW1zIiwic2V0VGltZW91dCIsImFib3J0UHJvZ3JhbW1hdGljRHJhZyIsImNvbXBsZXRlUHJvZ3JhbW1hdGljRHJhZyIsInByb2dyYW1tYXRpY0RyYWdVcCIsIm9sZEluZGV4IiwicHJvZ3JhbW1hdGljRHJhZ0Rvd24iLCJkbmQiLCJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsInVzZUNyZWF0ZWRFbnZpcm9ubWVudFJlZiIsInVzZUltcGVyYXRpdmVIYW5kbGUiLCJ0cmVlRW52aXJvbm1lbnRDb250ZXh0IiwiZHJhZ0FuZERyb3BDb250ZXh0Iiwid2FpdEZvciIsImNoZWNrIiwiaW50ZXJ2YWxNcyIsInRpbWVvdXRNcyIsIlByb21pc2UiLCJyZXNvbHZlIiwiY29tcGxldGUiLCJpbnRlcnZhbCIsInNldEludGVydmFsIiwidGltZW91dCIsImNsZWFySW50ZXJ2YWwiLCJjbGVhclRpbWVvdXQiLCJfX2F3YWl0ZXIiLCJ0aGlzQXJnIiwiX2FyZ3VtZW50cyIsIlAiLCJnZW5lcmF0b3IiLCJhZG9wdCIsInJlamVjdCIsImZ1bGZpbGxlZCIsInN0ZXAiLCJuZXh0IiwicmVqZWN0ZWQiLCJyZXN1bHQiLCJkb25lIiwidGhlbiIsIl9fZ2VuZXJhdG9yIiwiYm9keSIsIl8iLCJsYWJlbCIsInNlbnQiLCJ0cnlzIiwib3BzIiwiZiIsInkiLCJnIiwidmVyYiIsIlN5bWJvbCIsIml0ZXJhdG9yIiwib3AiLCJUeXBlRXJyb3IiLCJwb3AiLCJFbnZpcm9ubWVudEFjdGlvbnNDb250ZXh0IiwidXNlRW52aXJvbm1lbnRBY3Rpb25zIiwicmVjdXJzaXZlRXhwYW5kIiwiaXRlbUlkIiwib25FeHBhbmQiLCJfbG9vcF8xIiwiY2hpbGRJZCIsIkVudmlyb25tZW50QWN0aW9uc1Byb3ZpZGVyIiwiZm9yd2FyZFJlZiIsInByb3BzIiwib25Db2xsYXBzZUl0ZW0iLCJvbkV4cGFuZEl0ZW0iLCJvblJlbmFtZUl0ZW0iLCJvblByaW1hcnlBY3Rpb24iLCJpdGVtc1JlZiIsImNvbGxhcHNlSXRlbSIsImV4cGFuZEl0ZW0iLCJzZXREb21Gb2N1cyIsImZvY3VzVHJlZSIsImF1dG9Gb2N1cyIsIm1vdmVGb2N1c0Rvd24iLCJjdXJyZW50Rm9jdXNJbmRleCIsIm5ld0luZGV4IiwibmV3SXRlbSIsIm1vdmVGb2N1c1VwIiwicmVuYW1lSXRlbSIsIm5hbWUiLCJzZWxlY3RJdGVtcyIsIml0ZW1zSWRzIiwidG9nZ2xlSXRlbUV4cGFuZGVkU3RhdGUiLCJleHBhbmRlZEl0ZW1zIiwiaW5jbHVkZXMiLCJ0b2dnbGVJdGVtU2VsZWN0U3RhdHVzIiwiZmlsdGVyIiwiaW52b2tlUHJpbWFyeUFjdGlvbiIsImV4cGFuZFN1YnNlcXVlbnRseSIsIml0ZW1JZHMiLCJyZXN0IiwiZXhwYW5kQWxsIiwiY29sbGFwc2VBbGwiLCJtb3ZlUHJvZ3JhbW1hdGljRHJhZ1Bvc2l0aW9uRG93biIsIm1vdmVQcm9ncmFtbWF0aWNEcmFnUG9zaXRpb25VcCIsInNjcm9sbEludG9WaWV3IiwiZWxlbWVudCIsInNjcm9sbEludG9WaWV3SWZOZWVkZWQiLCJib3VuZGluZ0JveCIsImlzRWxlbWVudEluVmlld3BvcnQiLCJpbm5lckhlaWdodCIsImRvY3VtZW50RWxlbWVudCIsImNsaWVudEhlaWdodCIsImlubmVyV2lkdGgiLCJjbGllbnRXaWR0aCIsImN4IiwiY2xhc3NOYW1lcyIsImNuIiwiam9pbiIsImNyZWF0ZURlZmF1bHRSZW5kZXJlcnMiLCJydGwiLCJyZW5kZXJJdGVtVGl0bGUiLCJ0aXRsZSIsImNvbnRleHQiLCJpbmZvIiwiaXNTZWFyY2hpbmciLCJpc1NlYXJjaE1hdGNoaW5nIiwic3RhcnRJbmRleCIsInRvTG93ZXJDYXNlIiwic2VhcmNoIiwiRnJhZ21lbnQiLCJjbGFzc05hbWUiLCJyZW5kZXJJdGVtQXJyb3ciLCJpc0V4cGFuZGVkIiwiYXJyb3dQcm9wcyIsInZlcnNpb24iLCJ4bWxucyIsInhtbG5zWGxpbmsiLCJ4Iiwidmlld0JveCIsImVuYWJsZUJhY2tncm91bmQiLCJ4bWxTcGFjZSIsImZpbGxSdWxlIiwiY2xpcFJ1bGUiLCJkIiwicmVuZGVySXRlbSIsImFycm93IiwiSW50ZXJhY3RpdmVDb21wb25lbnQiLCJ0eXBlIiwiaXRlbUNvbnRhaW5lcldpdGhDaGlsZHJlblByb3BzIiwiaXNEcmFnZ2luZ092ZXIiLCJpdGVtQ29udGFpbmVyV2l0aG91dENoaWxkcmVuUHJvcHMiLCJpbnRlcmFjdGl2ZUVsZW1lbnRQcm9wcyIsInJlbmRlclJlbmFtZUlucHV0IiwiaW5wdXRQcm9wcyIsImlucHV0UmVmIiwic3VibWl0QnV0dG9uUHJvcHMiLCJzdWJtaXRCdXR0b25SZWYiLCJmb3JtUHJvcHMiLCJyZW5kZXJUcmVlQ29udGFpbmVyIiwiY29udGFpbmVyUHJvcHMiLCJhcmVJdGVtc1NlbGVjdGVkIiwibWluSGVpZ2h0IiwicmVuZGVySXRlbXNDb250YWluZXIiLCJyZW5kZXJEcmFnQmV0d2VlbkxpbmUiLCJsaW5lUHJvcHMiLCJyZW5kZXJTZWFyY2hJbnB1dCIsInJlbmRlckxpdmVEZXNjcmlwdG9yQ29udGFpbmVyIiwidHJlZSIsImNsaXAiLCJjbGlwUGF0aCIsImhlaWdodCIsIm92ZXJmbG93IiwicG9zaXRpb24iLCJ3aGl0ZVNwYWNlIiwid2lkdGgiLCJ1c2VSZW5kZXJlcnMiLCJkZWZhdWx0UmVuZGVyZXJzIiwiY3VzdG9tUmVuZGVyZXJzIiwicmVuZGVyZXJzIiwiZW50cmllcyIsImFjYyIsImtleSIsImtleU1hcHBlZCIsImRpc3BsYXlOYW1lIiwiZ2V0SXRlbXNMaW5lYXJseSIsIl9fcmVzdCIsImdldE93blByb3BlcnR5U3ltYm9scyIsInByb3BlcnR5SXNFbnVtZXJhYmxlIiwidXNlQ29udHJvbGxlZFRyZWVFbnZpcm9ubWVudFByb3BzIiwib25FeHBhbmRJdGVtUHJvcCIsIm9uQ29sbGFwc2VQcm9wIiwib25Ecm9wUHJvcCIsInNldFRyZWVzIiwic2V0QWN0aXZlVHJlZUlkIiwia2V5cyIsIm9uUmVnaXN0ZXJUcmVlIiwib25VbnJlZ2lzdGVyVHJlZSIsIm9uRm9jdXNJdGVtUmVmIiwidmlld1N0YXRlUmVmIiwib25Gb2N1c0l0ZW1IYW5kbGVyIiwiX2ciLCJfaCIsIl9qIiwiYWN0aXZlRWxlbWVudCIsImF0dHJpYnV0ZXMiLCJnZXROYW1lZEl0ZW0iLCJmb2N1cyIsInJlZ2lzdGVyVHJlZSIsInVucmVnaXN0ZXJUcmVlIiwidGFyZ2V0IiwidHJlZUlkT3JTZXRTdGF0ZUZ1bmN0aW9uIiwiYXV0b0ZvY3VzVHJlZSIsIm1heWJlRm9jdXNUcmVlIiwiY29udGFpbnMiLCJvbGRWYWx1ZSIsIlRyZWVFbnZpcm9ubWVudENvbnRleHQiLCJDb250cm9sbGVkVHJlZUVudmlyb25tZW50IiwiZW52aXJvbm1lbnRDb250ZXh0UHJvcHMiLCJEcmFnQmV0d2VlbkxpbmUiLCJ1c2VUcmVlIiwic2hvdWxkRGlzcGxheSIsInVzZUh0bWxFbGVtZW50RXZlbnRMaXN0ZW5lciIsImxpc3RlbmVyIiwic3RhYmxlTGlzdGVuZXIiLCJ1c2VGb2N1c1dpdGhpbiIsIm9uRm9jdXNJbiIsIm9uRm9jdXNPdXQiLCJmb2N1c1dpdGhpbiIsInNldEZvY3VzV2l0aGluIiwiaXNMb29zaW5nRm9jdXNGbGFnIiwidXNlS2V5Iiwib25IaXQiLCJhY3RpdmUiLCJkZWZhdWx0S2V5Ym9hcmRCaW5kaW5ncyIsImV4cGFuZFNpYmxpbmdzIiwibW92ZUZvY3VzVG9GaXJzdEl0ZW0iLCJtb3ZlRm9jdXNUb0xhc3RJdGVtIiwiYWJvcnRSZW5hbWVJdGVtIiwidG9nZ2xlU2VsZWN0SXRlbSIsImFib3J0U2VhcmNoIiwic3RhcnRTZWFyY2giLCJzZWxlY3RBbGwiLCJzdGFydFByb2dyYW1tYXRpY0RuZCIsImNvbXBsZXRlUHJvZ3JhbW1hdGljRG5kIiwiYWJvcnRQcm9ncmFtbWF0aWNEbmQiLCJ1c2VLZXlib2FyZEJpbmRpbmdzIiwia2V5Ym9hcmRCaW5kaW5ncyIsImVsZW1lbnRzVGhhdENhblRha2VUZXh0IiwidXNlSG90a2V5IiwiY29tYmluYXRpb25OYW1lIiwiYWN0aXZhdGFibGVXaGlsZUZvY3VzaW5nSW5wdXQiLCJwcmVzc2VkS2V5cyIsInBvc3NpYmxlQ29tYmluYXRpb25zIiwiY29tYmluYXRpb24iLCJzcGxpdCIsInRhZ05hbWUiLCJpc0NvbnRlbnRFZGl0YWJsZSIsInByZXNzZWRLZXlzTG93ZXJjYXNlXzEiLCJwYXJ0aWFsTWF0Y2giLCJiIiwidGVzdCIsInByZXNzZWRLZXlzTG93ZXJjYXNlIiwibWF0Y2giLCJ1c2VWaWV3U3RhdGUiLCJ1c2VMaW5lYXJJdGVtcyIsInVzZU1vdmVGb2N1c1RvSW5kZXgiLCJjb21wdXRlTmV3SW5kZXgiLCJjdXJyZW50SW5kZXgiLCJuZXdJbmRleEJvdW5kZWQiLCJuZXdGb2N1c0l0ZW0iLCJ1c2VQcmV2aW91cyIsInByZXZpb3VzIiwidXNlU2VsZWN0VXBUbyIsInN0YXJ0aW5nQXQiLCJmb2N1c2VkSXRlbVByZXZpb3VzIiwib3ZlcnJpZGVPbGRTZWxlY3Rpb24iLCJpdGVtSW5kZXgiLCJzZWxlY3RNZXJnZWRJdGVtcyIsIm9sZFNlbGVjdGlvbiIsIm5ld1NlbGVjdGlvbiIsIm1lcmdlZCIsImxhc3RGb2N1c18xIiwic2VsZWN0aW9uU3RhcnQiLCJzZWxlY3Rpb25FbmQiLCJzZWxlY3Rpb24iLCJ1c2VUcmVlS2V5Ym9hcmRCaW5kaW5ncyIsInNldFJlbmFtaW5nSXRlbSIsInNldFNlYXJjaCIsInJlbmFtaW5nSXRlbSIsIm1vdmVGb2N1c1RvSW5kZXgiLCJpc0FjdGl2ZVRyZWUiLCJkaXNhYmxlQXJyb3dLZXlzIiwiZW5hYmxlQXJyb3dLZXlzIiwiaXRlbURlcHRoIiwicGFyZW50SW5kZXgiLCJjYW5SZW5hbWUiLCJvblN0YXJ0UmVuYW1pbmdJdGVtIiwiZGVmYXVsdE1hdGNoZXIiLCJpdGVtVGl0bGUiLCJ1c2VTZWFyY2hNYXRjaEZvY3VzIiwiZG9lc1NlYXJjaE1hdGNoSXRlbSIsImdldEl0ZW1UaXRsZSIsImZpbmQiLCJTZWFyY2hJbnB1dCIsImNsZWFyU2VhcmNoIiwidW5pY29kZSIsImNoYXJDb2RlQXQiLCJjYW5TZWFyY2giLCJjYW5TZWFyY2hCeVN0YXJ0aW5nVHlwaW5nIiwiYWx0S2V5Iiwib25DaGFuZ2UiLCJvbkJsdXIiLCJlbCIsImRlZmF1bHRMaXZlRGVzY3JpcHRvcnMiLCJpbnRyb2R1Y3Rpb24iLCJzZWFyY2hpbmciLCJwcm9ncmFtbWF0aWNhbGx5RHJhZ2dpbmciLCJwcm9ncmFtbWF0aWNhbGx5RHJhZ2dpbmdUYXJnZXQiLCJyZXNvbHZlTGl2ZURlc2NyaXB0b3IiLCJkZXNjcmlwdG9yIiwicmVwbGFjZSIsInZhcmlhYmxlTmFtZVdpdGhCcmFja2V0cyIsInZhcmlhYmxlTmFtZSIsInRyZWVMYWJlbCIsInBhcmVudFRpdGxlIiwic3RhcnRzV2l0aCIsIkxpdmVXcmFwcGVyIiwibGl2ZSIsImRhbmdlcm91c2x5U2V0SW5uZXJIVE1MIiwiX19odG1sIiwiTGl2ZURlc2NyaXB0aW9uIiwiZGVzY3JpcHRvcnMiLCJsaXZlRGVzY3JpcHRvcnMiLCJNYWluV3JhcHBlciIsInRyZWVJbmZvcm1hdGlvbiIsIk1heWJlTGl2ZURlc2NyaXB0aW9uIiwic2hvd0xpdmVEZXNjcmlwdGlvbiIsIlRyZWVNYW5hZ2VyIiwib2xkVHJlZUlkIiwicm9vdENoaWxkcmVuIiwidHJlZUNoaWxkcmVuIiwiVHJlZUl0ZW1DaGlsZHJlbiIsInBhcmVudElkIiwib25EcmFnTGVhdmUiLCJvbk1vdXNlRG93biIsInJvbGUiLCJ0cmVlTGFiZWxsZWRCeSIsInVzZUNyZWF0ZWRUcmVlSW5mb3JtYXRpb24iLCJ1c2VDcmVhdGVkVHJlZVJlZiIsInRyZWVDb250ZXh0IiwiVHJlZUFjdGlvbnNQcm92aWRlciIsImVudkFjdGlvbnMiLCJhYm9ydFJlbmFtaW5nSXRlbSIsImNvbXBsZXRlUmVuYW1pbmdJdGVtIiwic3RhcnRSZW5hbWluZ0l0ZW0iLCJzdG9wUmVuYW1pbmdJdGVtIiwiVHJlZUNvbnRleHQiLCJUcmVlIiwidHJlZUNvbnRleHRQcm9wcyIsIm9uTWlzc2luZ0l0ZW1zIiwiY2hpbGRFbGVtZW50cyIsImNoaWxkIiwiVHJlZUl0ZW1FbGVtZW50IiwidXNlVHJlZUl0ZW1SZW5kZXJDb250ZXh0IiwiY3VycmVudGx5U2VsZWN0ZWRJdGVtcyIsImlzSXRlbVBhcnRPZlNlbGVjdGVkSXRlbXMiLCJzZWxlY3RlZEl0ZW0iLCJjYW5EcmFnQ3VycmVudGx5U2VsZWN0ZWRJdGVtcyIsImNhbk1vdmUiLCJjYW5EcmFnVGhpc0l0ZW0iLCJjYW5Ecm9wT24iLCJvcmRlcmVkSXRlbXMiLCJpc0RyYWdnaW5nT3ZlclBhcmVudCIsInZpZXdTdGF0ZUZsYWdzIiwiaXNBcnJheSIsIlRyZWVJdGVtUmVuYW1pbmdJbnB1dCIsInNldFRpdGxlIiwiYWJvcnQiLCJvbkFib3J0UmVuYW1pbmdJdGVtIiwiY29uZmlybSIsInNlbGVjdCIsInJlbGF0ZWRUYXJnZXQiLCJzdG9wUHJvcGFnYXRpb24iLCJvblN1Ym1pdCIsImhhc0JlZW5SZXF1ZXN0ZWQiLCJzZXRIYXNCZWVuUmVxdWVzdGVkIiwicmVuZGVyQ29udGV4dCIsInNob3VsZFJlbmRlckNoaWxkcmVuIiwidGl0bGVDb21wb25lbnQiLCJhcnJvd0NvbXBvbmVudCIsInRyZWVEYXRhUmVkdWNlciIsInRyZWVEYXRhIiwiYWN0aW9uIiwiZGF0YSIsImRlbGV0ZWROb2RlSURzIiwiZGVsZXRlZE5vZGVJRCIsImRhdGFDaGFuZ2VkRGF0ZSIsIkZvbGRlckljb24iLCJpc09wZW4iLCJmaWxsIiwic3Ryb2tlIiwic3Ryb2tlV2lkdGgiLCJzdHJva2VMaW5lY2FwIiwic3Ryb2tlTGluZWpvaW4iLCJ4MSIsInkxIiwieDIiLCJ5MiIsIkZpbGVJY29uIiwiZmlsZVR5cGUiLCJnZXRGaWxlSWNvbiIsInBvaW50cyIsImZvbnRTaXplIiwiVHJlZUNvbnRhaW5lciIsInNlcnZpY2VVcmwiLCJ3aWRnZXROYW1lIiwid2lkZ2V0Q2xhc3NOYW1lIiwidG9nZ2xlRXhwYW5kZWRJY29uT25seSIsImFsbG93Tm9kZVJlbmFtZSIsImFsbG93RHJhZ1Jlb3JkZXJpbmciLCJhbGxvd0RyYWdNb3ZlIiwiY29sbGFwc2VBbGxCdXR0b25JY29uIiwiY29sbGFwc2VBbGxCdXR0b25DYXB0aW9uIiwiY29sbGFwc2VBbGxCdXR0b25DbGFzcyIsInNob3dFeHBhbmRBbGxCdXR0b24iLCJleHBhbmRBbGxCdXR0b25JY29uIiwiZXhwYW5kQWxsQnV0dG9uQ2FwdGlvbiIsImV4cGFuZEFsbEJ1dHRvbkNsYXNzIiwib25TZWxlY3Rpb25DaGFuZ2VkIiwib25NaXNzaW5nTm9kZXMiLCJvbk5vZGVSZW5hbWVkIiwibG9nTWVzc2FnZVRvQ29uc29sZSIsImxvZ1RvQ29uc29sZSIsImR1bXBTZXJ2aWNlUmVzcG9uc2VJbkNvbnNvbGUiLCJkaXNwYXRjaCIsInVzZVJlZHVjZXIiLCJzZXRGb2N1c2VkSXRlbSIsInNldEV4cGFuZGVkSXRlbXMiLCJzZXRTZWxlY3RlZEl0ZW1zIiwiZmlsZUV4dGVuc2lvbiIsImNvbnNvbGUiLCJsb2ciLCJkaXIiLCJvblNlbGVjdGlvbkNoYW5nZWRIYW5kbGVyIiwic2VsZWN0ZWRJRHMiLCJvbkV4cGFuZEl0ZW1IYW5kbGVyIiwiZmlyc3RDaGlsZElEIiwicmVxdWVzdGVkSURzIiwib25Db2xsYXBzZUFsbEJ1dHRvbkNsaWNrIiwib25FeHBhbmRBbGxCdXR0b25DbGljayIsImV4cGFuZGFibGVJdGVtSURzIiwiaXRlbUlEIiwib25SZW5hbWVOb2RlSGFuZGxlciIsIm5ld05hbWUiLCJkcmFnZ2VkSXRlbUlEcyIsImFjY3VtdWxhdG9yIiwiSlNPTiIsInN0cmluZ2lmeSIsImNhbkRyYWdIYW5kbGVyIiwiZmlyc3RQYXJlbnRJRCIsInBhcmVudElEIiwiZXZlcnkiLCJjYW5Ecm9wQXRIYW5kbGVyIiwidGFyZ2V0Tm9kZUlEIiwidGFyZ2V0Tm9kZSIsImFjY2VwdERyYWdUeXBlcyIsImRyYWdUeXBlIiwicHJvY2Vzc0RhdGFGcm9tU2VydmljZSIsIlJlc3BvbnNlTm9kZXMiLCJub2RlcyIsInZhbHVlcyIsImNyZWF0ZVRyZWVEYXRhT2JqZWN0IiwiZXJyb3IiLCJuZXdUcmVlRGF0YSIsIm5vZGUiLCJub2RlRGF0YSIsInJlbG9hZFRyZWUiLCJ1cGRhdGVUcmVlIiwid2FybiIsImZvY3VzTm9kZUlEIiwiZXhwYW5kSXRlbUlEcyIsImV4cGFuZEl0ZW1JREFycmF5IiwicmVzZXRFeHBhbmRlZEl0ZW1zIiwiZ2V0VGltZSIsInNlcnZpY2VVcmxMb2NhbCIsIm14Iiwic2Vzc2lvbiIsInRva2VuIiwiZ2V0Q29uZmlnIiwiZmV0Y2giLCJjcmVkZW50aWFscyIsImhlYWRlcnMiLCJBY2NlcHQiLCJyZXNwb25zZSIsIm9rIiwianNvbiIsInN0YXR1c1RleHQiLCJ0cmVlTmFtZSIsImludGVyYWN0aW9uTW9kZSIsIkljb24iLCJpY29uIiwiZXhwYW5kZWRJdGVtSW5kZXgiLCJSZWFjdENvbXBsZXhUcmVlV2lkZ2V0IiwibWVzc2FnZSIsIkRhdGUiLCJ0b0lTT1N0cmluZyIsIm9uU2VsZWN0aW9uQ2hhbmdlZEFjdGlvbiIsInNlbGVjdGVkTm9kZUlEc0F0dHIiLCJzZWxlY3RlZEl0ZW1JRHMiLCJzdGF0dXMiLCJyZWFkT25seSIsInNldFZhbHVlIiwiY2FuRXhlY3V0ZSIsImlzRXhlY3V0aW5nIiwiZXhlY3V0ZSIsIm9uTWlzc2luZ05vZGVzQWN0aW9uIiwibWlzc2luZ05vZGVJRHNBdHRyIiwib25NaXNzaW5nTm9kZXNIYW5kbGVyIiwibWlzc2luZ0l0ZW1JRHMiLCJvbk5vZGVSZW5hbWVkQWN0aW9uIiwicmVuYW1lZE5vZGVJREF0dHIiLCJuZXdOb2RlTmFtZUF0dHIiLCJvbk5vZGVSZW5hbWVkSGFuZGxlciIsIm5vZGVJRCIsIm9uRHJvcEFjdGlvbiIsImRyYWdnZWROb2RlSURzQXR0ciIsImRyb3BUYXJnZXRBdHRyIiwiZHJvcHBlZE5vZGVJRHMiLCJkYXRhQ2hhbmdlRGF0ZUF0dHIiLCJjbGFzcyJdLCJtYXBwaW5ncyI6Ijs7OztBQUFPLElBQUlBLGVBQWUsQ0FBQTtBQUMxQixDQUFDLFVBQVVBLGVBQWUsRUFBRTtBQUN4QkEsRUFBQUEsZUFBZSxDQUFDLHlCQUF5QixDQUFDLEdBQUcsNkJBQTZCLENBQUE7QUFDMUVBLEVBQUFBLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLHNCQUFzQixDQUFBO0FBQzdEQSxFQUFBQSxlQUFlLENBQUMsb0JBQW9CLENBQUMsR0FBRyx1QkFBdUIsQ0FBQTtBQUNuRSxDQUFDLEVBQUVBLGVBQWUsS0FBS0EsZUFBZSxHQUFHLEVBQUUsQ0FBQyxDQUFDOztBQ0w3QyxJQUFJQyxVQUFRLEdBQUlDLFNBQUksSUFBSUEsU0FBSSxDQUFDRCxRQUFRLElBQUssWUFBWTtBQUNsREEsRUFBQUEsVUFBUSxHQUFHRSxNQUFNLENBQUNDLE1BQU0sSUFBSSxVQUFTQyxDQUFDLEVBQUU7QUFDcEMsSUFBQSxLQUFLLElBQUlDLENBQUMsRUFBRUMsQ0FBQyxHQUFHLENBQUMsRUFBRUMsQ0FBQyxHQUFHQyxTQUFTLENBQUNDLE1BQU0sRUFBRUgsQ0FBQyxHQUFHQyxDQUFDLEVBQUVELENBQUMsRUFBRSxFQUFFO0FBQ2pERCxNQUFBQSxDQUFDLEdBQUdHLFNBQVMsQ0FBQ0YsQ0FBQyxDQUFDLENBQUE7TUFDaEIsS0FBSyxJQUFJSSxDQUFDLElBQUlMLENBQUMsRUFBRSxJQUFJSCxNQUFNLENBQUNTLFNBQVMsQ0FBQ0MsY0FBYyxDQUFDQyxJQUFJLENBQUNSLENBQUMsRUFBRUssQ0FBQyxDQUFDLEVBQzNETixDQUFDLENBQUNNLENBQUMsQ0FBQyxHQUFHTCxDQUFDLENBQUNLLENBQUMsQ0FBQyxDQUFBO0FBQ25CLEtBQUE7QUFDQSxJQUFBLE9BQU9OLENBQUMsQ0FBQTtHQUNYLENBQUE7QUFDRCxF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
