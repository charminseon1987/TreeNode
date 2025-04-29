define(['exports', 'react', 'mendix/components/web/Icon'], (function (exports, React, Icon) { 'use strict';

    function _interopNamespaceDefault(e) {
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        }
        n.default = e;
        return Object.freeze(n);
    }

    var React__namespace = /*#__PURE__*/_interopNamespaceDefault(React);

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

    var InteractionManagerContext = React__namespace.createContext(null);
    var useInteractionManager = function () {
      return React__namespace.useContext(InteractionManagerContext);
    };
    var InteractionManagerProvider = function (_a) {
      var children = _a.children;
      var environment = useTreeEnvironment();
      var defaultInteractionMode = environment.defaultInteractionMode;
      var interactionManager = React.useMemo(function () {
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
      return React__namespace.createElement(InteractionManagerContext.Provider, {
        value: interactionManager
      }, children);
    };

    var useCanDropAt = function () {
      var environment = useTreeEnvironment();
      return React.useCallback(function (draggingPosition, draggingItems) {
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
      return React.useCallback(function (itemLinearIndex, treeId) {
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
      var isDescendant = React.useCallback(function (treeId, itemLinearIndex, potentialParents) {
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
      return React.useCallback(function (treeId, draggingItems) {
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
      var previousRef = React.useRef();
      React.useEffect(function () {
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
      var handleRef = React.useRef(new Array());
      React.useEffect(function () {
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
      return React.useCallback(function (callback) {
        var handle = requestAnimationFrame(function () {
          handleRef.current.splice(handleRef.current.indexOf(handle), 1);
          callback();
        });
        handleRef.current.push(handle);
      }, [handleRef]);
    }

    var useRefCopy = function (value) {
      var ref = React.useRef(value);
      ref.current = value;
      return ref;
    };

    var useStableHandler = function (handler) {
      var handlerRef = useRefCopy(handler);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      return React.useCallback(function () {
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
      var dragCode = React.useRef('initial');
      var _a = React.useState(undefined),
        draggingItems = _a[0],
        setDraggingItems = _a[1];
      var itemHeight = React.useRef(0);
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

    var DragAndDropContext = React__namespace.createContext(null);
    var useDragAndDrop = function () {
      return React__namespace.useContext(DragAndDropContext);
    };
    var DragAndDropProvider = function (_a) {
      var children = _a.children;
      var environment = useTreeEnvironment();
      var _b = React.useState(false),
        isProgrammaticallyDragging = _b[0],
        setIsProgrammaticallyDragging = _b[1];
      var _c = React.useState({}),
        viableDragPositions = _c[0],
        setViableDragPositions = _c[1];
      var _d = React.useState(0),
        programmaticDragIndex = _d[0],
        setProgrammaticDragIndex = _d[1];
      var _e = React.useState(),
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
      var resetProgrammaticDragIndexForCurrentTree = React.useCallback(function (viableDragPositions, draggingItems) {
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
      var onStartDraggingItems = React.useCallback(function (items, treeId) {
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
      var startProgrammaticDrag = React.useCallback(function () {
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
      var abortProgrammaticDrag = React.useCallback(function () {
        resetState();
      }, [resetState]);
      var completeProgrammaticDrag = React.useCallback(function () {
        onDropHandler();
        resetState();
      }, [onDropHandler, resetState]);
      var programmaticDragUp = React.useCallback(function () {
        setProgrammaticDragIndex(function (oldIndex) {
          return Math.max(0, oldIndex - 1);
        });
      }, []);
      var programmaticDragDown = React.useCallback(function () {
        if (environment.activeTreeId) {
          setProgrammaticDragIndex(function (oldIndex) {
            return Math.min(viableDragPositions[environment.activeTreeId].length, oldIndex + 1);
          });
        }
      }, [environment.activeTreeId, viableDragPositions]);
      var dnd = React.useMemo(function () {
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
      React.useEffect(function () {
        window.addEventListener('dragend', resetState);
        window.addEventListener('drop', onDropHandler);
        return function () {
          window.removeEventListener('dragend', resetState);
          window.removeEventListener('drop', onDropHandler);
        };
      }, [onDropHandler, resetState]);
      return React__namespace.createElement(DragAndDropContext.Provider, {
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
      React.useImperativeHandle(ref, function () {
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
    var EnvironmentActionsContext$1 = React__namespace.createContext(null);
    var useEnvironmentActions = function () {
      return React__namespace.useContext(EnvironmentActionsContext$1);
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
    var EnvironmentActionsProvider = React__namespace.forwardRef(function (props, ref) {
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
      var collapseItem = React.useCallback(function (itemId, treeId) {
        onCollapseItem === null || onCollapseItem === void 0 ? void 0 : onCollapseItem(items[itemId], treeId);
      }, [items, onCollapseItem]);
      var expandItem = React.useCallback(function (itemId, treeId) {
        onExpandItem === null || onExpandItem === void 0 ? void 0 : onExpandItem(items[itemId], treeId);
      }, [items, onExpandItem]);
      var focusItem = React.useCallback(function (itemId, treeId, setDomFocus) {
        if (setDomFocus === void 0) {
          setDomFocus = true;
        }
        onFocusItem === null || onFocusItem === void 0 ? void 0 : onFocusItem(items[itemId], treeId, setDomFocus);
      }, [items, onFocusItem]);
      var focusTree = React.useCallback(function (treeId, autoFocus) {
        if (autoFocus === void 0) {
          autoFocus = true;
        }
        setActiveTree(treeId, autoFocus);
      }, [setActiveTree]);
      var moveFocusDown = React.useCallback(function (treeId) {
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
      var moveFocusUp = React.useCallback(function (treeId) {
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
      var renameItem = React.useCallback(function (itemId, name, treeId) {
        onRenameItem === null || onRenameItem === void 0 ? void 0 : onRenameItem(items[itemId], name, treeId);
      }, [items, onRenameItem]);
      var selectItems = React.useCallback(function (itemsIds, treeId) {
        onSelectItems === null || onSelectItems === void 0 ? void 0 : onSelectItems(itemsIds, treeId);
      }, [onSelectItems]);
      var toggleItemExpandedState = React.useCallback(function (itemId, treeId) {
        var _a, _b;
        if ((_b = (_a = viewState[treeId]) === null || _a === void 0 ? void 0 : _a.expandedItems) === null || _b === void 0 ? void 0 : _b.includes(itemId)) {
          onCollapseItem === null || onCollapseItem === void 0 ? void 0 : onCollapseItem(items[itemId], treeId);
        } else {
          onExpandItem === null || onExpandItem === void 0 ? void 0 : onExpandItem(items[itemId], treeId);
        }
      }, [items, onCollapseItem, onExpandItem, viewState]);
      var toggleItemSelectStatus = React.useCallback(function (itemId, treeId) {
        var _a, _b, _c, _d, _e;
        if ((_b = (_a = viewState[treeId]) === null || _a === void 0 ? void 0 : _a.selectedItems) === null || _b === void 0 ? void 0 : _b.includes(itemId)) {
          onSelectItems === null || onSelectItems === void 0 ? void 0 : onSelectItems((_d = (_c = viewState[treeId].selectedItems) === null || _c === void 0 ? void 0 : _c.filter(function (item) {
            return item !== itemId;
          })) !== null && _d !== void 0 ? _d : [], treeId);
        } else {
          onSelectItems === null || onSelectItems === void 0 ? void 0 : onSelectItems(__spreadArray$3(__spreadArray$3([], (_e = viewState[treeId].selectedItems) !== null && _e !== void 0 ? _e : [], true), [itemId], false), treeId);
        }
      }, [onSelectItems, viewState]);
      var invokePrimaryAction = React.useCallback(function (itemId, treeId) {
        onPrimaryAction === null || onPrimaryAction === void 0 ? void 0 : onPrimaryAction(items[itemId], treeId);
      }, [items, onPrimaryAction]);
      var expandSubsequently = React.useCallback(function (treeId, itemIds) {
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
      var expandAll = React.useCallback(function (treeId) {
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
      var collapseAll = React.useCallback(function (treeId) {
        var _a, _b;
        for (var _i = 0, _c = (_b = (_a = viewState[treeId]) === null || _a === void 0 ? void 0 : _a.expandedItems) !== null && _b !== void 0 ? _b : []; _i < _c.length; _i++) {
          var itemId = _c[_i];
          onCollapseItem === null || onCollapseItem === void 0 ? void 0 : onCollapseItem(items[itemId], treeId);
        }
      }, [items, onCollapseItem, viewState]);
      // TODO change environment childs to use actions rather than output events where possible
      var actions = React.useMemo(function () {
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
      return React__namespace.createElement(EnvironmentActionsContext$1.Provider, {
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
          return React.createElement(React.Fragment, null, startIndex > 0 && React.createElement("span", null, title.slice(0, startIndex)), React.createElement("span", {
            className: "rct-tree-item-search-highlight"
          }, title.slice(startIndex, startIndex + info.search.length)), startIndex + info.search.length < title.length && React.createElement("span", null, title.slice(startIndex + info.search.length, title.length)));
        },
        renderItemArrow: function (_a) {
          var item = _a.item,
            context = _a.context;
          return (
            // Icons from https://blueprintjs.com/docs/#icons
            React.createElement("div", __assign$8({
              className: cx(item.isFolder && 'rct-tree-item-arrow-isFolder', context.isExpanded && 'rct-tree-item-arrow-expanded', 'rct-tree-item-arrow')
            }, context.arrowProps), item.isFolder && (context.isExpanded ? React.createElement("svg", {
              version: "1.1",
              xmlns: "http://www.w3.org/2000/svg",
              xmlnsXlink: "http://www.w3.org/1999/xlink",
              x: "0px",
              y: "0px",
              viewBox: "0 0 16 16",
              enableBackground: "new 0 0 16 16",
              xmlSpace: "preserve"
            }, React.createElement("g", null, React.createElement("g", null, React.createElement("path", {
              fillRule: "evenodd",
              clipRule: "evenodd",
              d: "M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z",
              className: "rct-tree-item-arrow-path"
            })))) : React.createElement("svg", {
              version: "1.1",
              xmlns: "http://www.w3.org/2000/svg",
              xmlnsXlink: "http://www.w3.org/1999/xlink",
              x: "0px",
              y: "0px",
              viewBox: "0 0 16 16",
              enableBackground: "new 0 0 16 16",
              xmlSpace: "preserve"
            }, React.createElement("g", null, React.createElement("g", null, React.createElement("path", {
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
          return React.createElement("li", __assign$8({}, context.itemContainerWithChildrenProps, {
            className: cx('rct-tree-item-li', item.isFolder && 'rct-tree-item-li-isFolder', context.isSelected && 'rct-tree-item-li-selected', context.isExpanded && 'rct-tree-item-li-expanded', context.isFocused && 'rct-tree-item-li-focused', context.isDraggingOver && 'rct-tree-item-li-dragging-over', context.isSearchMatching && 'rct-tree-item-li-search-match')
          }), React.createElement("div", __assign$8({}, context.itemContainerWithoutChildrenProps, {
            style: {
              '--depthOffset': "".concat((depth + 1) * renderDepthOffset, "px")
            },
            className: cx('rct-tree-item-title-container', item.isFolder && 'rct-tree-item-title-container-isFolder', context.isSelected && 'rct-tree-item-title-container-selected', context.isExpanded && 'rct-tree-item-title-container-expanded', context.isFocused && 'rct-tree-item-title-container-focused', context.isDraggingOver && 'rct-tree-item-title-container-dragging-over', context.isSearchMatching && 'rct-tree-item-title-container-search-match')
          }), arrow, React.createElement(InteractiveComponent, __assign$8({
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
          return React.createElement("form", __assign$8({}, formProps, {
            className: "rct-tree-item-renaming-form"
          }), React.createElement("input", __assign$8({}, inputProps, {
            ref: inputRef,
            className: "rct-tree-item-renaming-input"
          })), React.createElement("input", __assign$8({}, submitButtonProps, {
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
          return React.createElement("div", {
            className: cx('rct-tree-root', info.isFocused && 'rct-tree-root-focus', info.isRenaming && 'rct-tree-root-renaming', info.areItemsSelected && 'rct-tree-root-itemsselected', rtl && 'rct-rtl')
          }, React.createElement("div", __assign$8({}, containerProps, {
            style: __assign$8({
              minHeight: '30px'
            }, containerProps.style)
          }), children));
        },
        renderItemsContainer: function (_a) {
          var children = _a.children,
            containerProps = _a.containerProps;
          return React.createElement("ul", __assign$8({}, containerProps, {
            className: "rct-tree-items-container"
          }), children);
        },
        renderDragBetweenLine: function (_a) {
          var draggingPosition = _a.draggingPosition,
            lineProps = _a.lineProps;
          return React.createElement("div", __assign$8({}, lineProps, {
            style: {
              left: "".concat(draggingPosition.depth * renderDepthOffset, "px")
            },
            className: cx('rct-tree-drag-between-line', draggingPosition.targetType === 'between-items' && draggingPosition.linePosition === 'top' && 'rct-tree-drag-between-line-top', draggingPosition.targetType === 'between-items' && draggingPosition.linePosition === 'bottom' && 'rct-tree-drag-between-line-bottom')
          }));
        },
        renderSearchInput: function (_a) {
          var inputProps = _a.inputProps;
          return React.createElement("div", {
            className: cx('rct-tree-search-input-container')
          }, React.createElement("span", {
            className: "rct-tree-input-icon"
          }), React.createElement("input", __assign$8({}, inputProps, {
            className: cx('rct-tree-search-input')
          })));
        },
        renderLiveDescriptorContainer: function (_a) {
          var tree = _a.tree,
            children = _a.children;
          return React.createElement("div", {
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
      var defaultRenderers = React.useMemo(function () {
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
      var _b = React.useState({}),
        trees = _b[0],
        setTrees = _b[1];
      var _c = React.useState(),
        activeTreeId = _c[0],
        setActiveTreeId = _c[1];
      var treeIds = React.useMemo(function () {
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
      var linearItems = React.useMemo(function () {
        return buildMapForTrees(treeIds, function (treeId) {
          var _a;
          return getItemsLinearly(trees[treeId].rootItem, (_a = viewState[treeId]) !== null && _a !== void 0 ? _a : {}, items);
        });
      }, [trees, items, treeIds, viewState]);
      var onFocusItemHandler = React.useCallback(function (item, treeId, setDomFocus) {
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
      var registerTree = React.useCallback(function (tree) {
        setTrees(function (trees) {
          var _a;
          return __assign$7(__assign$7({}, trees), (_a = {}, _a[tree.treeId] = tree, _a));
        });
        onRegisterTree === null || onRegisterTree === void 0 ? void 0 : onRegisterTree(tree);
      }, [onRegisterTree]);
      var unregisterTree = React.useCallback(function (treeId) {
        onUnregisterTree === null || onUnregisterTree === void 0 ? void 0 : onUnregisterTree(trees[treeId]);
        delete trees[treeId];
        setTrees(trees);
      }, [onUnregisterTree, trees]);
      var onCollapseItem = React.useCallback(function (item, treeId) {
        onCollapseProp === null || onCollapseProp === void 0 ? void 0 : onCollapseProp(item, treeId);
        setTrees(function (trees) {
          return trees;
        });
      }, [onCollapseProp]);
      var onExpandItem = React.useCallback(function (item, treeId) {
        onExpandItemProp === null || onExpandItemProp === void 0 ? void 0 : onExpandItemProp(item, treeId);
        setTrees(function (trees) {
          return trees;
        });
      }, [onExpandItemProp]);
      var onDrop = React.useCallback(function (items, target) {
        onDropProp === null || onDropProp === void 0 ? void 0 : onDropProp(items, target);
        setTrees(function (trees) {
          return trees;
        });
      }, [onDropProp]);
      var focusTree = React.useCallback(function (treeId) {
        var _a, _b;
        var focusItem = (_a = getDocument()) === null || _a === void 0 ? void 0 : _a.querySelector("[data-rct-tree=\"".concat(treeId, "\"] [data-rct-item-focus=\"true\"]"));
        (_b = focusItem === null || focusItem === void 0 ? void 0 : focusItem.focus) === null || _b === void 0 ? void 0 : _b.call(focusItem);
      }, []);
      var setActiveTree = React.useCallback(function (treeIdOrSetStateFunction, autoFocusTree) {
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
    var TreeEnvironmentContext = React__namespace.createContext(null);
    var useTreeEnvironment = function () {
      return React.useContext(TreeEnvironmentContext);
    };
    var ControlledTreeEnvironment = React__namespace.forwardRef(function (props, ref) {
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
      return React__namespace.createElement(TreeEnvironmentContext.Provider, {
        value: environmentContextProps
      }, React__namespace.createElement(InteractionManagerProvider, null, React__namespace.createElement(DragAndDropProvider, null, React__namespace.createElement(EnvironmentActionsProvider, {
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
      return React__namespace.createElement("div", {
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
      React.useEffect(function () {
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
      var _a = React.useState(false),
        focusWithin = _a[0],
        setFocusWithin = _a[1];
      var isLoosingFocusFlag = React.useRef(false);
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
      return React.useMemo(function () {
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
      var pressedKeys = React.useRef([]);
      var keyboardBindings = useKeyboardBindings();
      var callSoon = useCallSoon();
      var possibleCombinations = React.useMemo(function () {
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
      var ref = React.useRef({
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
      return React.useCallback(function (item, overrideOldSelection) {
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
      return React__namespace.createElement("div", {
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
      var descriptors = React.useMemo(function () {
        var _a;
        return (_a = env.liveDescriptors) !== null && _a !== void 0 ? _a : defaultLiveDescriptors;
      }, [env.liveDescriptors]);
      var MainWrapper = tree.renderers.renderLiveDescriptorContainer;
      if (tree.treeInformation.isRenaming) {
        return React__namespace.createElement(MainWrapper, {
          tree: tree
        }, React__namespace.createElement(LiveWrapper, {
          live: "polite"
        }, resolveLiveDescriptor(descriptors.renamingItem, env, dnd, tree, keys)));
      }
      if (tree.treeInformation.isSearching) {
        return React__namespace.createElement(MainWrapper, {
          tree: tree
        }, React__namespace.createElement(LiveWrapper, {
          live: "polite"
        }, resolveLiveDescriptor(descriptors.searching, env, dnd, tree, keys)));
      }
      if (tree.treeInformation.isProgrammaticallyDragging) {
        return React__namespace.createElement(MainWrapper, {
          tree: tree
        }, React__namespace.createElement(LiveWrapper, {
          live: "polite"
        }, resolveLiveDescriptor(descriptors.programmaticallyDragging, env, dnd, tree, keys)), React__namespace.createElement(LiveWrapper, {
          live: "assertive"
        }, resolveLiveDescriptor(descriptors.programmaticallyDraggingTarget, env, dnd, tree, keys)));
      }
      return React__namespace.createElement(MainWrapper, {
        tree: tree
      }, React__namespace.createElement(LiveWrapper, {
        live: "off"
      }, resolveLiveDescriptor(descriptors.introduction, env, dnd, tree, keys)));
    };

    var MaybeLiveDescription = function () {
      var _a;
      var env = useTreeEnvironment();
      if (!((_a = env.showLiveDescription) !== null && _a !== void 0 ? _a : true)) {
        return null;
      }
      return React__namespace.createElement(LiveDescription, null);
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
      var containerRef = React.useRef();
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
      var treeChildren = React__namespace.createElement(React__namespace.Fragment, null, React__namespace.createElement(MaybeLiveDescription, null), React__namespace.createElement(TreeItemChildren, {
        depth: 0,
        parentId: rootItem
      }, rootChildren !== null && rootChildren !== void 0 ? rootChildren : []), React__namespace.createElement(DragBetweenLine, {
        treeId: treeId
      }), React__namespace.createElement(SearchInput, {
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
      return React.useMemo(function () {
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
      React.useImperativeHandle(ref, function () {
        return __assign$2(__assign$2(__assign$2({}, actions), {
          treeEnvironmentContext: environment,
          dragAndDropContext: dnd,
          treeContext: tree
        }), tree.treeInformation);
      });
    };

    var EnvironmentActionsContext = React__namespace.createContext(null);
    var TreeActionsProvider = React__namespace.forwardRef(function (props, ref) {
      useTreeEnvironment();
      var tree = useTree();
      useDragAndDrop();
      var envActions = useEnvironmentActions();
      // TODO change tree childs to use actions rather than output events where possible
      // TODO maybe replace with stable handlers
      var actions = React.useMemo(function () {
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
      return React__namespace.createElement(EnvironmentActionsContext.Provider, {
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
    var TreeContext = React__namespace.createContext(null); // TODO default value
    var useTree = function () {
      return React.useContext(TreeContext);
    };
    var Tree = React__namespace.forwardRef(function (props, ref) {
      var _a;
      var environment = useTreeEnvironment();
      var renderers = React.useMemo(function () {
        return __assign$1(__assign$1({}, environment), props);
      }, [props, environment]);
      var _b = React.useState(null),
        search = _b[0],
        setSearch = _b[1];
      var _c = React.useState(null),
        renamingItem = _c[0],
        setRenamingItem = _c[1];
      var rootItem = environment.items[props.rootItem];
      var viewState = environment.viewState[props.treeId];
      React.useEffect(function () {
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
      var treeContextProps = React.useMemo(function () {
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
      return React__namespace.createElement(TreeContext.Provider, {
        value: treeContextProps
      }, React__namespace.createElement(TreeActionsProvider, {
        ref: ref
      }, React__namespace.createElement(TreeManager, null)));
    });

    var TreeItemChildren = function (props) {
      var _a = useTree(),
        renderers = _a.renderers,
        treeInformation = _a.treeInformation;
      var childElements = [];
      for (var _i = 0, _b = props.children; _i < _b.length; _i++) {
        var child = _b[_i];
        childElements.push(React.createElement(TreeItemElement, {
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
      var isSearchMatching = React.useMemo(function () {
        var _a;
        return search === null || search.length === 0 || !item || !itemTitle ? false : ((_a = environment.doesSearchMatchItem) !== null && _a !== void 0 ? _a : defaultMatcher)(search, item, itemTitle);
      }, [search, item, itemTitle, environment.doesSearchMatchItem]);
      var isSelected = item && ((_b = (_a = environment.viewState[treeId]) === null || _a === void 0 ? void 0 : _a.selectedItems) === null || _b === void 0 ? void 0 : _b.includes(item.index));
      var isExpanded = item && ((_d = (_c = environment.viewState[treeId]) === null || _c === void 0 ? void 0 : _c.expandedItems) === null || _d === void 0 ? void 0 : _d.includes(item.index));
      var isRenaming = item && renamingItem === item.index;
      return React.useMemo(function () {
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
      var inputRef = React.useRef(null);
      var submitButtonRef = React.useRef(null);
      var item = environment.items[props.itemIndex];
      var _b = React.useState(environment.getItemTitle(item)),
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
      var _e = React.useState(false),
        hasBeenRequested = _e[0],
        setHasBeenRequested = _e[1];
      var _f = useTree(),
        renderers = _f.renderers,
        treeInformation = _f.treeInformation,
        renamingItem = _f.renamingItem;
      var environment = useTreeEnvironment();
      var viewState = useViewState();
      var item = environment.items[props.itemIndex];
      var isExpanded = React.useMemo(function () {
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
      var children = item.children && shouldRenderChildren && React.createElement(TreeItemChildren, {
        depth: props.depth + 1,
        parentId: props.itemIndex
      }, item.children);
      var title = environment.getItemTitle(item);
      var titleComponent = renamingItem === props.itemIndex ? React.createElement(TreeItemRenamingInput, {
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
    }) => React.createElement("span", {
      className: "folder-icon"
    }, isOpen ? React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, React.createElement("path", {
      d: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2v11z"
    }), React.createElement("line", {
      x1: "9",
      y1: "14",
      x2: "15",
      y2: "14"
    })) : React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, React.createElement("path", {
      d: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2v11z"
    })));
    const FileIcon = ({
      fileType
    }) => {
      // 파일 타입에 따라 다른 아이콘 표시
      const getFileIcon = () => {
        switch (fileType) {
          case 'pptx':
            return React.createElement("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              width: "16",
              height: "16",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "#FF5733",
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }, React.createElement("path", {
              d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
            }), React.createElement("polyline", {
              points: "14 2 14 8 20 8"
            }), React.createElement("text", {
              x: "8",
              y: "19",
              fontSize: "8",
              fill: "#FF5733"
            }, "PPT"));
          case 'xlsx':
            return React.createElement("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              width: "16",
              height: "16",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "#2E7D32",
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }, React.createElement("path", {
              d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
            }), React.createElement("polyline", {
              points: "14 2 14 8 20 8"
            }), React.createElement("text", {
              x: "9",
              y: "19",
              fontSize: "8",
              fill: "#2E7D32"
            }, "XL"));
          case 'docx':
            return React.createElement("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              width: "16",
              height: "16",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "#2196F3",
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }, React.createElement("path", {
              d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
            }), React.createElement("polyline", {
              points: "14 2 14 8 20 8"
            }), React.createElement("text", {
              x: "9",
              y: "19",
              fontSize: "8",
              fill: "#2196F3"
            }, "DOC"));
          case 'pdf':
            return React.createElement("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              width: "16",
              height: "16",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "#F44336",
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }, React.createElement("path", {
              d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
            }), React.createElement("polyline", {
              points: "14 2 14 8 20 8"
            }), React.createElement("text", {
              x: "8",
              y: "19",
              fontSize: "8",
              fill: "#F44336"
            }, "PDF"));
          default:
            return React.createElement("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              width: "16",
              height: "16",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }, React.createElement("path", {
              d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
            }), React.createElement("polyline", {
              points: "14 2 14 8 20 8"
            }));
        }
      };
      return React.createElement("span", {
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
      const [treeData, dispatch] = React.useReducer(treeDataReducer, null);
      const [focusedItem, setFocusedItem] = React.useState();
      const [expandedItems, setExpandedItems] = React.useState([]);
      const [selectedItems, setSelectedItems] = React.useState([]);

      // 여기에 renderItemTitle 함수를 추가
      const renderItemTitle = item => {
        const fileExtension = item.data.name ? item.data.name.split('.').pop().toLowerCase() : '';
        return React.createElement("div", {
          className: "tree-item-content"
        }, item.isFolder ? React.createElement(FolderIcon, {
          isOpen: expandedItems.includes(item.index)
        }) : React.createElement(FileIcon, {
          fileType: fileExtension
        }), React.createElement("span", {
          className: "item-text"
        }, item.data.name));
      };
      console.log("treeData", treeData);
      console.dir("treeData", treeData);
      const onSelectionChangedHandler = React.useCallback(items => {
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
      const onExpandItemHandler = React.useCallback(item => {
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
      const onCollapseAllButtonClick = React.useCallback(() => {
        setExpandedItems([]); // 축소 시키니깐 확장되는건 없으니 빈 배열의 값으로 설정정
      }, []);

      // 확장 진행
      const onExpandAllButtonClick = React.useCallback(() => {
        const expandableItemIDs = [];
        for (const itemID in treeData.data) {
          if (treeData.data[itemID].children) {
            expandableItemIDs.push(itemID);
          }
        }
        setExpandedItems(expandableItemIDs);
      }, [treeData?.data]);

      // tree속성내 node의 이름 설정
      const onRenameNodeHandler = React.useCallback((item, newName) => {
        onNodeRenamed(item.index, newName);
      }, [onNodeRenamed]);

      // 마우스 드랍이벤트
      const onDropHandler = React.useCallback((items, target) => {
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
      const canDragHandler = React.useCallback(items => {
        if (!items || items.length === 0) {
          return true;
        }
        if (items.length === 1) {
          return items[0].canMove;
        }
        const firstParentID = items[0].data.parentID;
        return items.every(item => item.data.parentID === firstParentID && item.canMove);
      }, []);
      const canDropAtHandler = React.useCallback((items, target) => {
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
      React.useEffect(() => {
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
        return React.createElement("div", {
          className: className + " nodata"
        });
      }
      const treeName = "tree-" + widgetName;
      const interactionMode = toggleExpandedIconOnly ? "click-arrow-to-expand" : "click-item-to-expand";
      console.log("트리 데이터 CHILD 이름", treeName);
      console.log("트리 데이터 CHILD 값", treeData?.data);
      return React.createElement("div", {
        className: className
      }, React.createElement("div", {
        className: "tree-widget-button-container"
      }, React.createElement("button", {
        id: "buttonCollapseAll",
        className: collapseAllButtonClass,
        onClick: onCollapseAllButtonClick
      }, collapseAllButtonIcon && React.createElement(Icon.Icon, {
        icon: collapseAllButtonIcon
      }), React.createElement("span", null, collapseAllButtonCaption ? collapseAllButtonCaption : "")), showExpandAllButton && React.createElement("button", {
        id: "buttonExpandAll",
        className: expandAllButtonClass,
        onClick: onExpandAllButtonClick
      }, expandAllButtonIcon && React.createElement(Icon.Icon, {
        icon: expandAllButtonIcon
      }), React.createElement("span", null, expandAllButtonCaption ? expandAllButtonCaption : ""))), React.createElement(ControlledTreeEnvironment, {
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
      }, React.createElement(Tree, {
        treeId: treeName,
        rootItem: "root"
      })));
    }

    /* eslint-disable no-trailing-spaces */
    /* eslint-disable prettier/prettier */
    function ReactComplexTreeWidget(props) {
      const logMessageToConsole = React.useCallback(message => {
        console.info(props.name + " " + new Date().toISOString() + " " + message);
      }, [props.name]);
      const {
        onSelectionChangedAction,
        selectedNodeIDsAttr
      } = props;
      const onSelectionChangedHandler = React.useCallback(selectedItemIDs => {
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
      const onMissingNodesHandler = React.useCallback(missingItemIDs => {
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
      const onNodeRenamedHandler = React.useCallback((nodeID, newName) => {
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
      const onDropHandler = React.useCallback((droppedNodeIDs, target) => {
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
      return React.createElement(TreeContainer, {
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

    exports.ReactComplexTreeWidget = ReactComplexTreeWidget;

}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVhY3RDb21wbGV4VHJlZVdpZGdldC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWNvbXBsZXgtdHJlZS9saWIvZXNtL3R5cGVzLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWNvbXBsZXgtdHJlZS9saWIvZXNtL2NvbnRyb2xsZWRFbnZpcm9ubWVudC9tZXJnZUludGVyYWN0aW9uTWFuYWdlcnMuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtY29tcGxleC10cmVlL2xpYi9lc20vaXNDb250cm9sS2V5LmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWNvbXBsZXgtdHJlZS9saWIvZXNtL2ludGVyYWN0aW9uTW9kZS9Eb3VibGVDbGlja0l0ZW1Ub0V4cGFuZEludGVyYWN0aW9uTWFuYWdlci5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1jb21wbGV4LXRyZWUvbGliL2VzbS9pbnRlcmFjdGlvbk1vZGUvQ2xpY2tJdGVtVG9FeHBhbmRJbnRlcmFjdGlvbk1hbmFnZXIuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtY29tcGxleC10cmVlL2xpYi9lc20vaW50ZXJhY3Rpb25Nb2RlL0NsaWNrQXJyb3dUb0V4cGFuZEludGVyYWN0aW9uTWFuYWdlci5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1jb21wbGV4LXRyZWUvbGliL2VzbS9jb250cm9sbGVkRW52aXJvbm1lbnQvYnVpbGRJbnRlcmFjdGlvbk1vZGUuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtY29tcGxleC10cmVlL2xpYi9lc20vY29udHJvbGxlZEVudmlyb25tZW50L0ludGVyYWN0aW9uTWFuYWdlclByb3ZpZGVyLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWNvbXBsZXgtdHJlZS9saWIvZXNtL2RyYWcvdXNlQ2FuRHJvcEF0LmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWNvbXBsZXgtdHJlZS9saWIvZXNtL2RyYWcvdXNlR2V0UGFyZW50T2ZMaW5lYXJJdGVtLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWNvbXBsZXgtdHJlZS9saWIvZXNtL2RyYWcvdXNlR2V0VmlhYmxlRHJhZ1Bvc2l0aW9ucy5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1jb21wbGV4LXRyZWUvbGliL2VzbS91c2VTaWRlRWZmZWN0LmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWNvbXBsZXgtdHJlZS9saWIvZXNtL3V0aWxzLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWNvbXBsZXgtdHJlZS9saWIvZXNtL3VzZUNhbGxTb29uLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWNvbXBsZXgtdHJlZS9saWIvZXNtL3VzZVJlZkNvcHkuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtY29tcGxleC10cmVlL2xpYi9lc20vdXNlU3RhYmxlSGFuZGxlci5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1jb21wbGV4LXRyZWUvbGliL2VzbS91c2VHZXRPcmlnaW5hbEl0ZW1PcmRlci5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1jb21wbGV4LXRyZWUvbGliL2VzbS9jb250cm9sbGVkRW52aXJvbm1lbnQvbGF5b3V0VXRpbHMuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtY29tcGxleC10cmVlL2xpYi9lc20vZHJhZy9EcmFnZ2luZ1Bvc2l0aW9uRXZhbHVhdGlvbi5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1jb21wbGV4LXRyZWUvbGliL2VzbS9kcmFnL3VzZURyYWdnaW5nUG9zaXRpb24uanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtY29tcGxleC10cmVlL2xpYi9lc20vZHJhZy9EcmFnQW5kRHJvcFByb3ZpZGVyLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWNvbXBsZXgtdHJlZS9saWIvZXNtL2Vudmlyb25tZW50QWN0aW9ucy91c2VDcmVhdGVkRW52aXJvbm1lbnRSZWYuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtY29tcGxleC10cmVlL2xpYi9lc20vd2FpdEZvci5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1jb21wbGV4LXRyZWUvbGliL2VzbS9lbnZpcm9ubWVudEFjdGlvbnMvRW52aXJvbm1lbnRBY3Rpb25zUHJvdmlkZXIuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtY29tcGxleC10cmVlL2xpYi9lc20vdHJlZS9zY3JvbGxJbnRvVmlldy5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1jb21wbGV4LXRyZWUvbGliL2VzbS9yZW5kZXJlcnMvY3JlYXRlRGVmYXVsdFJlbmRlcmVycy5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1jb21wbGV4LXRyZWUvbGliL2VzbS9yZW5kZXJlcnMvdXNlUmVuZGVyZXJzLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWNvbXBsZXgtdHJlZS9saWIvZXNtL3RyZWUvZ2V0SXRlbXNMaW5lYXJseS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1jb21wbGV4LXRyZWUvbGliL2VzbS9jb250cm9sbGVkRW52aXJvbm1lbnQvdXNlQ29udHJvbGxlZFRyZWVFbnZpcm9ubWVudFByb3BzLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWNvbXBsZXgtdHJlZS9saWIvZXNtL2NvbnRyb2xsZWRFbnZpcm9ubWVudC9Db250cm9sbGVkVHJlZUVudmlyb25tZW50LmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWNvbXBsZXgtdHJlZS9saWIvZXNtL3RyZWUvRHJhZ0JldHdlZW5MaW5lLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWNvbXBsZXgtdHJlZS9saWIvZXNtL3VzZUh0bWxFbGVtZW50RXZlbnRMaXN0ZW5lci5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1jb21wbGV4LXRyZWUvbGliL2VzbS90cmVlL3VzZUZvY3VzV2l0aGluLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWNvbXBsZXgtdHJlZS9saWIvZXNtL2hvdGtleXMvdXNlS2V5LmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWNvbXBsZXgtdHJlZS9saWIvZXNtL2hvdGtleXMvZGVmYXVsdEtleWJvYXJkQmluZGluZ3MuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtY29tcGxleC10cmVlL2xpYi9lc20vaG90a2V5cy91c2VLZXlib2FyZEJpbmRpbmdzLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWNvbXBsZXgtdHJlZS9saWIvZXNtL2hvdGtleXMvdXNlSG90a2V5LmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWNvbXBsZXgtdHJlZS9saWIvZXNtL3RyZWUvdXNlVmlld1N0YXRlLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWNvbXBsZXgtdHJlZS9saWIvZXNtL2NvbnRyb2xsZWRFbnZpcm9ubWVudC91c2VMaW5lYXJJdGVtcy5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1jb21wbGV4LXRyZWUvbGliL2VzbS90cmVlL3VzZU1vdmVGb2N1c1RvSW5kZXguanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtY29tcGxleC10cmVlL2xpYi9lc20vdHJlZS91c2VTZWxlY3RVcFRvLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWNvbXBsZXgtdHJlZS9saWIvZXNtL3RyZWUvdXNlVHJlZUtleWJvYXJkQmluZGluZ3MuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtY29tcGxleC10cmVlL2xpYi9lc20vc2VhcmNoL2RlZmF1bHRNYXRjaGVyLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWNvbXBsZXgtdHJlZS9saWIvZXNtL3NlYXJjaC91c2VTZWFyY2hNYXRjaEZvY3VzLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWNvbXBsZXgtdHJlZS9saWIvZXNtL3NlYXJjaC9TZWFyY2hJbnB1dC5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1jb21wbGV4LXRyZWUvbGliL2VzbS90cmVlL2RlZmF1bHRMaXZlRGVzY3JpcHRvcnMuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtY29tcGxleC10cmVlL2xpYi9lc20vdHJlZS9yZXNvbHZlTGl2ZURlc2NyaXB0b3IuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtY29tcGxleC10cmVlL2xpYi9lc20vdHJlZS9MaXZlRGVzY3JpcHRpb24uanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtY29tcGxleC10cmVlL2xpYi9lc20vdHJlZS9NYXliZUxpdmVEZXNjcmlwdGlvbi5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1jb21wbGV4LXRyZWUvbGliL2VzbS90cmVlL1RyZWVNYW5hZ2VyLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWNvbXBsZXgtdHJlZS9saWIvZXNtL3RyZWUvdXNlQ3JlYXRlZFRyZWVJbmZvcm1hdGlvbi5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1jb21wbGV4LXRyZWUvbGliL2VzbS90cmVlQWN0aW9ucy91c2VDcmVhdGVkVHJlZVJlZi5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1jb21wbGV4LXRyZWUvbGliL2VzbS90cmVlQWN0aW9ucy9UcmVlQWN0aW9uc1Byb3ZpZGVyLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWNvbXBsZXgtdHJlZS9saWIvZXNtL3RyZWUvVHJlZS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1jb21wbGV4LXRyZWUvbGliL2VzbS90cmVlSXRlbS9UcmVlSXRlbUNoaWxkcmVuLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWNvbXBsZXgtdHJlZS9saWIvZXNtL3RyZWVJdGVtL3VzZVRyZWVJdGVtUmVuZGVyQ29udGV4dC5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1jb21wbGV4LXRyZWUvbGliL2VzbS90cmVlSXRlbS9UcmVlSXRlbVJlbmFtaW5nSW5wdXQuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtY29tcGxleC10cmVlL2xpYi9lc20vdHJlZUl0ZW0vVHJlZUl0ZW1FbGVtZW50LmpzIiwiLi4vLi4vLi4vLi4vLi4vc3JjL3V0aWxzL3RyZWVEYXRhUmVkdWNlci5qcyIsIi4uLy4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1RyZWVDb250YWluZXIuanN4IiwiLi4vLi4vLi4vLi4vLi4vc3JjL1JlYWN0Q29tcGxleFRyZWVXaWRnZXQuanN4Il0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCB2YXIgSW50ZXJhY3Rpb25Nb2RlO1xuKGZ1bmN0aW9uIChJbnRlcmFjdGlvbk1vZGUpIHtcbiAgICBJbnRlcmFjdGlvbk1vZGVbXCJEb3VibGVDbGlja0l0ZW1Ub0V4cGFuZFwiXSA9IFwiZG91YmxlLWNsaWNrLWl0ZW0tdG8tZXhwYW5kXCI7XG4gICAgSW50ZXJhY3Rpb25Nb2RlW1wiQ2xpY2tJdGVtVG9FeHBhbmRcIl0gPSBcImNsaWNrLWl0ZW0tdG8tZXhwYW5kXCI7XG4gICAgSW50ZXJhY3Rpb25Nb2RlW1wiQ2xpY2tBcnJvd1RvRXhwYW5kXCJdID0gXCJjbGljay1hcnJvdy10by1leHBhbmRcIjtcbn0pKEludGVyYWN0aW9uTW9kZSB8fCAoSW50ZXJhY3Rpb25Nb2RlID0ge30pKTtcbiIsInZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IGZ1bmN0aW9uICgpIHtcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXG4gICAgICAgICAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5leHBvcnQgdmFyIG1lcmdlSW50ZXJhY3Rpb25NYW5hZ2VycyA9IGZ1bmN0aW9uIChtYWluLCBmYWxsYmFjaykgeyByZXR1cm4gKHtcbiAgICBtb2RlOiBtYWluLm1vZGUsXG4gICAgY3JlYXRlSW50ZXJhY3RpdmVFbGVtZW50UHJvcHM6IGZ1bmN0aW9uIChpdGVtLCB0cmVlSWQsIGFjdGlvbnMsIHJlbmRlckZsYWdzKSB7IHJldHVybiAoX19hc3NpZ24oX19hc3NpZ24oe30sIGZhbGxiYWNrLmNyZWF0ZUludGVyYWN0aXZlRWxlbWVudFByb3BzKGl0ZW0sIHRyZWVJZCwgYWN0aW9ucywgcmVuZGVyRmxhZ3MpKSwgbWFpbi5jcmVhdGVJbnRlcmFjdGl2ZUVsZW1lbnRQcm9wcyhpdGVtLCB0cmVlSWQsIGFjdGlvbnMsIHJlbmRlckZsYWdzKSkpOyB9LFxufSk7IH07XG4iLCJleHBvcnQgdmFyIGlzQ29udHJvbEtleSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgcmV0dXJuIGUuY3RybEtleSB8fFxuICAgICAgICAobmF2aWdhdG9yLnBsYXRmb3JtLnRvVXBwZXJDYXNlKCkuaW5kZXhPZignTUFDJykgPj0gMCAmJiBlLm1ldGFLZXkpO1xufTtcbiIsImltcG9ydCB7IEludGVyYWN0aW9uTW9kZSwgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBpc0NvbnRyb2xLZXkgfSBmcm9tICcuLi9pc0NvbnRyb2xLZXknO1xudmFyIERvdWJsZUNsaWNrSXRlbVRvRXhwYW5kSW50ZXJhY3Rpb25NYW5hZ2VyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIERvdWJsZUNsaWNrSXRlbVRvRXhwYW5kSW50ZXJhY3Rpb25NYW5hZ2VyKGVudmlyb25tZW50KSB7XG4gICAgICAgIHRoaXMubW9kZSA9IEludGVyYWN0aW9uTW9kZS5Eb3VibGVDbGlja0l0ZW1Ub0V4cGFuZDtcbiAgICAgICAgdGhpcy5lbnZpcm9ubWVudCA9IGVudmlyb25tZW50O1xuICAgIH1cbiAgICBEb3VibGVDbGlja0l0ZW1Ub0V4cGFuZEludGVyYWN0aW9uTWFuYWdlci5wcm90b3R5cGUuY3JlYXRlSW50ZXJhY3RpdmVFbGVtZW50UHJvcHMgPSBmdW5jdGlvbiAoaXRlbSwgdHJlZUlkLCBhY3Rpb25zLCByZW5kZXJGbGFncykge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgb25DbGljazogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBhY3Rpb25zLmZvY3VzSXRlbSgpO1xuICAgICAgICAgICAgICAgIGlmIChlLnNoaWZ0S2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbnMuc2VsZWN0VXBUbyghaXNDb250cm9sS2V5KGUpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoaXNDb250cm9sS2V5KGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZW5kZXJGbGFncy5pc1NlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb25zLnVuc2VsZWN0SXRlbSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9ucy5hZGRUb1NlbGVjdGVkSXRlbXMoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9ucy5zZWxlY3RJdGVtKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uRG91YmxlQ2xpY2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBhY3Rpb25zLmZvY3VzSXRlbSgpO1xuICAgICAgICAgICAgICAgIGFjdGlvbnMuc2VsZWN0SXRlbSgpO1xuICAgICAgICAgICAgICAgIGlmIChpdGVtLmlzRm9sZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbnMudG9nZ2xlRXhwYW5kZWRTdGF0ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWl0ZW0uaXNGb2xkZXIgfHxcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuZW52aXJvbm1lbnQuY2FuSW52b2tlUHJpbWFyeUFjdGlvbk9uSXRlbUNvbnRhaW5lcikge1xuICAgICAgICAgICAgICAgICAgICBhY3Rpb25zLnByaW1hcnlBY3Rpb24oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25Gb2N1czogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGFjdGlvbnMuZm9jdXNJdGVtKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25EcmFnU3RhcnQ6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgZS5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9ICdtb3ZlJztcbiAgICAgICAgICAgICAgICBhY3Rpb25zLnN0YXJ0RHJhZ2dpbmcoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvbkRyYWdPdmVyOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTsgLy8gQWxsb3cgZHJvcFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRyYWdnYWJsZTogcmVuZGVyRmxhZ3MuY2FuRHJhZyAmJiAhcmVuZGVyRmxhZ3MuaXNSZW5hbWluZyxcbiAgICAgICAgICAgIHRhYkluZGV4OiAhcmVuZGVyRmxhZ3MuaXNSZW5hbWluZ1xuICAgICAgICAgICAgICAgID8gcmVuZGVyRmxhZ3MuaXNGb2N1c2VkXG4gICAgICAgICAgICAgICAgICAgID8gMFxuICAgICAgICAgICAgICAgICAgICA6IC0xXG4gICAgICAgICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgIH07XG4gICAgfTtcbiAgICByZXR1cm4gRG91YmxlQ2xpY2tJdGVtVG9FeHBhbmRJbnRlcmFjdGlvbk1hbmFnZXI7XG59KCkpO1xuZXhwb3J0IHsgRG91YmxlQ2xpY2tJdGVtVG9FeHBhbmRJbnRlcmFjdGlvbk1hbmFnZXIgfTtcbiIsImltcG9ydCB7IEludGVyYWN0aW9uTW9kZSwgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBpc0NvbnRyb2xLZXkgfSBmcm9tICcuLi9pc0NvbnRyb2xLZXknO1xudmFyIENsaWNrSXRlbVRvRXhwYW5kSW50ZXJhY3Rpb25NYW5hZ2VyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENsaWNrSXRlbVRvRXhwYW5kSW50ZXJhY3Rpb25NYW5hZ2VyKGVudmlyb25tZW50KSB7XG4gICAgICAgIHRoaXMubW9kZSA9IEludGVyYWN0aW9uTW9kZS5DbGlja0l0ZW1Ub0V4cGFuZDtcbiAgICAgICAgdGhpcy5lbnZpcm9ubWVudCA9IGVudmlyb25tZW50O1xuICAgIH1cbiAgICBDbGlja0l0ZW1Ub0V4cGFuZEludGVyYWN0aW9uTWFuYWdlci5wcm90b3R5cGUuY3JlYXRlSW50ZXJhY3RpdmVFbGVtZW50UHJvcHMgPSBmdW5jdGlvbiAoaXRlbSwgdHJlZUlkLCBhY3Rpb25zLCByZW5kZXJGbGFncykge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgb25DbGljazogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBhY3Rpb25zLmZvY3VzSXRlbSgpO1xuICAgICAgICAgICAgICAgIGlmIChlLnNoaWZ0S2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbnMuc2VsZWN0VXBUbyghaXNDb250cm9sS2V5KGUpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoaXNDb250cm9sS2V5KGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZW5kZXJGbGFncy5pc1NlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb25zLnVuc2VsZWN0SXRlbSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9ucy5hZGRUb1NlbGVjdGVkSXRlbXMoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uaXNGb2xkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbnMudG9nZ2xlRXhwYW5kZWRTdGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbnMuc2VsZWN0SXRlbSgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWl0ZW0uaXNGb2xkZXIgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmVudmlyb25tZW50LmNhbkludm9rZVByaW1hcnlBY3Rpb25Pbkl0ZW1Db250YWluZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbnMucHJpbWFyeUFjdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uRm9jdXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBhY3Rpb25zLmZvY3VzSXRlbSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uRHJhZ1N0YXJ0OiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGUuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSAnbW92ZSc7XG4gICAgICAgICAgICAgICAgYWN0aW9ucy5zdGFydERyYWdnaW5nKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25EcmFnT3ZlcjogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7IC8vIEFsbG93IGRyb3BcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkcmFnZ2FibGU6IHJlbmRlckZsYWdzLmNhbkRyYWcgJiYgIXJlbmRlckZsYWdzLmlzUmVuYW1pbmcsXG4gICAgICAgICAgICB0YWJJbmRleDogIXJlbmRlckZsYWdzLmlzUmVuYW1pbmdcbiAgICAgICAgICAgICAgICA/IHJlbmRlckZsYWdzLmlzRm9jdXNlZFxuICAgICAgICAgICAgICAgICAgICA/IDBcbiAgICAgICAgICAgICAgICAgICAgOiAtMVxuICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgICB9O1xuICAgIH07XG4gICAgcmV0dXJuIENsaWNrSXRlbVRvRXhwYW5kSW50ZXJhY3Rpb25NYW5hZ2VyO1xufSgpKTtcbmV4cG9ydCB7IENsaWNrSXRlbVRvRXhwYW5kSW50ZXJhY3Rpb25NYW5hZ2VyIH07XG4iLCJpbXBvcnQgeyBJbnRlcmFjdGlvbk1vZGUsIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgaXNDb250cm9sS2V5IH0gZnJvbSAnLi4vaXNDb250cm9sS2V5JztcbnZhciBDbGlja0Fycm93VG9FeHBhbmRJbnRlcmFjdGlvbk1hbmFnZXIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ2xpY2tBcnJvd1RvRXhwYW5kSW50ZXJhY3Rpb25NYW5hZ2VyKGVudmlyb25tZW50KSB7XG4gICAgICAgIHRoaXMubW9kZSA9IEludGVyYWN0aW9uTW9kZS5DbGlja0l0ZW1Ub0V4cGFuZDtcbiAgICAgICAgdGhpcy5lbnZpcm9ubWVudCA9IGVudmlyb25tZW50O1xuICAgIH1cbiAgICBDbGlja0Fycm93VG9FeHBhbmRJbnRlcmFjdGlvbk1hbmFnZXIucHJvdG90eXBlLmNyZWF0ZUludGVyYWN0aXZlRWxlbWVudFByb3BzID0gZnVuY3Rpb24gKGl0ZW0sIHRyZWVJZCwgYWN0aW9ucywgcmVuZGVyRmxhZ3MpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9uQ2xpY2s6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgYWN0aW9ucy5mb2N1c0l0ZW0oKTtcbiAgICAgICAgICAgICAgICBpZiAoZS5zaGlmdEtleSkge1xuICAgICAgICAgICAgICAgICAgICBhY3Rpb25zLnNlbGVjdFVwVG8oIWlzQ29udHJvbEtleShlKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGlzQ29udHJvbEtleShlKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVuZGVyRmxhZ3MuaXNTZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9ucy51bnNlbGVjdEl0ZW0oKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbnMuYWRkVG9TZWxlY3RlZEl0ZW1zKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbnMuc2VsZWN0SXRlbSgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWl0ZW0uaXNGb2xkZXIgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmVudmlyb25tZW50LmNhbkludm9rZVByaW1hcnlBY3Rpb25Pbkl0ZW1Db250YWluZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbnMucHJpbWFyeUFjdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uRm9jdXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBhY3Rpb25zLmZvY3VzSXRlbSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uRHJhZ1N0YXJ0OiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGUuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSAnbW92ZSc7XG4gICAgICAgICAgICAgICAgYWN0aW9ucy5zdGFydERyYWdnaW5nKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25EcmFnT3ZlcjogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7IC8vIEFsbG93IGRyb3BcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkcmFnZ2FibGU6IHJlbmRlckZsYWdzLmNhbkRyYWcgJiYgIXJlbmRlckZsYWdzLmlzUmVuYW1pbmcsXG4gICAgICAgICAgICB0YWJJbmRleDogIXJlbmRlckZsYWdzLmlzUmVuYW1pbmdcbiAgICAgICAgICAgICAgICA/IHJlbmRlckZsYWdzLmlzRm9jdXNlZFxuICAgICAgICAgICAgICAgICAgICA/IDBcbiAgICAgICAgICAgICAgICAgICAgOiAtMVxuICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgICB9O1xuICAgIH07XG4gICAgcmV0dXJuIENsaWNrQXJyb3dUb0V4cGFuZEludGVyYWN0aW9uTWFuYWdlcjtcbn0oKSk7XG5leHBvcnQgeyBDbGlja0Fycm93VG9FeHBhbmRJbnRlcmFjdGlvbk1hbmFnZXIgfTtcbiIsImltcG9ydCB7IEludGVyYWN0aW9uTW9kZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IERvdWJsZUNsaWNrSXRlbVRvRXhwYW5kSW50ZXJhY3Rpb25NYW5hZ2VyIH0gZnJvbSAnLi4vaW50ZXJhY3Rpb25Nb2RlL0RvdWJsZUNsaWNrSXRlbVRvRXhwYW5kSW50ZXJhY3Rpb25NYW5hZ2VyJztcbmltcG9ydCB7IENsaWNrSXRlbVRvRXhwYW5kSW50ZXJhY3Rpb25NYW5hZ2VyIH0gZnJvbSAnLi4vaW50ZXJhY3Rpb25Nb2RlL0NsaWNrSXRlbVRvRXhwYW5kSW50ZXJhY3Rpb25NYW5hZ2VyJztcbmltcG9ydCB7IENsaWNrQXJyb3dUb0V4cGFuZEludGVyYWN0aW9uTWFuYWdlciB9IGZyb20gJy4uL2ludGVyYWN0aW9uTW9kZS9DbGlja0Fycm93VG9FeHBhbmRJbnRlcmFjdGlvbk1hbmFnZXInO1xuZXhwb3J0IHZhciBidWlsZEludGVyYWN0aW9uTW9kZSA9IGZ1bmN0aW9uIChtb2RlLCBlbnZpcm9ubWVudCkge1xuICAgIHN3aXRjaCAobW9kZSkge1xuICAgICAgICBjYXNlIEludGVyYWN0aW9uTW9kZS5Eb3VibGVDbGlja0l0ZW1Ub0V4cGFuZDpcbiAgICAgICAgICAgIHJldHVybiBuZXcgRG91YmxlQ2xpY2tJdGVtVG9FeHBhbmRJbnRlcmFjdGlvbk1hbmFnZXIoZW52aXJvbm1lbnQpO1xuICAgICAgICBjYXNlIEludGVyYWN0aW9uTW9kZS5DbGlja0l0ZW1Ub0V4cGFuZDpcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ2xpY2tJdGVtVG9FeHBhbmRJbnRlcmFjdGlvbk1hbmFnZXIoZW52aXJvbm1lbnQpO1xuICAgICAgICBjYXNlIEludGVyYWN0aW9uTW9kZS5DbGlja0Fycm93VG9FeHBhbmQ6XG4gICAgICAgICAgICByZXR1cm4gbmV3IENsaWNrQXJyb3dUb0V4cGFuZEludGVyYWN0aW9uTWFuYWdlcihlbnZpcm9ubWVudCk7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcIlVua25vd24gaW50ZXJhY3Rpb24gbW9kZSBcIi5jb25jYXQobW9kZSkpO1xuICAgIH1cbn07XG4iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VNZW1vIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgSW50ZXJhY3Rpb25Nb2RlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgdXNlVHJlZUVudmlyb25tZW50IH0gZnJvbSAnLi9Db250cm9sbGVkVHJlZUVudmlyb25tZW50JztcbmltcG9ydCB7IG1lcmdlSW50ZXJhY3Rpb25NYW5hZ2VycyB9IGZyb20gJy4vbWVyZ2VJbnRlcmFjdGlvbk1hbmFnZXJzJztcbmltcG9ydCB7IGJ1aWxkSW50ZXJhY3Rpb25Nb2RlIH0gZnJvbSAnLi9idWlsZEludGVyYWN0aW9uTW9kZSc7XG52YXIgSW50ZXJhY3Rpb25NYW5hZ2VyQ29udGV4dCA9IFJlYWN0LmNyZWF0ZUNvbnRleHQobnVsbCk7XG5leHBvcnQgdmFyIHVzZUludGVyYWN0aW9uTWFuYWdlciA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gUmVhY3QudXNlQ29udGV4dChJbnRlcmFjdGlvbk1hbmFnZXJDb250ZXh0KTtcbn07XG5leHBvcnQgdmFyIEludGVyYWN0aW9uTWFuYWdlclByb3ZpZGVyID0gZnVuY3Rpb24gKF9hKSB7XG4gICAgdmFyIGNoaWxkcmVuID0gX2EuY2hpbGRyZW47XG4gICAgdmFyIGVudmlyb25tZW50ID0gdXNlVHJlZUVudmlyb25tZW50KCk7XG4gICAgdmFyIGRlZmF1bHRJbnRlcmFjdGlvbk1vZGUgPSBlbnZpcm9ubWVudC5kZWZhdWx0SW50ZXJhY3Rpb25Nb2RlO1xuICAgIHZhciBpbnRlcmFjdGlvbk1hbmFnZXIgPSB1c2VNZW1vKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBpZiAoZGVmYXVsdEludGVyYWN0aW9uTW9kZSAmJiB0eXBlb2YgZGVmYXVsdEludGVyYWN0aW9uTW9kZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGlmIChkZWZhdWx0SW50ZXJhY3Rpb25Nb2RlLmV4dGVuZHMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWVyZ2VJbnRlcmFjdGlvbk1hbmFnZXJzKGRlZmF1bHRJbnRlcmFjdGlvbk1vZGUsIGJ1aWxkSW50ZXJhY3Rpb25Nb2RlKGRlZmF1bHRJbnRlcmFjdGlvbk1vZGUuZXh0ZW5kcywgZW52aXJvbm1lbnQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBkZWZhdWx0SW50ZXJhY3Rpb25Nb2RlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBidWlsZEludGVyYWN0aW9uTW9kZSgoX2EgPSBkZWZhdWx0SW50ZXJhY3Rpb25Nb2RlKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBJbnRlcmFjdGlvbk1vZGUuQ2xpY2tJdGVtVG9FeHBhbmQsIGVudmlyb25tZW50KTtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0LWhvb2tzL2V4aGF1c3RpdmUtZGVwc1xuICAgIH0sIFtdKTsgLy8gVE9ETyBtYWtlIHN1cmUgdGhhdCBlbnZpcm9ubWVudCBkb2VzIG5vdCBuZWVkIHRvIGJlIHJlZnJlc2hlZFxuICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChJbnRlcmFjdGlvbk1hbmFnZXJDb250ZXh0LlByb3ZpZGVyLCB7IHZhbHVlOiBpbnRlcmFjdGlvbk1hbmFnZXIgfSwgY2hpbGRyZW4pKTtcbn07XG4iLCJpbXBvcnQgeyB1c2VDYWxsYmFjayB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZVRyZWVFbnZpcm9ubWVudCB9IGZyb20gJy4uL2NvbnRyb2xsZWRFbnZpcm9ubWVudC9Db250cm9sbGVkVHJlZUVudmlyb25tZW50JztcbmV4cG9ydCB2YXIgdXNlQ2FuRHJvcEF0ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBlbnZpcm9ubWVudCA9IHVzZVRyZWVFbnZpcm9ubWVudCgpO1xuICAgIHJldHVybiB1c2VDYWxsYmFjayhmdW5jdGlvbiAoZHJhZ2dpbmdQb3NpdGlvbiwgZHJhZ2dpbmdJdGVtcykge1xuICAgICAgICBpZiAoZHJhZ2dpbmdQb3NpdGlvbi50YXJnZXRUeXBlID09PSAnYmV0d2Vlbi1pdGVtcycpIHtcbiAgICAgICAgICAgIGlmICghZW52aXJvbm1lbnQuY2FuUmVvcmRlckl0ZW1zKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGRyYWdnaW5nUG9zaXRpb24udGFyZ2V0VHlwZSA9PT0gJ3Jvb3QnKSB7XG4gICAgICAgICAgICBpZiAoIWVudmlyb25tZW50LmNhbkRyb3BPbkZvbGRlcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciByZXNvbHZlZEl0ZW0gPSBlbnZpcm9ubWVudC5pdGVtc1tkcmFnZ2luZ1Bvc2l0aW9uLnRhcmdldEl0ZW1dO1xuICAgICAgICAgICAgaWYgKCFyZXNvbHZlZEl0ZW0gfHxcbiAgICAgICAgICAgICAgICAoIWVudmlyb25tZW50LmNhbkRyb3BPbkZvbGRlciAmJiByZXNvbHZlZEl0ZW0uaXNGb2xkZXIpIHx8XG4gICAgICAgICAgICAgICAgKCFlbnZpcm9ubWVudC5jYW5Ecm9wT25Ob25Gb2xkZXIgJiYgIXJlc29sdmVkSXRlbS5pc0ZvbGRlcikgfHxcbiAgICAgICAgICAgICAgICBkcmFnZ2luZ0l0ZW1zLnNvbWUoZnVuY3Rpb24gKGRyYWdnaW5nSXRlbSkgeyByZXR1cm4gZHJhZ2dpbmdJdGVtLmluZGV4ID09PSBkcmFnZ2luZ1Bvc2l0aW9uLnRhcmdldEl0ZW07IH0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChlbnZpcm9ubWVudC5jYW5Ecm9wQXQgJiZcbiAgICAgICAgICAgICghZHJhZ2dpbmdJdGVtcyB8fFxuICAgICAgICAgICAgICAgICFlbnZpcm9ubWVudC5jYW5Ecm9wQXQoZHJhZ2dpbmdJdGVtcywgZHJhZ2dpbmdQb3NpdGlvbikpKSB7XG4gICAgICAgICAgICAvLyBzZXREcmFnZ2luZ1Bvc2l0aW9uKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSwgW2Vudmlyb25tZW50XSk7XG59O1xuIiwiaW1wb3J0IHsgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VUcmVlRW52aXJvbm1lbnQgfSBmcm9tICcuLi9jb250cm9sbGVkRW52aXJvbm1lbnQvQ29udHJvbGxlZFRyZWVFbnZpcm9ubWVudCc7XG5leHBvcnQgdmFyIHVzZUdldEdldFBhcmVudE9mTGluZWFySXRlbSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZW52aXJvbm1lbnQgPSB1c2VUcmVlRW52aXJvbm1lbnQoKTtcbiAgICByZXR1cm4gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKGl0ZW1MaW5lYXJJbmRleCwgdHJlZUlkKSB7XG4gICAgICAgIHZhciBsaW5lYXJJdGVtcyA9IGVudmlyb25tZW50LmxpbmVhckl0ZW1zW3RyZWVJZF07XG4gICAgICAgIHZhciBkZXB0aCA9IGxpbmVhckl0ZW1zW2l0ZW1MaW5lYXJJbmRleF0uZGVwdGg7XG4gICAgICAgIHZhciBwYXJlbnRMaW5lYXJJbmRleCA9IGl0ZW1MaW5lYXJJbmRleDtcbiAgICAgICAgZm9yICg7ICEhbGluZWFySXRlbXNbcGFyZW50TGluZWFySW5kZXhdICYmXG4gICAgICAgICAgICBsaW5lYXJJdGVtc1twYXJlbnRMaW5lYXJJbmRleF0uZGVwdGggIT09IGRlcHRoIC0gMTsgcGFyZW50TGluZWFySW5kZXggLT0gMSlcbiAgICAgICAgICAgIDtcbiAgICAgICAgdmFyIHBhcmVudCA9IGxpbmVhckl0ZW1zW3BhcmVudExpbmVhckluZGV4XTtcbiAgICAgICAgaWYgKCFwYXJlbnQpIHtcbiAgICAgICAgICAgIHBhcmVudCA9IHsgaXRlbTogZW52aXJvbm1lbnQudHJlZXNbdHJlZUlkXS5yb290SXRlbSwgZGVwdGg6IDAgfTtcbiAgICAgICAgICAgIHBhcmVudExpbmVhckluZGV4ID0gMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyBwYXJlbnQ6IHBhcmVudCwgcGFyZW50TGluZWFySW5kZXg6IHBhcmVudExpbmVhckluZGV4IH07XG4gICAgfSwgW2Vudmlyb25tZW50LmxpbmVhckl0ZW1zLCBlbnZpcm9ubWVudC50cmVlc10pO1xufTtcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnRpbnVlICovXG5pbXBvcnQgeyB1c2VDYWxsYmFjayB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZUdldEdldFBhcmVudE9mTGluZWFySXRlbSB9IGZyb20gJy4vdXNlR2V0UGFyZW50T2ZMaW5lYXJJdGVtJztcbmltcG9ydCB7IHVzZVRyZWVFbnZpcm9ubWVudCB9IGZyb20gJy4uL2NvbnRyb2xsZWRFbnZpcm9ubWVudC9Db250cm9sbGVkVHJlZUVudmlyb25tZW50JztcbmltcG9ydCB7IHVzZUNhbkRyb3BBdCB9IGZyb20gJy4vdXNlQ2FuRHJvcEF0JztcbmV4cG9ydCB2YXIgdXNlR2V0VmlhYmxlRHJhZ1Bvc2l0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZW52aXJvbm1lbnQgPSB1c2VUcmVlRW52aXJvbm1lbnQoKTtcbiAgICB2YXIgZ2V0UGFyZW50T2ZMaW5lYXJJdGVtID0gdXNlR2V0R2V0UGFyZW50T2ZMaW5lYXJJdGVtKCk7XG4gICAgdmFyIGNhbkRyb3BBdCA9IHVzZUNhbkRyb3BBdCgpO1xuICAgIHZhciBpc0Rlc2NlbmRhbnQgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAodHJlZUlkLCBpdGVtTGluZWFySW5kZXgsIHBvdGVudGlhbFBhcmVudHMpIHtcbiAgICAgICAgLy8gYmFzZWQgb24gRHJhZ2dpbmdQb3NpdGlvbkV2YWx1YXRpb24uaXNEZXNjZW5kYW50KClcbiAgICAgICAgdmFyIF9hID0gZ2V0UGFyZW50T2ZMaW5lYXJJdGVtKGl0ZW1MaW5lYXJJbmRleCwgdHJlZUlkKSwgcGFyZW50ID0gX2EucGFyZW50LCBwYXJlbnRMaW5lYXJJbmRleCA9IF9hLnBhcmVudExpbmVhckluZGV4O1xuICAgICAgICBpZiAocG90ZW50aWFsUGFyZW50cy5zb21lKGZ1bmN0aW9uIChwKSB7IHJldHVybiBwLmluZGV4ID09PSBwYXJlbnQuaXRlbTsgfSkpXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgaWYgKHBhcmVudC5kZXB0aCA9PT0gMClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgcmV0dXJuIGlzRGVzY2VuZGFudCh0cmVlSWQsIHBhcmVudExpbmVhckluZGV4LCBwb3RlbnRpYWxQYXJlbnRzKTtcbiAgICB9LCBbZ2V0UGFyZW50T2ZMaW5lYXJJdGVtXSk7XG4gICAgcmV0dXJuIHVzZUNhbGxiYWNrKGZ1bmN0aW9uICh0cmVlSWQsIGRyYWdnaW5nSXRlbXMpIHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgdmFyIGxpbmVhckl0ZW1zID0gZW52aXJvbm1lbnQubGluZWFySXRlbXNbdHJlZUlkXTtcbiAgICAgICAgdmFyIHRhcmdldHMgPSBbXTtcbiAgICAgICAgdmFyIHNraXBVbnRpbERlcHRoSXNMb3dlclRoYW4gPSAtMTtcbiAgICAgICAgZm9yICh2YXIgbGluZWFySW5kZXggPSAwOyBsaW5lYXJJbmRleCA8IGxpbmVhckl0ZW1zLmxlbmd0aDsgXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wbHVzcGx1c1xuICAgICAgICBsaW5lYXJJbmRleCsrKSB7XG4gICAgICAgICAgICB2YXIgX2MgPSBsaW5lYXJJdGVtc1tsaW5lYXJJbmRleF0sIGl0ZW0gPSBfYy5pdGVtLCBkZXB0aCA9IF9jLmRlcHRoO1xuICAgICAgICAgICAgaWYgKHNraXBVbnRpbERlcHRoSXNMb3dlclRoYW4gIT09IC0xICYmXG4gICAgICAgICAgICAgICAgZGVwdGggPiBza2lwVW50aWxEZXB0aElzTG93ZXJUaGFuKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBza2lwVW50aWxEZXB0aElzTG93ZXJUaGFuID0gLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgcGFyZW50XzEgPSBnZXRQYXJlbnRPZkxpbmVhckl0ZW0obGluZWFySW5kZXgsIHRyZWVJZCkucGFyZW50O1xuICAgICAgICAgICAgdmFyIGNoaWxkSW5kZXggPSBlbnZpcm9ubWVudC5pdGVtc1twYXJlbnRfMS5pdGVtXS5jaGlsZHJlbi5pbmRleE9mKGl0ZW0pO1xuICAgICAgICAgICAgaWYgKGlzRGVzY2VuZGFudCh0cmVlSWQsIGxpbmVhckluZGV4LCBkcmFnZ2luZ0l0ZW1zKSkge1xuICAgICAgICAgICAgICAgIHNraXBVbnRpbERlcHRoSXNMb3dlclRoYW4gPSBkZXB0aCArIDE7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgaXRlbVBvc2l0aW9uID0ge1xuICAgICAgICAgICAgICAgIHRhcmdldFR5cGU6ICdpdGVtJyxcbiAgICAgICAgICAgICAgICBwYXJlbnRJdGVtOiBwYXJlbnRfMS5pdGVtLFxuICAgICAgICAgICAgICAgIHRhcmdldEl0ZW06IGl0ZW0sXG4gICAgICAgICAgICAgICAgbGluZWFySW5kZXg6IGxpbmVhckluZGV4LFxuICAgICAgICAgICAgICAgIGRlcHRoOiBkZXB0aCxcbiAgICAgICAgICAgICAgICB0cmVlSWQ6IHRyZWVJZCxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB2YXIgdG9wUG9zaXRpb24gPSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0VHlwZTogJ2JldHdlZW4taXRlbXMnLFxuICAgICAgICAgICAgICAgIHBhcmVudEl0ZW06IHBhcmVudF8xLml0ZW0sXG4gICAgICAgICAgICAgICAgbGluZVBvc2l0aW9uOiAndG9wJyxcbiAgICAgICAgICAgICAgICBjaGlsZEluZGV4OiBjaGlsZEluZGV4LFxuICAgICAgICAgICAgICAgIGRlcHRoOiBkZXB0aCxcbiAgICAgICAgICAgICAgICB0cmVlSWQ6IHRyZWVJZCxcbiAgICAgICAgICAgICAgICBsaW5lYXJJbmRleDogbGluZWFySW5kZXgsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdmFyIGJvdHRvbVBvc2l0aW9uID0ge1xuICAgICAgICAgICAgICAgIHRhcmdldFR5cGU6ICdiZXR3ZWVuLWl0ZW1zJyxcbiAgICAgICAgICAgICAgICBwYXJlbnRJdGVtOiBwYXJlbnRfMS5pdGVtLFxuICAgICAgICAgICAgICAgIGxpbmVQb3NpdGlvbjogJ2JvdHRvbScsXG4gICAgICAgICAgICAgICAgbGluZWFySW5kZXg6IGxpbmVhckluZGV4ICsgMSxcbiAgICAgICAgICAgICAgICBjaGlsZEluZGV4OiBjaGlsZEluZGV4ICsgMSxcbiAgICAgICAgICAgICAgICBkZXB0aDogZGVwdGgsXG4gICAgICAgICAgICAgICAgdHJlZUlkOiB0cmVlSWQsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdmFyIHNraXBUb3BQb3NpdGlvbiA9IGRlcHRoID09PSAoKF9iID0gKF9hID0gbGluZWFySXRlbXNbbGluZWFySW5kZXggLSAxXSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmRlcHRoKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiAtMSk7XG4gICAgICAgICAgICBpZiAoIXNraXBUb3BQb3NpdGlvbiAmJiBjYW5Ecm9wQXQodG9wUG9zaXRpb24sIGRyYWdnaW5nSXRlbXMpKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0cy5wdXNoKHRvcFBvc2l0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjYW5Ecm9wQXQoaXRlbVBvc2l0aW9uLCBkcmFnZ2luZ0l0ZW1zKSkge1xuICAgICAgICAgICAgICAgIHRhcmdldHMucHVzaChpdGVtUG9zaXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNhbkRyb3BBdChib3R0b21Qb3NpdGlvbiwgZHJhZ2dpbmdJdGVtcykpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRzLnB1c2goYm90dG9tUG9zaXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0YXJnZXRzO1xuICAgIH0sIFtcbiAgICAgICAgY2FuRHJvcEF0LFxuICAgICAgICBlbnZpcm9ubWVudC5pdGVtcyxcbiAgICAgICAgZW52aXJvbm1lbnQubGluZWFySXRlbXMsXG4gICAgICAgIGdldFBhcmVudE9mTGluZWFySXRlbSxcbiAgICAgICAgaXNEZXNjZW5kYW50LFxuICAgIF0pO1xufTtcbiIsInZhciBfX3NwcmVhZEFycmF5ID0gKHRoaXMgJiYgdGhpcy5fX3NwcmVhZEFycmF5KSB8fCBmdW5jdGlvbiAodG8sIGZyb20sIHBhY2spIHtcbiAgICBpZiAocGFjayB8fCBhcmd1bWVudHMubGVuZ3RoID09PSAyKSBmb3IgKHZhciBpID0gMCwgbCA9IGZyb20ubGVuZ3RoLCBhcjsgaSA8IGw7IGkrKykge1xuICAgICAgICBpZiAoYXIgfHwgIShpIGluIGZyb20pKSB7XG4gICAgICAgICAgICBpZiAoIWFyKSBhciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20sIDAsIGkpO1xuICAgICAgICAgICAgYXJbaV0gPSBmcm9tW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0by5jb25jYXQoYXIgfHwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSkpO1xufTtcbmltcG9ydCB7IHVzZUVmZmVjdCwgdXNlUmVmIH0gZnJvbSAncmVhY3QnO1xuZXhwb3J0IHZhciB1c2VTaWRlRWZmZWN0ID0gZnVuY3Rpb24gKGVmZmVjdCwgZGVwcywgY2hhbmdlT24pIHtcbiAgICB2YXIgcHJldmlvdXNSZWYgPSB1c2VSZWYoKTtcbiAgICB1c2VFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXByZXZpb3VzUmVmLmN1cnJlbnQpIHtcbiAgICAgICAgICAgIHByZXZpb3VzUmVmLmN1cnJlbnQgPSBfX3NwcmVhZEFycmF5KFtdLCBjaGFuZ2VPbiwgdHJ1ZSk7XG4gICAgICAgICAgICBlZmZlY3QoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBjaGFuZ2VkID0gcHJldmlvdXNSZWYuY3VycmVudC5zb21lKGZ1bmN0aW9uICh2LCBpKSB7IHJldHVybiB2ICE9PSBjaGFuZ2VPbltpXTsgfSk7XG4gICAgICAgICAgICBpZiAoY2hhbmdlZCkge1xuICAgICAgICAgICAgICAgIHByZXZpb3VzUmVmLmN1cnJlbnQgPSBfX3NwcmVhZEFycmF5KFtdLCBjaGFuZ2VPbiwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgZWZmZWN0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0LWhvb2tzL2V4aGF1c3RpdmUtZGVwc1xuICAgIH0sIF9fc3ByZWFkQXJyYXkoX19zcHJlYWRBcnJheShbXSwgZGVwcywgdHJ1ZSksIGNoYW5nZU9uLCB0cnVlKSk7XG59O1xuIiwidmFyIF9fYXNzaWduID0gKHRoaXMgJiYgdGhpcy5fX2Fzc2lnbikgfHwgZnVuY3Rpb24gKCkge1xuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0KSB7XG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSlcbiAgICAgICAgICAgICAgICB0W3BdID0gc1twXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdDtcbiAgICB9O1xuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcbmV4cG9ydCB2YXIgYnVpbGRNYXBGb3JUcmVlcyA9IGZ1bmN0aW9uICh0cmVlSWRzLCBidWlsZCkge1xuICAgIHJldHVybiB0cmVlSWRzXG4gICAgICAgIC5tYXAoZnVuY3Rpb24gKGlkKSB7IHJldHVybiBbaWQsIGJ1aWxkKGlkKV07IH0pXG4gICAgICAgIC5yZWR1Y2UoZnVuY3Rpb24gKGEsIF9hKSB7XG4gICAgICAgIHZhciBfYjtcbiAgICAgICAgdmFyIGlkID0gX2FbMF0sIG9iaiA9IF9hWzFdO1xuICAgICAgICByZXR1cm4gKF9fYXNzaWduKF9fYXNzaWduKHt9LCBhKSwgKF9iID0ge30sIF9iW2lkXSA9IG9iaiwgX2IpKSk7XG4gICAgfSwge30pO1xufTtcbmV4cG9ydCB2YXIgZ2V0RG9jdW1lbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgPyBkb2N1bWVudCA6IHVuZGVmaW5lZDtcbn07XG4iLCJpbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlRWZmZWN0LCB1c2VSZWYgfSBmcm9tICdyZWFjdCc7XG4vKipcbiAqIFJlYWN0IGhvb2sgdGhhdCBzY2hlZHVsZXMgYSBjYWxsYmFjayB0byBiZSBydW4gXCJzb29uXCIgYW5kIHdpbGwgY2FuY2VsIHRoZVxuICogY2FsbGJhY2sgaWYgaXQgaXMgc3RpbGwgcGVuZGluZyB3aGVuIHRoZSBjb21wb25lbnQgaXMgdW5tb3VudGVkLlxuICpcbiAqIEByZXR1cm5zIEEgZnVuY3Rpb24gdGhhdCBjYW4gYmUgdXNlZCB0byBzY2hlZHVsZSBhIGRlZmVycmVkIGNhbGxiYWNrLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdXNlQ2FsbFNvb24oZG9udENsZWFuKSB7XG4gICAgaWYgKGRvbnRDbGVhbiA9PT0gdm9pZCAwKSB7IGRvbnRDbGVhbiA9IGZhbHNlOyB9XG4gICAgdmFyIGhhbmRsZVJlZiA9IHVzZVJlZihuZXcgQXJyYXkoKSk7XG4gICAgdXNlRWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGRvbnRDbGVhbikge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHsgfTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgaGFuZGxlcyA9IGhhbmRsZVJlZi5jdXJyZW50O1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkgeyByZXR1cm4gaGFuZGxlcy5mb3JFYWNoKGZ1bmN0aW9uIChoYW5kbGUpIHsgcmV0dXJuIGNhbmNlbEFuaW1hdGlvbkZyYW1lKGhhbmRsZSk7IH0pOyB9O1xuICAgIH0sIFtkb250Q2xlYW4sIGhhbmRsZVJlZl0pO1xuICAgIHJldHVybiB1c2VDYWxsYmFjayhmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGhhbmRsZSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBoYW5kbGVSZWYuY3VycmVudC5zcGxpY2UoaGFuZGxlUmVmLmN1cnJlbnQuaW5kZXhPZihoYW5kbGUpLCAxKTtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBoYW5kbGVSZWYuY3VycmVudC5wdXNoKGhhbmRsZSk7XG4gICAgfSwgW2hhbmRsZVJlZl0pO1xufVxuIiwiaW1wb3J0IHsgdXNlUmVmIH0gZnJvbSAncmVhY3QnO1xuZXhwb3J0IHZhciB1c2VSZWZDb3B5ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgdmFyIHJlZiA9IHVzZVJlZih2YWx1ZSk7XG4gICAgcmVmLmN1cnJlbnQgPSB2YWx1ZTtcbiAgICByZXR1cm4gcmVmO1xufTtcbiIsImltcG9ydCB7IHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlUmVmQ29weSB9IGZyb20gJy4vdXNlUmVmQ29weSc7XG5leHBvcnQgdmFyIHVzZVN0YWJsZUhhbmRsZXIgPSBmdW5jdGlvbiAoaGFuZGxlcikge1xuICAgIHZhciBoYW5kbGVyUmVmID0gdXNlUmVmQ29weShoYW5kbGVyKTtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVhY3QtaG9va3MvZXhoYXVzdGl2ZS1kZXBzXG4gICAgcmV0dXJuIHVzZUNhbGxiYWNrKChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhcmdzID0gW107XG4gICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICBhcmdzW19pXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGhhbmRsZXJSZWYuY3VycmVudC5hcHBseShoYW5kbGVyUmVmLCBhcmdzKTtcbiAgICB9KSwgW1xuICAgICAgICBoYW5kbGVyUmVmLFxuICAgIF0pO1xufTtcbiIsImltcG9ydCB7IHVzZVRyZWVFbnZpcm9ubWVudCB9IGZyb20gJy4vY29udHJvbGxlZEVudmlyb25tZW50L0NvbnRyb2xsZWRUcmVlRW52aXJvbm1lbnQnO1xuaW1wb3J0IHsgdXNlU3RhYmxlSGFuZGxlciB9IGZyb20gJy4vdXNlU3RhYmxlSGFuZGxlcic7XG5leHBvcnQgdmFyIHVzZUdldE9yaWdpbmFsSXRlbU9yZGVyID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBlbnYgPSB1c2VUcmVlRW52aXJvbm1lbnQoKTtcbiAgICByZXR1cm4gdXNlU3RhYmxlSGFuZGxlcihmdW5jdGlvbiAodHJlZUlkLCBpdGVtcykge1xuICAgICAgICByZXR1cm4gaXRlbXNcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAgaXRlbSxcbiAgICAgICAgICAgICAgICBlbnYubGluZWFySXRlbXNbdHJlZUlkXS5maW5kSW5kZXgoZnVuY3Rpb24gKGxpbmVhckl0ZW0pIHsgcmV0dXJuIGxpbmVhckl0ZW0uaXRlbSA9PT0gaXRlbS5pbmRleDsgfSksXG4gICAgICAgICAgICBdO1xuICAgICAgICB9KVxuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFyc1xuICAgICAgICAgICAgLnNvcnQoZnVuY3Rpb24gKF9hLCBfYikge1xuICAgICAgICAgICAgdmFyIF8gPSBfYVswXSwgYVBvcyA9IF9hWzFdO1xuICAgICAgICAgICAgdmFyIF8yID0gX2JbMF0sIGJQb3MgPSBfYlsxXTtcbiAgICAgICAgICAgIHJldHVybiBhUG9zIC0gYlBvcztcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IF9hWzBdO1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgIH0pO1xuICAgIH0pO1xufTtcbiIsImltcG9ydCB7IGdldERvY3VtZW50IH0gZnJvbSAnLi4vdXRpbHMnO1xuZXhwb3J0IHZhciBjb21wdXRlSXRlbUhlaWdodCA9IGZ1bmN0aW9uICh0cmVlSWQpIHtcbiAgICB2YXIgX2E7XG4gICAgdmFyIGZpcnN0SXRlbSA9IChfYSA9IGdldERvY3VtZW50KCkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtcmN0LXRyZWU9XFxcIlwiLmNvbmNhdCh0cmVlSWQsIFwiXFxcIl0gW2RhdGEtcmN0LWl0ZW0tY29udGFpbmVyPVxcXCJ0cnVlXFxcIl1cIikpO1xuICAgIGlmIChmaXJzdEl0ZW0pIHtcbiAgICAgICAgdmFyIHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShmaXJzdEl0ZW0pO1xuICAgICAgICAvLyB0b3AgbWFyZ2luIGZsb3dzIGludG8gdGhlIGJvdHRvbSBtYXJnaW4gb2YgdGhlIHByZXZpb3VzIGl0ZW0sIHNvIGlnbm9yZSBpdFxuICAgICAgICByZXR1cm4gKGZpcnN0SXRlbS5vZmZzZXRIZWlnaHQgK1xuICAgICAgICAgICAgTWF0aC5tYXgocGFyc2VGbG9hdChzdHlsZS5tYXJnaW5Ub3ApLCBwYXJzZUZsb2F0KHN0eWxlLm1hcmdpbkJvdHRvbSkpKTtcbiAgICB9XG4gICAgcmV0dXJuIDU7XG59O1xuZXhwb3J0IHZhciBpc091dHNpZGVPZkNvbnRhaW5lciA9IGZ1bmN0aW9uIChlLCB0cmVlQmIpIHtcbiAgICByZXR1cm4gZS5jbGllbnRYIDw9IHRyZWVCYi5sZWZ0IHx8XG4gICAgICAgIGUuY2xpZW50WCA+PSB0cmVlQmIucmlnaHQgfHxcbiAgICAgICAgZS5jbGllbnRZIDw9IHRyZWVCYi50b3AgfHxcbiAgICAgICAgZS5jbGllbnRZID49IHRyZWVCYi5ib3R0b207XG59O1xuIiwidmFyIERyYWdnaW5nUG9zaXRpb25FdmFsdWF0aW9uID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIERyYWdnaW5nUG9zaXRpb25FdmFsdWF0aW9uKGVudiwgZSwgdHJlZUlkLCBob3ZlcmluZ1Bvc2l0aW9uLCBkcmFnZ2luZ0l0ZW1zLCBnZXRQYXJlbnRPZkxpbmVhckl0ZW0pIHtcbiAgICAgICAgdGhpcy5lbnYgPSBlbnY7XG4gICAgICAgIHRoaXMuZSA9IGU7XG4gICAgICAgIHRoaXMudHJlZUlkID0gdHJlZUlkO1xuICAgICAgICB0aGlzLmxpbmVhckluZGV4ID0gaG92ZXJpbmdQb3NpdGlvbi5saW5lYXJJbmRleDtcbiAgICAgICAgdGhpcy5vZmZzZXQgPSBob3ZlcmluZ1Bvc2l0aW9uLm9mZnNldDtcbiAgICAgICAgdGhpcy5pbmRlbnRhdGlvbiA9IGhvdmVyaW5nUG9zaXRpb24uaW5kZW50YXRpb247XG4gICAgICAgIHRoaXMudGFyZ2V0SXRlbSA9IHRoaXMuZW52LmxpbmVhckl0ZW1zW3RoaXMudHJlZUlkXVt0aGlzLmxpbmVhckluZGV4XTtcbiAgICAgICAgdGhpcy5nZXRQYXJlbnRPZkxpbmVhckl0ZW0gPSBnZXRQYXJlbnRPZkxpbmVhckl0ZW07XG4gICAgICAgIHRoaXMuZHJhZ2dpbmdJdGVtcyA9IGRyYWdnaW5nSXRlbXM7XG4gICAgfVxuICAgIERyYWdnaW5nUG9zaXRpb25FdmFsdWF0aW9uLnByb3RvdHlwZS5nZXRFbXB0eVRyZWVEcmFnUG9zaXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0YXJnZXRUeXBlOiAncm9vdCcsXG4gICAgICAgICAgICB0cmVlSWQ6IHRoaXMudHJlZUlkLFxuICAgICAgICAgICAgZGVwdGg6IDAsXG4gICAgICAgICAgICBsaW5lYXJJbmRleDogMCxcbiAgICAgICAgICAgIHRhcmdldEl0ZW06IHRoaXMuZW52LnRyZWVzW3RoaXMudHJlZUlkXS5yb290SXRlbSxcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIElmIHJlb3JkZXJpbmcgaXMgbm90IGFsbG93ZWQsIGRyYWdnaW5nIG9uIG5vbi1mb2xkZXIgaXRlbXMgcmVkaXJlY3RzXG4gICAgICogdGhlIGRyYWcgdGFyZ2V0IHRvIHRoZSBwYXJlbnQgb2YgdGhlIHRhcmdldCBpdGVtLlxuICAgICAqL1xuICAgIERyYWdnaW5nUG9zaXRpb25FdmFsdWF0aW9uLnByb3RvdHlwZS5tYXliZVJlZGlyZWN0VG9QYXJlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciByZWRpcmVjdFRhcmdldFRvUGFyZW50ID0gIXRoaXMuZW52LmNhblJlb3JkZXJJdGVtcyAmJlxuICAgICAgICAgICAgIXRoaXMuZW52LmNhbkRyb3BPbk5vbkZvbGRlciAmJlxuICAgICAgICAgICAgIXRoaXMuZW52Lml0ZW1zW3RoaXMudGFyZ2V0SXRlbS5pdGVtXS5pc0ZvbGRlcjtcbiAgICAgICAgaWYgKHJlZGlyZWN0VGFyZ2V0VG9QYXJlbnQpIHtcbiAgICAgICAgICAgIHZhciBfYSA9IHRoaXMuZ2V0UGFyZW50T2ZMaW5lYXJJdGVtKHRoaXMubGluZWFySW5kZXgsIHRoaXMudHJlZUlkKSwgcGFyZW50TGluZWFySW5kZXggPSBfYS5wYXJlbnRMaW5lYXJJbmRleCwgcGFyZW50XzEgPSBfYS5wYXJlbnQ7XG4gICAgICAgICAgICB0aGlzLnRhcmdldEl0ZW0gPSBwYXJlbnRfMTtcbiAgICAgICAgICAgIHRoaXMubGluZWFySW5kZXggPSBwYXJlbnRMaW5lYXJJbmRleDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogSWYgdGhlIGl0ZW0gaXMgdGhlIGxhc3QgaW4gYSBncm91cCwgYW5kIHRoZSBkcm9wIGlzIGF0IHRoZSBib3R0b20sXG4gICAgICogdGhlIHgtY29vcmRpbmF0ZSBvZiB0aGUgbW91c2UgYWxsb3dzIHRvIHJlcGFyZW50IHVwd2FyZHMuXG4gICAgICovXG4gICAgRHJhZ2dpbmdQb3NpdGlvbkV2YWx1YXRpb24ucHJvdG90eXBlLm1heWJlUmVwYXJlbnRVcHdhcmRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICBpZiAodGhpcy5pbmRlbnRhdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0cmVlTGluZWFySXRlbXMgPSB0aGlzLmVudi5saW5lYXJJdGVtc1t0aGlzLnRyZWVJZF07XG4gICAgICAgIHZhciBkZWVwZXN0RGVwdGggPSB0cmVlTGluZWFySXRlbXNbdGhpcy5saW5lYXJJbmRleF0uZGVwdGg7XG4gICAgICAgIC8vIERlZmF1bHQgdG8gemVybyBvbiBsYXN0IHBvc2l0aW9uIHRvIGFsbG93IGRyb3BwaW5nIG9uIHJvb3Qgd2hlblxuICAgICAgICAvLyBkcm9wcGluZyBhdCBib3R0b21cbiAgICAgICAgdmFyIGxlZ2FsRHJvcERlcHRoQ291bnQgPSAvLyBpdGVtRGVwdGhEaWZmZXJlbmNlVG9OZXh0SXRlbS9pc0xhc3RJbkdyb3VwXG4gICAgICAgICBkZWVwZXN0RGVwdGggLSAoKF9iID0gKF9hID0gdHJlZUxpbmVhckl0ZW1zW3RoaXMubGluZWFySW5kZXggKyAxXSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmRlcHRoKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiAwKTtcbiAgICAgICAgdmFyIGNhblJlcGFyZW50VXB3YXJkcyA9IHRoaXMub2Zmc2V0ID09PSAnYm90dG9tJyAmJiBsZWdhbERyb3BEZXB0aENvdW50ID4gMDtcbiAgICAgICAgaWYgKCFjYW5SZXBhcmVudFVwd2FyZHMpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRyb3BwaW5nSW5kZW50ID0gTWF0aC5tYXgoZGVlcGVzdERlcHRoIC0gbGVnYWxEcm9wRGVwdGhDb3VudCwgdGhpcy5pbmRlbnRhdGlvbik7XG4gICAgICAgIHZhciBuZXdQYXJlbnQgPSB7XG4gICAgICAgICAgICBwYXJlbnRMaW5lYXJJbmRleDogdGhpcy5saW5lYXJJbmRleCxcbiAgICAgICAgICAgIHBhcmVudDogdGhpcy50YXJnZXRJdGVtLFxuICAgICAgICB9O1xuICAgICAgICB2YXIgaW5zZXJ0aW9uSXRlbUFib3ZlO1xuICAgICAgICBmb3IgKHZhciBpID0gZGVlcGVzdERlcHRoOyBpID49IGRyb3BwaW5nSW5kZW50OyBpIC09IDEpIHtcbiAgICAgICAgICAgIGluc2VydGlvbkl0ZW1BYm92ZSA9IG5ld1BhcmVudDtcbiAgICAgICAgICAgIG5ld1BhcmVudCA9IHRoaXMuZ2V0UGFyZW50T2ZMaW5lYXJJdGVtKG5ld1BhcmVudC5wYXJlbnRMaW5lYXJJbmRleCwgdGhpcy50cmVlSWQpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmluZGVudGF0aW9uID09PSB0cmVlTGluZWFySXRlbXNbdGhpcy5saW5lYXJJbmRleF0uZGVwdGgpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFpbnNlcnRpb25JdGVtQWJvdmUpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJlcGFyZW50ZWRDaGlsZEluZGV4ID0gdGhpcy5lbnYuaXRlbXNbbmV3UGFyZW50LnBhcmVudC5pdGVtXS5jaGlsZHJlbi5pbmRleE9mKGluc2VydGlvbkl0ZW1BYm92ZS5wYXJlbnQuaXRlbSkgKyAxO1xuICAgICAgICBpZiAodGhpcy5kcmFnZ2luZ0l0ZW1zICYmXG4gICAgICAgICAgICB0aGlzLmlzRGVzY2VuZGFudCh0aGlzLnRyZWVJZCwgbmV3UGFyZW50LnBhcmVudExpbmVhckluZGV4ICsgMSwgdGhpcy5kcmFnZ2luZ0l0ZW1zKSkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdGFyZ2V0VHlwZTogJ2JldHdlZW4taXRlbXMnLFxuICAgICAgICAgICAgdHJlZUlkOiB0aGlzLnRyZWVJZCxcbiAgICAgICAgICAgIHBhcmVudEl0ZW06IG5ld1BhcmVudC5wYXJlbnQuaXRlbSxcbiAgICAgICAgICAgIGRlcHRoOiBkcm9wcGluZ0luZGVudCxcbiAgICAgICAgICAgIGxpbmVhckluZGV4OiB0aGlzLmxpbmVhckluZGV4ICsgMSxcbiAgICAgICAgICAgIGNoaWxkSW5kZXg6IHJlcGFyZW50ZWRDaGlsZEluZGV4LFxuICAgICAgICAgICAgbGluZVBvc2l0aW9uOiAnYm90dG9tJyxcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIERvbid0IGFsbG93IHRvIGRyb3AgYXQgYm90dG9tIG9mIGFuIG9wZW4gZm9sZGVyLCBzaW5jZSB0aGF0IHdpbGwgcGxhY2VcbiAgICAgKiBpdCB2aXN1YWxseSBhdCBhIGRpZmZlcmVudCBwb3NpdGlvbi4gUmVkaXJlY3QgdGhlIGRyYWcgdGFyZ2V0IHRvIHRoZVxuICAgICAqIHRvcCBvZiB0aGUgZm9sZGVyIGNvbnRlbnRzIGluIHRoYXQgY2FzZS5cbiAgICAgKi9cbiAgICBEcmFnZ2luZ1Bvc2l0aW9uRXZhbHVhdGlvbi5wcm90b3R5cGUubWF5YmVSZWRpcmVjdEluc2lkZU9wZW5Gb2xkZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBuZXh0SXRlbSA9IHRoaXMuZW52LmxpbmVhckl0ZW1zW3RoaXMudHJlZUlkXVt0aGlzLmxpbmVhckluZGV4ICsgMV07XG4gICAgICAgIHZhciByZWRpcmVjdEluc2lkZU9wZW5Gb2xkZXIgPSAhdGhpcy5lbnYuY2FuRHJvcEJlbG93T3BlbkZvbGRlcnMgJiZcbiAgICAgICAgICAgIG5leHRJdGVtICYmXG4gICAgICAgICAgICB0aGlzLnRhcmdldEl0ZW0uZGVwdGggPT09IG5leHRJdGVtLmRlcHRoIC0gMSAmJlxuICAgICAgICAgICAgdGhpcy5vZmZzZXQgPT09ICdib3R0b20nO1xuICAgICAgICBpZiAocmVkaXJlY3RJbnNpZGVPcGVuRm9sZGVyKSB7XG4gICAgICAgICAgICB0aGlzLnRhcmdldEl0ZW0gPSBuZXh0SXRlbTtcbiAgICAgICAgICAgIHRoaXMubGluZWFySW5kZXggKz0gMTtcbiAgICAgICAgICAgIHRoaXMub2Zmc2V0ID0gJ3RvcCc7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEluc2lkZSBhIGZvbGRlciwgb25seSBkcm9wIGF0IGJvdHRvbSBvZmZzZXQgdG8gbWFrZSBpdCB2aXN1YWxseVxuICAgICAqIGNvbnNpc3RlbnQuIFRoaXMgYWxzbyBtYXBzIHRvIGJvdHRvbSBvZmZzZXQgZm9yIGl0ZW1zIGJlbG93IG9wZW5cbiAgICAgKiBzdWJ0cmVlcywgdG8ga2VlcCB0aGUgeC1jb29yZGluYXRlIGJhc2VkIGRyb3BwaW5nIGNvbnNpc3RlbnQgKG9ubHlcbiAgICAgKiBpZiBpbmRlbnRhdGlvbiBpcyBkZWZpbmVkKS5cbiAgICAgKi9cbiAgICBEcmFnZ2luZ1Bvc2l0aW9uRXZhbHVhdGlvbi5wcm90b3R5cGUubWF5YmVNYXBUb0JvdHRvbU9mZnNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHByaW9ySXRlbSA9IHRoaXMuZW52LmxpbmVhckl0ZW1zW3RoaXMudHJlZUlkXVt0aGlzLmxpbmVhckluZGV4IC0gMV07XG4gICAgICAgIGlmICghcHJpb3JJdGVtIHx8IChwcmlvckl0ZW0gPT09IG51bGwgfHwgcHJpb3JJdGVtID09PSB2b2lkIDAgPyB2b2lkIDAgOiBwcmlvckl0ZW0uZGVwdGgpID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHZhciBkZXB0aERpc3RhbmNlVG9QcmlvciA9IHByaW9ySXRlbS5kZXB0aCAtIHRoaXMudGFyZ2V0SXRlbS5kZXB0aDtcbiAgICAgICAgaWYgKHRoaXMub2Zmc2V0ID09PSAndG9wJyAmJlxuICAgICAgICAgICAgKGRlcHRoRGlzdGFuY2VUb1ByaW9yID09PSAwIHx8XG4gICAgICAgICAgICAgICAgKGRlcHRoRGlzdGFuY2VUb1ByaW9yID4gMCAmJiB0aGlzLmluZGVudGF0aW9uICE9PSB1bmRlZmluZWQpKSkge1xuICAgICAgICAgICAgdGhpcy5vZmZzZXQgPSAnYm90dG9tJztcbiAgICAgICAgICAgIHRoaXMubGluZWFySW5kZXggLT0gMTtcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0SXRlbSA9IHRoaXMuZW52LmxpbmVhckl0ZW1zW3RoaXMudHJlZUlkXVt0aGlzLmxpbmVhckluZGV4XTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgRHJhZ2dpbmdQb3NpdGlvbkV2YWx1YXRpb24ucHJvdG90eXBlLmNhbkRyb3BBdEN1cnJlbnRUYXJnZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgdmFyIHRhcmdldEl0ZW1EYXRhID0gdGhpcy5lbnYuaXRlbXNbdGhpcy50YXJnZXRJdGVtLml0ZW1dO1xuICAgICAgICBpZiAoIXRoaXMub2Zmc2V0ICYmXG4gICAgICAgICAgICAhdGhpcy5lbnYuY2FuRHJvcE9uTm9uRm9sZGVyICYmXG4gICAgICAgICAgICAhdGFyZ2V0SXRlbURhdGEuaXNGb2xkZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMub2Zmc2V0ICYmICF0aGlzLmVudi5jYW5Ecm9wT25Gb2xkZXIgJiYgdGFyZ2V0SXRlbURhdGEuaXNGb2xkZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5vZmZzZXQgJiYgIXRoaXMuZW52LmNhblJlb3JkZXJJdGVtcykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICgoX2EgPSB0aGlzLmRyYWdnaW5nSXRlbXMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5zb21lKGZ1bmN0aW9uIChkcmFnZ2luZ0l0ZW0pIHsgcmV0dXJuIGRyYWdnaW5nSXRlbS5pbmRleCA9PT0gX3RoaXMudGFyZ2V0SXRlbS5pdGVtOyB9KSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG4gICAgRHJhZ2dpbmdQb3NpdGlvbkV2YWx1YXRpb24ucHJvdG90eXBlLmdldERyYWdnaW5nUG9zaXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmVudi5saW5lYXJJdGVtc1t0aGlzLnRyZWVJZF0ubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRFbXB0eVRyZWVEcmFnUG9zaXRpb24oKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuZHJhZ2dpbmdJdGVtcyB8fFxuICAgICAgICAgICAgdGhpcy5saW5lYXJJbmRleCA8IDAgfHxcbiAgICAgICAgICAgIHRoaXMubGluZWFySW5kZXggPj0gdGhpcy5lbnYubGluZWFySXRlbXNbdGhpcy50cmVlSWRdLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1heWJlUmVkaXJlY3RUb1BhcmVudCgpO1xuICAgICAgICB0aGlzLm1heWJlUmVkaXJlY3RJbnNpZGVPcGVuRm9sZGVyKCk7XG4gICAgICAgIHRoaXMubWF5YmVNYXBUb0JvdHRvbU9mZnNldCgpO1xuICAgICAgICB2YXIgcmVwYXJlbnRlZCA9IHRoaXMubWF5YmVSZXBhcmVudFVwd2FyZHMoKTtcbiAgICAgICAgaWYgKHJlcGFyZW50ZWQpIHtcbiAgICAgICAgICAgIHJldHVybiByZXBhcmVudGVkO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmFyZURyYWdnaW5nSXRlbXNEZXNjZW5kYW50T2ZUYXJnZXQoKSkge1xuICAgICAgICAgICAgcmV0dXJuICdpbnZhbGlkJztcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuY2FuRHJvcEF0Q3VycmVudFRhcmdldCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2ludmFsaWQnO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwYXJlbnQgPSB0aGlzLmdldFBhcmVudE9mTGluZWFySXRlbSh0aGlzLmxpbmVhckluZGV4LCB0aGlzLnRyZWVJZCkucGFyZW50O1xuICAgICAgICB2YXIgbmV3Q2hpbGRJbmRleCA9IHRoaXMuZW52Lml0ZW1zW3BhcmVudC5pdGVtXS5jaGlsZHJlbi5pbmRleE9mKHRoaXMudGFyZ2V0SXRlbS5pdGVtKSArXG4gICAgICAgICAgICAodGhpcy5vZmZzZXQgPT09ICd0b3AnID8gMCA6IDEpO1xuICAgICAgICBpZiAodGhpcy5vZmZzZXQpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0VHlwZTogJ2JldHdlZW4taXRlbXMnLFxuICAgICAgICAgICAgICAgIHRyZWVJZDogdGhpcy50cmVlSWQsXG4gICAgICAgICAgICAgICAgcGFyZW50SXRlbTogcGFyZW50Lml0ZW0sXG4gICAgICAgICAgICAgICAgZGVwdGg6IHRoaXMudGFyZ2V0SXRlbS5kZXB0aCxcbiAgICAgICAgICAgICAgICBsaW5lYXJJbmRleDogdGhpcy5saW5lYXJJbmRleCArICh0aGlzLm9mZnNldCA9PT0gJ3RvcCcgPyAwIDogMSksXG4gICAgICAgICAgICAgICAgY2hpbGRJbmRleDogbmV3Q2hpbGRJbmRleCxcbiAgICAgICAgICAgICAgICBsaW5lUG9zaXRpb246IHRoaXMub2Zmc2V0LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdGFyZ2V0VHlwZTogJ2l0ZW0nLFxuICAgICAgICAgICAgdHJlZUlkOiB0aGlzLnRyZWVJZCxcbiAgICAgICAgICAgIHBhcmVudEl0ZW06IHBhcmVudC5pdGVtLFxuICAgICAgICAgICAgdGFyZ2V0SXRlbTogdGhpcy50YXJnZXRJdGVtLml0ZW0sXG4gICAgICAgICAgICBkZXB0aDogdGhpcy50YXJnZXRJdGVtLmRlcHRoLFxuICAgICAgICAgICAgbGluZWFySW5kZXg6IHRoaXMubGluZWFySW5kZXgsXG4gICAgICAgIH07XG4gICAgfTtcbiAgICBEcmFnZ2luZ1Bvc2l0aW9uRXZhbHVhdGlvbi5wcm90b3R5cGUuaXNEZXNjZW5kYW50ID0gZnVuY3Rpb24gKHRyZWVJZCwgaXRlbUxpbmVhckluZGV4LCBwb3RlbnRpYWxQYXJlbnRzKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdkZXNjZW5kYW50IGNoZWNrJywgaXRlbUxpbmVhckluZGV4LCBwb3RlbnRpYWxQYXJlbnRzKTtcbiAgICAgICAgdmFyIF9hID0gdGhpcy5nZXRQYXJlbnRPZkxpbmVhckl0ZW0oaXRlbUxpbmVhckluZGV4LCB0cmVlSWQpLCBwYXJlbnRMaW5lYXJJbmRleCA9IF9hLnBhcmVudExpbmVhckluZGV4LCBwYXJlbnQgPSBfYS5wYXJlbnQ7XG4gICAgICAgIGlmIChwb3RlbnRpYWxQYXJlbnRzLnNvbWUoZnVuY3Rpb24gKHApIHsgcmV0dXJuIHAuaW5kZXggPT09IHBhcmVudC5pdGVtOyB9KSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhcmVudC5kZXB0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmlzRGVzY2VuZGFudCh0cmVlSWQsIHBhcmVudExpbmVhckluZGV4LCBwb3RlbnRpYWxQYXJlbnRzKTtcbiAgICB9O1xuICAgIERyYWdnaW5nUG9zaXRpb25FdmFsdWF0aW9uLnByb3RvdHlwZS5hcmVEcmFnZ2luZ0l0ZW1zRGVzY2VuZGFudE9mVGFyZ2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gKHRoaXMuZHJhZ2dpbmdJdGVtcyAmJlxuICAgICAgICAgICAgdGhpcy5pc0Rlc2NlbmRhbnQodGhpcy50cmVlSWQsIHRoaXMubGluZWFySW5kZXgsIHRoaXMuZHJhZ2dpbmdJdGVtcykpO1xuICAgIH07XG4gICAgcmV0dXJuIERyYWdnaW5nUG9zaXRpb25FdmFsdWF0aW9uO1xufSgpKTtcbmV4cG9ydCB7IERyYWdnaW5nUG9zaXRpb25FdmFsdWF0aW9uIH07XG4iLCJpbXBvcnQgeyB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgY29tcHV0ZUl0ZW1IZWlnaHQsIGlzT3V0c2lkZU9mQ29udGFpbmVyLCB9IGZyb20gJy4uL2NvbnRyb2xsZWRFbnZpcm9ubWVudC9sYXlvdXRVdGlscyc7XG5pbXBvcnQgeyB1c2VUcmVlRW52aXJvbm1lbnQgfSBmcm9tICcuLi9jb250cm9sbGVkRW52aXJvbm1lbnQvQ29udHJvbGxlZFRyZWVFbnZpcm9ubWVudCc7XG5pbXBvcnQgeyB1c2VTdGFibGVIYW5kbGVyIH0gZnJvbSAnLi4vdXNlU3RhYmxlSGFuZGxlcic7XG5pbXBvcnQgeyBEcmFnZ2luZ1Bvc2l0aW9uRXZhbHVhdGlvbiB9IGZyb20gJy4vRHJhZ2dpbmdQb3NpdGlvbkV2YWx1YXRpb24nO1xuaW1wb3J0IHsgdXNlR2V0R2V0UGFyZW50T2ZMaW5lYXJJdGVtIH0gZnJvbSAnLi91c2VHZXRQYXJlbnRPZkxpbmVhckl0ZW0nO1xuZXhwb3J0IHZhciB1c2VEcmFnZ2luZ1Bvc2l0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBkcmFnQ29kZSA9IHVzZVJlZignaW5pdGlhbCcpO1xuICAgIHZhciBfYSA9IHVzZVN0YXRlKHVuZGVmaW5lZCksIGRyYWdnaW5nSXRlbXMgPSBfYVswXSwgc2V0RHJhZ2dpbmdJdGVtcyA9IF9hWzFdO1xuICAgIHZhciBpdGVtSGVpZ2h0ID0gdXNlUmVmKDApO1xuICAgIHZhciBlbnYgPSB1c2VUcmVlRW52aXJvbm1lbnQoKTtcbiAgICB2YXIgZ2V0UGFyZW50T2ZMaW5lYXJJdGVtID0gdXNlR2V0R2V0UGFyZW50T2ZMaW5lYXJJdGVtKCk7XG4gICAgdmFyIGlzTmV3RHJhZ1Bvc2l0aW9uID0gdXNlU3RhYmxlSGFuZGxlcihmdW5jdGlvbiAoZSwgdHJlZUlkLCBob3ZlcmluZ1Bvc2l0aW9uKSB7XG4gICAgICAgIGlmICghaG92ZXJpbmdQb3NpdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBvZmZzZXQgPSBob3ZlcmluZ1Bvc2l0aW9uLm9mZnNldCwgbGluZWFySW5kZXggPSBob3ZlcmluZ1Bvc2l0aW9uLmxpbmVhckluZGV4O1xuICAgICAgICB2YXIgbmV3RHJhZ0NvZGUgPSBcIlwiLmNvbmNhdCh0cmVlSWQsIFwiX19cIikuY29uY2F0KGxpbmVhckluZGV4LCBcIl9fXCIpLmNvbmNhdChvZmZzZXQgIT09IG51bGwgJiYgb2Zmc2V0ICE9PSB2b2lkIDAgPyBvZmZzZXQgOiAnJywgXCJfX1wiKS5jb25jYXQoaG92ZXJpbmdQb3NpdGlvbi5pbmRlbnRhdGlvbik7XG4gICAgICAgIGlmIChuZXdEcmFnQ29kZSAhPT0gZHJhZ0NvZGUuY3VycmVudCkge1xuICAgICAgICAgICAgZHJhZ0NvZGUuY3VycmVudCA9IG5ld0RyYWdDb2RlO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgdW5kZWZpbmVkIGZvciBpbnZhbGlkIGRyb3AgdGFyZ2V0cywgbGlrZSBvdXRzaWRlIHRoZSB0cmVlLlxuICAgICAqL1xuICAgIHZhciBnZXRIb3ZlcmluZ1Bvc2l0aW9uID0gdXNlU3RhYmxlSGFuZGxlcihmdW5jdGlvbiAoZSwgdHJlZUlkLCBjb250YWluZXJSZWYpIHtcbiAgICAgICAgaWYgKCFjb250YWluZXJSZWYuY3VycmVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdHJlZUJiID0gY29udGFpbmVyUmVmLmN1cnJlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIGlmIChpc091dHNpZGVPZkNvbnRhaW5lcihlLCB0cmVlQmIpKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIHZhciBob3ZlcmluZ1Bvc2l0aW9uID0gKGUuY2xpZW50WSAtIHRyZWVCYi50b3ApIC8gaXRlbUhlaWdodC5jdXJyZW50O1xuICAgICAgICB2YXIgdHJlZUxpbmVhckl0ZW1zID0gZW52LmxpbmVhckl0ZW1zW3RyZWVJZF07XG4gICAgICAgIHZhciBsaW5lYXJJbmRleCA9IE1hdGgubWluKE1hdGgubWF4KDAsIE1hdGguZmxvb3IoaG92ZXJpbmdQb3NpdGlvbikpLCB0cmVlTGluZWFySXRlbXMubGVuZ3RoIC0gMSk7XG4gICAgICAgIGlmICh0cmVlTGluZWFySXRlbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGxpbmVhckluZGV4OiAwLFxuICAgICAgICAgICAgICAgIG9mZnNldDogJ2JvdHRvbScsXG4gICAgICAgICAgICAgICAgaW5kZW50YXRpb246IDAsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHZhciB0YXJnZXRMaW5lYXJJdGVtID0gdHJlZUxpbmVhckl0ZW1zW2xpbmVhckluZGV4XTtcbiAgICAgICAgdmFyIHRhcmdldEl0ZW0gPSBlbnYuaXRlbXNbdGFyZ2V0TGluZWFySXRlbS5pdGVtXTtcbiAgICAgICAgdmFyIGluZGVudGF0aW9uID0gIWVudi5yZW5kZXJEZXB0aE9mZnNldFxuICAgICAgICAgICAgPyB1bmRlZmluZWRcbiAgICAgICAgICAgIDogTWF0aC5tYXgoTWF0aC5mbG9vcigoZS5jbGllbnRYIC0gdHJlZUJiLmxlZnQpIC8gZW52LnJlbmRlckRlcHRoT2Zmc2V0KSwgMCk7XG4gICAgICAgIHZhciBvZmZzZXQ7XG4gICAgICAgIHZhciBsaW5lVGhyZXNob2xkID0gIWVudi5jYW5SZW9yZGVySXRlbXNcbiAgICAgICAgICAgID8gMFxuICAgICAgICAgICAgOiAoKHRhcmdldEl0ZW0gPT09IG51bGwgfHwgdGFyZ2V0SXRlbSA9PT0gdm9pZCAwID8gdm9pZCAwIDogdGFyZ2V0SXRlbS5pc0ZvbGRlcikgJiYgZW52LmNhbkRyb3BPbkZvbGRlcikgfHxcbiAgICAgICAgICAgICAgICBlbnYuY2FuRHJvcE9uTm9uRm9sZGVyXG4gICAgICAgICAgICAgICAgPyAwLjJcbiAgICAgICAgICAgICAgICA6IDAuNTtcbiAgICAgICAgaWYgKGhvdmVyaW5nUG9zaXRpb24gLSAwLjUgPj0gdHJlZUxpbmVhckl0ZW1zLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgIC8vIHZlcnkgYm90dG9tLCBhbHdheXMgdXNlIG9mZnNldCBcImJvdHRvbVwiXG4gICAgICAgICAgICBvZmZzZXQgPSAnYm90dG9tJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChob3ZlcmluZ1Bvc2l0aW9uICUgMSA8IGxpbmVUaHJlc2hvbGQpIHtcbiAgICAgICAgICAgIG9mZnNldCA9ICd0b3AnO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGhvdmVyaW5nUG9zaXRpb24gJSAxID4gMSAtIGxpbmVUaHJlc2hvbGQpIHtcbiAgICAgICAgICAgIG9mZnNldCA9ICdib3R0b20nO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IGxpbmVhckluZGV4OiBsaW5lYXJJbmRleCwgb2Zmc2V0OiBvZmZzZXQsIGluZGVudGF0aW9uOiBpbmRlbnRhdGlvbiB9O1xuICAgIH0pO1xuICAgIC8vIHJldHVybmluZyB1bmRlZmluZWQgbWVhbnMgY2FsbGluZyBvbkRyYWdBdFBvc2l0aW9uKHVuZGVmaW5lZCksIHJldHVybmluZyBhIGRyb3Bwb3NpdGlvbiBtZWFucyBjYWxsaW5nIG9uUGVyZm9ybURyYWcoZHJvcHBvc2l0aW9uKVxuICAgIC8vIFRPRE8gb2xkIGZ1bmN0aW9uIHNvbWV0aW1lcyByZXR1cm5lZCB1bmRlZmluZWQgd2hlbiBvbGQgc3RhdGUgY291bGQgYmUga2VwdDsgaXMgaXQgb2theSB0byBhbHNvIHJldHVybiB1bmRlZmluZWQgdG8gZW50ZXIgaW52YWxpZCBkcm9wIHN0YXRlIGhlcmU/IGUuZy4gIXRoaXMuZHJhZ2dpbmdJdGVtcywgIWNhbkRyYWdBbmREcm9wLi4uXG4gICAgdmFyIGdldERyYWdnaW5nUG9zaXRpb24gPSB1c2VTdGFibGVIYW5kbGVyKGZ1bmN0aW9uIChlLCB0cmVlSWQsIGNvbnRhaW5lclJlZikge1xuICAgICAgICB2YXIgaG92ZXJpbmdQb3NpdGlvbiA9IGdldEhvdmVyaW5nUG9zaXRpb24oZSwgdHJlZUlkLCBjb250YWluZXJSZWYpO1xuICAgICAgICBpZiAoIWlzTmV3RHJhZ1Bvc2l0aW9uKGUsIHRyZWVJZCwgaG92ZXJpbmdQb3NpdGlvbikpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFkcmFnZ2luZ0l0ZW1zIHx8XG4gICAgICAgICAgICAhZW52LmNhbkRyYWdBbmREcm9wIHx8XG4gICAgICAgICAgICAhaG92ZXJpbmdQb3NpdGlvbiB8fFxuICAgICAgICAgICAgZS5jbGllbnRYIDwgMCB8fFxuICAgICAgICAgICAgZS5jbGllbnRZIDwgMCkge1xuICAgICAgICAgICAgcmV0dXJuICdpbnZhbGlkJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IERyYWdnaW5nUG9zaXRpb25FdmFsdWF0aW9uKGVudiwgZSwgdHJlZUlkLCBob3ZlcmluZ1Bvc2l0aW9uLCBkcmFnZ2luZ0l0ZW1zLCBnZXRQYXJlbnRPZkxpbmVhckl0ZW0pLmdldERyYWdnaW5nUG9zaXRpb24oKTtcbiAgICB9KTtcbiAgICB2YXIgaW5pdGlhdGVEcmFnZ2luZ1Bvc2l0aW9uID0gdXNlU3RhYmxlSGFuZGxlcihmdW5jdGlvbiAodHJlZUlkLCBpdGVtcykge1xuICAgICAgICBzZXREcmFnZ2luZ0l0ZW1zKGl0ZW1zKTtcbiAgICAgICAgZHJhZ0NvZGUuY3VycmVudCA9ICdpbml0aWFsJztcbiAgICAgICAgaXRlbUhlaWdodC5jdXJyZW50ID0gY29tcHV0ZUl0ZW1IZWlnaHQodHJlZUlkKTtcbiAgICB9KTtcbiAgICB2YXIgcmVzZXREcmFnZ2luZ1Bvc2l0aW9uID0gdXNlU3RhYmxlSGFuZGxlcihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNldERyYWdnaW5nSXRlbXModW5kZWZpbmVkKTtcbiAgICAgICAgZHJhZ0NvZGUuY3VycmVudCA9ICdpbml0aWFsJztcbiAgICAgICAgaXRlbUhlaWdodC5jdXJyZW50ID0gMDtcbiAgICB9KTtcbiAgICByZXR1cm4ge1xuICAgICAgICBpbml0aWF0ZURyYWdnaW5nUG9zaXRpb246IGluaXRpYXRlRHJhZ2dpbmdQb3NpdGlvbixcbiAgICAgICAgcmVzZXREcmFnZ2luZ1Bvc2l0aW9uOiByZXNldERyYWdnaW5nUG9zaXRpb24sXG4gICAgICAgIGRyYWdnaW5nSXRlbXM6IGRyYWdnaW5nSXRlbXMsXG4gICAgICAgIGdldERyYWdnaW5nUG9zaXRpb246IGdldERyYWdnaW5nUG9zaXRpb24sXG4gICAgICAgIGl0ZW1IZWlnaHQ6IGl0ZW1IZWlnaHQsXG4gICAgfTtcbn07XG4iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZVRyZWVFbnZpcm9ubWVudCB9IGZyb20gJy4uL2NvbnRyb2xsZWRFbnZpcm9ubWVudC9Db250cm9sbGVkVHJlZUVudmlyb25tZW50JztcbmltcG9ydCB7IHVzZUNhbkRyb3BBdCB9IGZyb20gJy4vdXNlQ2FuRHJvcEF0JztcbmltcG9ydCB7IHVzZUdldFZpYWJsZURyYWdQb3NpdGlvbnMgfSBmcm9tICcuL3VzZUdldFZpYWJsZURyYWdQb3NpdGlvbnMnO1xuaW1wb3J0IHsgdXNlU2lkZUVmZmVjdCB9IGZyb20gJy4uL3VzZVNpZGVFZmZlY3QnO1xuaW1wb3J0IHsgYnVpbGRNYXBGb3JUcmVlcyB9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCB7IHVzZUNhbGxTb29uIH0gZnJvbSAnLi4vdXNlQ2FsbFNvb24nO1xuaW1wb3J0IHsgdXNlU3RhYmxlSGFuZGxlciB9IGZyb20gJy4uL3VzZVN0YWJsZUhhbmRsZXInO1xuaW1wb3J0IHsgdXNlR2V0T3JpZ2luYWxJdGVtT3JkZXIgfSBmcm9tICcuLi91c2VHZXRPcmlnaW5hbEl0ZW1PcmRlcic7XG5pbXBvcnQgeyB1c2VEcmFnZ2luZ1Bvc2l0aW9uIH0gZnJvbSAnLi91c2VEcmFnZ2luZ1Bvc2l0aW9uJztcbmltcG9ydCB7IGlzT3V0c2lkZU9mQ29udGFpbmVyIH0gZnJvbSAnLi4vY29udHJvbGxlZEVudmlyb25tZW50L2xheW91dFV0aWxzJztcbnZhciBEcmFnQW5kRHJvcENvbnRleHQgPSBSZWFjdC5jcmVhdGVDb250ZXh0KG51bGwpO1xuZXhwb3J0IHZhciB1c2VEcmFnQW5kRHJvcCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIFJlYWN0LnVzZUNvbnRleHQoRHJhZ0FuZERyb3BDb250ZXh0KTsgfTtcbmV4cG9ydCB2YXIgRHJhZ0FuZERyb3BQcm92aWRlciA9IGZ1bmN0aW9uIChfYSkge1xuICAgIHZhciBjaGlsZHJlbiA9IF9hLmNoaWxkcmVuO1xuICAgIHZhciBlbnZpcm9ubWVudCA9IHVzZVRyZWVFbnZpcm9ubWVudCgpO1xuICAgIHZhciBfYiA9IHVzZVN0YXRlKGZhbHNlKSwgaXNQcm9ncmFtbWF0aWNhbGx5RHJhZ2dpbmcgPSBfYlswXSwgc2V0SXNQcm9ncmFtbWF0aWNhbGx5RHJhZ2dpbmcgPSBfYlsxXTtcbiAgICB2YXIgX2MgPSB1c2VTdGF0ZSh7fSksIHZpYWJsZURyYWdQb3NpdGlvbnMgPSBfY1swXSwgc2V0VmlhYmxlRHJhZ1Bvc2l0aW9ucyA9IF9jWzFdO1xuICAgIHZhciBfZCA9IHVzZVN0YXRlKDApLCBwcm9ncmFtbWF0aWNEcmFnSW5kZXggPSBfZFswXSwgc2V0UHJvZ3JhbW1hdGljRHJhZ0luZGV4ID0gX2RbMV07XG4gICAgdmFyIF9lID0gdXNlU3RhdGUoKSwgZHJhZ2dpbmdQb3NpdGlvbiA9IF9lWzBdLCBzZXREcmFnZ2luZ1Bvc2l0aW9uID0gX2VbMV07XG4gICAgdmFyIGdldFZpYWJsZURyYWdQb3NpdGlvbnMgPSB1c2VHZXRWaWFibGVEcmFnUG9zaXRpb25zKCk7XG4gICAgdmFyIGNhbGxTb29uID0gdXNlQ2FsbFNvb24oKTtcbiAgICB2YXIgZ2V0T3JpZ2luYWxJdGVtT3JkZXIgPSB1c2VHZXRPcmlnaW5hbEl0ZW1PcmRlcigpO1xuICAgIHZhciBfZiA9IHVzZURyYWdnaW5nUG9zaXRpb24oKSwgaW5pdGlhdGVEcmFnZ2luZ1Bvc2l0aW9uID0gX2YuaW5pdGlhdGVEcmFnZ2luZ1Bvc2l0aW9uLCByZXNldERyYWdnaW5nUG9zaXRpb24gPSBfZi5yZXNldERyYWdnaW5nUG9zaXRpb24sIGRyYWdnaW5nSXRlbXMgPSBfZi5kcmFnZ2luZ0l0ZW1zLCBnZXREcmFnZ2luZ1Bvc2l0aW9uID0gX2YuZ2V0RHJhZ2dpbmdQb3NpdGlvbiwgaXRlbUhlaWdodCA9IF9mLml0ZW1IZWlnaHQ7XG4gICAgdmFyIHJlc2V0UHJvZ3JhbW1hdGljRHJhZ0luZGV4Rm9yQ3VycmVudFRyZWUgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAodmlhYmxlRHJhZ1Bvc2l0aW9ucywgZHJhZ2dpbmdJdGVtcykge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIGlmIChlbnZpcm9ubWVudC5hY3RpdmVUcmVlSWQgJiZcbiAgICAgICAgICAgICgoX2EgPSBlbnZpcm9ubWVudC52aWV3U3RhdGVbZW52aXJvbm1lbnQuYWN0aXZlVHJlZUlkXSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmZvY3VzZWRJdGVtKSAmJlxuICAgICAgICAgICAgZW52aXJvbm1lbnQubGluZWFySXRlbXMgJiZcbiAgICAgICAgICAgIGRyYWdnaW5nSXRlbXMpIHtcbiAgICAgICAgICAgIHZhciBmb2N1c0l0ZW1fMSA9IGVudmlyb25tZW50LnZpZXdTdGF0ZVtlbnZpcm9ubWVudC5hY3RpdmVUcmVlSWRdLmZvY3VzZWRJdGVtO1xuICAgICAgICAgICAgdmFyIHRyZWVEcmFnUG9zaXRpb25zID0gZ2V0VmlhYmxlRHJhZ1Bvc2l0aW9ucyhlbnZpcm9ubWVudC5hY3RpdmVUcmVlSWQsIGRyYWdnaW5nSXRlbXMpO1xuICAgICAgICAgICAgdmFyIG5ld1BvcyA9IHRyZWVEcmFnUG9zaXRpb25zLmZpbmRJbmRleChmdW5jdGlvbiAocG9zKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBvcy50YXJnZXRUeXBlID09PSAnaXRlbScpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBvcy50YXJnZXRJdGVtID09PSBmb2N1c0l0ZW1fMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHBvcy50YXJnZXRUeXBlID09PSAnYmV0d2Vlbi1pdGVtcycpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChlbnZpcm9ubWVudC5pdGVtc1twb3MucGFyZW50SXRlbV0uY2hpbGRyZW5bcG9zLmNoaWxkSW5kZXhdID09PVxuICAgICAgICAgICAgICAgICAgICAgICAgZm9jdXNJdGVtXzEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChuZXdQb3MpIHtcbiAgICAgICAgICAgICAgICBzZXRQcm9ncmFtbWF0aWNEcmFnSW5kZXgoTWF0aC5taW4obmV3UG9zICsgMSwgdHJlZURyYWdQb3NpdGlvbnMubGVuZ3RoIC0gMSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgc2V0UHJvZ3JhbW1hdGljRHJhZ0luZGV4KDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc2V0UHJvZ3JhbW1hdGljRHJhZ0luZGV4KDApO1xuICAgICAgICB9XG4gICAgfSwgW1xuICAgICAgICBlbnZpcm9ubWVudC5hY3RpdmVUcmVlSWQsXG4gICAgICAgIGVudmlyb25tZW50Lml0ZW1zLFxuICAgICAgICBlbnZpcm9ubWVudC5saW5lYXJJdGVtcyxcbiAgICAgICAgZW52aXJvbm1lbnQudmlld1N0YXRlLFxuICAgICAgICBnZXRWaWFibGVEcmFnUG9zaXRpb25zLFxuICAgIF0pO1xuICAgIHZhciByZXNldFN0YXRlID0gdXNlU3RhYmxlSGFuZGxlcihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNldElzUHJvZ3JhbW1hdGljYWxseURyYWdnaW5nKGZhbHNlKTtcbiAgICAgICAgc2V0VmlhYmxlRHJhZ1Bvc2l0aW9ucyh7fSk7XG4gICAgICAgIHNldFByb2dyYW1tYXRpY0RyYWdJbmRleCgwKTtcbiAgICAgICAgc2V0RHJhZ2dpbmdQb3NpdGlvbih1bmRlZmluZWQpO1xuICAgICAgICByZXNldERyYWdnaW5nUG9zaXRpb24oKTtcbiAgICB9KTtcbiAgICB1c2VTaWRlRWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGVudmlyb25tZW50LmFjdGl2ZVRyZWVJZCAmJlxuICAgICAgICAgICAgZW52aXJvbm1lbnQubGluZWFySXRlbXNbZW52aXJvbm1lbnQuYWN0aXZlVHJlZUlkXSAmJlxuICAgICAgICAgICAgdmlhYmxlRHJhZ1Bvc2l0aW9uc1tlbnZpcm9ubWVudC5hY3RpdmVUcmVlSWRdKSB7XG4gICAgICAgICAgICByZXNldFByb2dyYW1tYXRpY0RyYWdJbmRleEZvckN1cnJlbnRUcmVlKHZpYWJsZURyYWdQb3NpdGlvbnNbZW52aXJvbm1lbnQuYWN0aXZlVHJlZUlkXSwgZHJhZ2dpbmdJdGVtcyk7XG4gICAgICAgIH1cbiAgICB9LCBbXG4gICAgICAgIGRyYWdnaW5nSXRlbXMsXG4gICAgICAgIGVudmlyb25tZW50LmFjdGl2ZVRyZWVJZCxcbiAgICAgICAgZW52aXJvbm1lbnQubGluZWFySXRlbXMsXG4gICAgICAgIHJlc2V0UHJvZ3JhbW1hdGljRHJhZ0luZGV4Rm9yQ3VycmVudFRyZWUsXG4gICAgICAgIHZpYWJsZURyYWdQb3NpdGlvbnMsXG4gICAgXSwgW2Vudmlyb25tZW50LmFjdGl2ZVRyZWVJZF0pO1xuICAgIHVzZVNpZGVFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoaXNQcm9ncmFtbWF0aWNhbGx5RHJhZ2dpbmcgJiYgZW52aXJvbm1lbnQuYWN0aXZlVHJlZUlkKSB7XG4gICAgICAgICAgICBzZXREcmFnZ2luZ1Bvc2l0aW9uKHZpYWJsZURyYWdQb3NpdGlvbnNbZW52aXJvbm1lbnQuYWN0aXZlVHJlZUlkXVtwcm9ncmFtbWF0aWNEcmFnSW5kZXhdKTtcbiAgICAgICAgfVxuICAgIH0sIFtcbiAgICAgICAgcHJvZ3JhbW1hdGljRHJhZ0luZGV4LFxuICAgICAgICBlbnZpcm9ubWVudC5hY3RpdmVUcmVlSWQsXG4gICAgICAgIGlzUHJvZ3JhbW1hdGljYWxseURyYWdnaW5nLFxuICAgICAgICB2aWFibGVEcmFnUG9zaXRpb25zLFxuICAgIF0sIFtwcm9ncmFtbWF0aWNEcmFnSW5kZXgsIGVudmlyb25tZW50LmFjdGl2ZVRyZWVJZF0pO1xuICAgIHZhciBjYW5Ecm9wQXQgPSB1c2VDYW5Ecm9wQXQoKTtcbiAgICB2YXIgcGVyZm9ybURyYWcgPSBmdW5jdGlvbiAoZHJhZ2dpbmdQb3NpdGlvbikge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIGlmIChkcmFnZ2luZ0l0ZW1zICYmICFjYW5Ecm9wQXQoZHJhZ2dpbmdQb3NpdGlvbiwgZHJhZ2dpbmdJdGVtcykpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBzZXREcmFnZ2luZ1Bvc2l0aW9uKGRyYWdnaW5nUG9zaXRpb24pO1xuICAgICAgICBlbnZpcm9ubWVudC5zZXRBY3RpdmVUcmVlKGRyYWdnaW5nUG9zaXRpb24udHJlZUlkKTtcbiAgICAgICAgaWYgKGRyYWdnaW5nSXRlbXMgJiYgZW52aXJvbm1lbnQuYWN0aXZlVHJlZUlkICE9PSBkcmFnZ2luZ1Bvc2l0aW9uLnRyZWVJZCkge1xuICAgICAgICAgICAgLy8gVE9ETyBtYXliZSBkbyBvbmx5IGlmIGRyYWdnaW5nSXRlbXMgYXJlIGRpZmZlcmVudCB0byBzZWxlY3RlZEl0ZW1zXG4gICAgICAgICAgICAoX2EgPSBlbnZpcm9ubWVudC5vblNlbGVjdEl0ZW1zKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuY2FsbChlbnZpcm9ubWVudCwgZHJhZ2dpbmdJdGVtcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHsgcmV0dXJuIGl0ZW0uaW5kZXg7IH0pLCBkcmFnZ2luZ1Bvc2l0aW9uLnRyZWVJZCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHZhciBvbkRyYWdPdmVyVHJlZUhhbmRsZXIgPSB1c2VTdGFibGVIYW5kbGVyKGZ1bmN0aW9uIChlLCB0cmVlSWQsIGNvbnRhaW5lclJlZikge1xuICAgICAgICBpZiAoIWRyYWdnaW5nSXRlbXMpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHZhciBuZXdEcmFnZ2luZ1Bvc2l0aW9uID0gZ2V0RHJhZ2dpbmdQb3NpdGlvbihlLCB0cmVlSWQsIGNvbnRhaW5lclJlZik7XG4gICAgICAgIGlmICghbmV3RHJhZ2dpbmdQb3NpdGlvbilcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgaWYgKG5ld0RyYWdnaW5nUG9zaXRpb24gPT09ICdpbnZhbGlkJykge1xuICAgICAgICAgICAgc2V0RHJhZ2dpbmdQb3NpdGlvbih1bmRlZmluZWQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHBlcmZvcm1EcmFnKG5ld0RyYWdnaW5nUG9zaXRpb24pO1xuICAgIH0pO1xuICAgIHZhciBvbkRyYWdMZWF2ZUNvbnRhaW5lckhhbmRsZXIgPSB1c2VTdGFibGVIYW5kbGVyKGZ1bmN0aW9uIChlLCBjb250YWluZXJSZWYpIHtcbiAgICAgICAgaWYgKCFjb250YWluZXJSZWYuY3VycmVudClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgaWYgKGlzT3V0c2lkZU9mQ29udGFpbmVyKGUsIGNvbnRhaW5lclJlZi5jdXJyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpKSkge1xuICAgICAgICAgICAgc2V0RHJhZ2dpbmdQb3NpdGlvbih1bmRlZmluZWQpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgdmFyIG9uRHJvcEhhbmRsZXIgPSB1c2VTdGFibGVIYW5kbGVyKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCFkcmFnZ2luZ0l0ZW1zIHx8ICFkcmFnZ2luZ1Bvc2l0aW9uIHx8ICFlbnZpcm9ubWVudC5vbkRyb3ApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBlbnZpcm9ubWVudC5vbkRyb3AoZHJhZ2dpbmdJdGVtcywgZHJhZ2dpbmdQb3NpdGlvbik7XG4gICAgICAgIGNhbGxTb29uKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgIChfYSA9IGVudmlyb25tZW50Lm9uRm9jdXNJdGVtKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuY2FsbChlbnZpcm9ubWVudCwgZHJhZ2dpbmdJdGVtc1swXSwgZHJhZ2dpbmdQb3NpdGlvbi50cmVlSWQpO1xuICAgICAgICAgICAgcmVzZXRTdGF0ZSgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICB2YXIgb25TdGFydERyYWdnaW5nSXRlbXMgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoaXRlbXMsIHRyZWVJZCkge1xuICAgICAgICB2YXIgdHJlZVZpYWJsZURyYWdQb3NpdGlvbnMgPSBidWlsZE1hcEZvclRyZWVzKGVudmlyb25tZW50LnRyZWVJZHMsIGZ1bmN0aW9uICh0cmVlSWQpIHsgcmV0dXJuIGdldFZpYWJsZURyYWdQb3NpdGlvbnModHJlZUlkLCBpdGVtcyk7IH0pO1xuICAgICAgICBpbml0aWF0ZURyYWdnaW5nUG9zaXRpb24odHJlZUlkLCBpdGVtcyk7XG4gICAgICAgIC8vIFRPRE8gd2hhdCBpZiB0cmVlcyBoYXZlIGRpZmZlcmVudCBoZWlnaHRzIGFuZCBkcmFnIHRhcmdldCBjaGFuZ2VzP1xuICAgICAgICBzZXRWaWFibGVEcmFnUG9zaXRpb25zKHRyZWVWaWFibGVEcmFnUG9zaXRpb25zKTtcbiAgICAgICAgaWYgKGVudmlyb25tZW50LmFjdGl2ZVRyZWVJZCkge1xuICAgICAgICAgICAgcmVzZXRQcm9ncmFtbWF0aWNEcmFnSW5kZXhGb3JDdXJyZW50VHJlZSh0cmVlVmlhYmxlRHJhZ1Bvc2l0aW9uc1tlbnZpcm9ubWVudC5hY3RpdmVUcmVlSWRdLCBpdGVtcyk7XG4gICAgICAgIH1cbiAgICB9LCBbXG4gICAgICAgIGVudmlyb25tZW50LmFjdGl2ZVRyZWVJZCxcbiAgICAgICAgZW52aXJvbm1lbnQudHJlZUlkcyxcbiAgICAgICAgZ2V0VmlhYmxlRHJhZ1Bvc2l0aW9ucyxcbiAgICAgICAgaW5pdGlhdGVEcmFnZ2luZ1Bvc2l0aW9uLFxuICAgICAgICByZXNldFByb2dyYW1tYXRpY0RyYWdJbmRleEZvckN1cnJlbnRUcmVlLFxuICAgIF0pO1xuICAgIHZhciBzdGFydFByb2dyYW1tYXRpY0RyYWcgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfYSwgX2IsIF9jO1xuICAgICAgICBpZiAoIWVudmlyb25tZW50LmNhbkRyYWdBbmREcm9wKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVudmlyb25tZW50LmFjdGl2ZVRyZWVJZCkge1xuICAgICAgICAgICAgdmFyIGRyYWdnaW5nSXRlbXNfMSA9IChfYiA9IChfYSA9IGVudmlyb25tZW50LnZpZXdTdGF0ZVtlbnZpcm9ubWVudC5hY3RpdmVUcmVlSWRdKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Euc2VsZWN0ZWRJdGVtcykgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogW1xuICAgICAgICAgICAgICAgIChfYyA9IGVudmlyb25tZW50LnZpZXdTdGF0ZVtlbnZpcm9ubWVudC5hY3RpdmVUcmVlSWRdKSA9PT0gbnVsbCB8fCBfYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2MuZm9jdXNlZEl0ZW0sXG4gICAgICAgICAgICBdO1xuICAgICAgICAgICAgaWYgKGRyYWdnaW5nSXRlbXNfMS5sZW5ndGggPT09IDAgfHwgZHJhZ2dpbmdJdGVtc18xWzBdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgcmVzb2x2ZWREcmFnZ2luZ0l0ZW1zID0gZ2V0T3JpZ2luYWxJdGVtT3JkZXIoZW52aXJvbm1lbnQuYWN0aXZlVHJlZUlkLCBkcmFnZ2luZ0l0ZW1zXzEubWFwKGZ1bmN0aW9uIChpZCkgeyByZXR1cm4gZW52aXJvbm1lbnQuaXRlbXNbaWRdOyB9KSk7XG4gICAgICAgICAgICBpZiAoZW52aXJvbm1lbnQuY2FuRHJhZyAmJiAhZW52aXJvbm1lbnQuY2FuRHJhZyhyZXNvbHZlZERyYWdnaW5nSXRlbXMpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb25TdGFydERyYWdnaW5nSXRlbXMocmVzb2x2ZWREcmFnZ2luZ0l0ZW1zLCBlbnZpcm9ubWVudC5hY3RpdmVUcmVlSWQpO1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2V0SXNQcm9ncmFtbWF0aWNhbGx5RHJhZ2dpbmcodHJ1ZSk7XG4gICAgICAgICAgICAgICAgLy8gTmVlZHMgdG8gYmUgZG9uZSBhZnRlciBvblN0YXJ0RHJhZ2dpbmdJdGVtcyB3YXMgY2FsbGVkLCBzbyB0aGF0IHZpYWJsZURyYWdQb3NpdGlvbnMgaXMgcG9wdWxhdGVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sIFtlbnZpcm9ubWVudCwgZ2V0T3JpZ2luYWxJdGVtT3JkZXIsIG9uU3RhcnREcmFnZ2luZ0l0ZW1zXSk7XG4gICAgdmFyIGFib3J0UHJvZ3JhbW1hdGljRHJhZyA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmVzZXRTdGF0ZSgpO1xuICAgIH0sIFtyZXNldFN0YXRlXSk7XG4gICAgdmFyIGNvbXBsZXRlUHJvZ3JhbW1hdGljRHJhZyA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgb25Ecm9wSGFuZGxlcigpO1xuICAgICAgICByZXNldFN0YXRlKCk7XG4gICAgfSwgW29uRHJvcEhhbmRsZXIsIHJlc2V0U3RhdGVdKTtcbiAgICB2YXIgcHJvZ3JhbW1hdGljRHJhZ1VwID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKCkge1xuICAgICAgICBzZXRQcm9ncmFtbWF0aWNEcmFnSW5kZXgoZnVuY3Rpb24gKG9sZEluZGV4KSB7IHJldHVybiBNYXRoLm1heCgwLCBvbGRJbmRleCAtIDEpOyB9KTtcbiAgICB9LCBbXSk7XG4gICAgdmFyIHByb2dyYW1tYXRpY0RyYWdEb3duID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoZW52aXJvbm1lbnQuYWN0aXZlVHJlZUlkKSB7XG4gICAgICAgICAgICBzZXRQcm9ncmFtbWF0aWNEcmFnSW5kZXgoZnVuY3Rpb24gKG9sZEluZGV4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGgubWluKHZpYWJsZURyYWdQb3NpdGlvbnNbZW52aXJvbm1lbnQuYWN0aXZlVHJlZUlkXS5sZW5ndGgsIG9sZEluZGV4ICsgMSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sIFtlbnZpcm9ubWVudC5hY3RpdmVUcmVlSWQsIHZpYWJsZURyYWdQb3NpdGlvbnNdKTtcbiAgICB2YXIgZG5kID0gdXNlTWVtbyhmdW5jdGlvbiAoKSB7IHJldHVybiAoe1xuICAgICAgICBvblN0YXJ0RHJhZ2dpbmdJdGVtczogb25TdGFydERyYWdnaW5nSXRlbXMsXG4gICAgICAgIHN0YXJ0UHJvZ3JhbW1hdGljRHJhZzogc3RhcnRQcm9ncmFtbWF0aWNEcmFnLFxuICAgICAgICBhYm9ydFByb2dyYW1tYXRpY0RyYWc6IGFib3J0UHJvZ3JhbW1hdGljRHJhZyxcbiAgICAgICAgY29tcGxldGVQcm9ncmFtbWF0aWNEcmFnOiBjb21wbGV0ZVByb2dyYW1tYXRpY0RyYWcsXG4gICAgICAgIHByb2dyYW1tYXRpY0RyYWdVcDogcHJvZ3JhbW1hdGljRHJhZ1VwLFxuICAgICAgICBwcm9ncmFtbWF0aWNEcmFnRG93bjogcHJvZ3JhbW1hdGljRHJhZ0Rvd24sXG4gICAgICAgIGRyYWdnaW5nSXRlbXM6IGRyYWdnaW5nSXRlbXMsXG4gICAgICAgIGRyYWdnaW5nUG9zaXRpb246IGRyYWdnaW5nUG9zaXRpb24sXG4gICAgICAgIGl0ZW1IZWlnaHQ6IGl0ZW1IZWlnaHQuY3VycmVudCxcbiAgICAgICAgaXNQcm9ncmFtbWF0aWNhbGx5RHJhZ2dpbmc6IGlzUHJvZ3JhbW1hdGljYWxseURyYWdnaW5nLFxuICAgICAgICBvbkRyYWdPdmVyVHJlZUhhbmRsZXI6IG9uRHJhZ092ZXJUcmVlSGFuZGxlcixcbiAgICAgICAgb25EcmFnTGVhdmVDb250YWluZXJIYW5kbGVyOiBvbkRyYWdMZWF2ZUNvbnRhaW5lckhhbmRsZXIsXG4gICAgICAgIHZpYWJsZURyYWdQb3NpdGlvbnM6IHZpYWJsZURyYWdQb3NpdGlvbnMsXG4gICAgfSk7IH0sIFtcbiAgICAgICAgYWJvcnRQcm9ncmFtbWF0aWNEcmFnLFxuICAgICAgICBjb21wbGV0ZVByb2dyYW1tYXRpY0RyYWcsXG4gICAgICAgIGRyYWdnaW5nSXRlbXMsXG4gICAgICAgIGRyYWdnaW5nUG9zaXRpb24sXG4gICAgICAgIGlzUHJvZ3JhbW1hdGljYWxseURyYWdnaW5nLFxuICAgICAgICBpdGVtSGVpZ2h0LFxuICAgICAgICBvbkRyYWdPdmVyVHJlZUhhbmRsZXIsXG4gICAgICAgIG9uRHJhZ0xlYXZlQ29udGFpbmVySGFuZGxlcixcbiAgICAgICAgb25TdGFydERyYWdnaW5nSXRlbXMsXG4gICAgICAgIHByb2dyYW1tYXRpY0RyYWdEb3duLFxuICAgICAgICBwcm9ncmFtbWF0aWNEcmFnVXAsXG4gICAgICAgIHN0YXJ0UHJvZ3JhbW1hdGljRHJhZyxcbiAgICAgICAgdmlhYmxlRHJhZ1Bvc2l0aW9ucyxcbiAgICBdKTtcbiAgICB1c2VFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2VuZCcsIHJlc2V0U3RhdGUpO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZHJvcCcsIG9uRHJvcEhhbmRsZXIpO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2RyYWdlbmQnLCByZXNldFN0YXRlKTtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdkcm9wJywgb25Ecm9wSGFuZGxlcik7XG4gICAgICAgIH07XG4gICAgfSwgW29uRHJvcEhhbmRsZXIsIHJlc2V0U3RhdGVdKTtcbiAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoRHJhZ0FuZERyb3BDb250ZXh0LlByb3ZpZGVyLCB7IHZhbHVlOiBkbmQgfSwgY2hpbGRyZW4pKTtcbn07XG4iLCJ2YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxuICAgICAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0O1xuICAgIH07XG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuaW1wb3J0IHsgdXNlSW1wZXJhdGl2ZUhhbmRsZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZVRyZWVFbnZpcm9ubWVudCB9IGZyb20gJy4uL2NvbnRyb2xsZWRFbnZpcm9ubWVudC9Db250cm9sbGVkVHJlZUVudmlyb25tZW50JztcbmltcG9ydCB7IHVzZURyYWdBbmREcm9wIH0gZnJvbSAnLi4vZHJhZy9EcmFnQW5kRHJvcFByb3ZpZGVyJztcbmV4cG9ydCB2YXIgdXNlQ3JlYXRlZEVudmlyb25tZW50UmVmID0gZnVuY3Rpb24gKHJlZiwgYWN0aW9ucykge1xuICAgIHZhciBlbnZpcm9ubWVudCA9IHVzZVRyZWVFbnZpcm9ubWVudCgpO1xuICAgIHZhciBkbmQgPSB1c2VEcmFnQW5kRHJvcCgpO1xuICAgIHVzZUltcGVyYXRpdmVIYW5kbGUocmVmLCBmdW5jdGlvbiAoKSB7IHJldHVybiAoX19hc3NpZ24oX19hc3NpZ24oX19hc3NpZ24oe30sIGFjdGlvbnMpLCBlbnZpcm9ubWVudCksIHsgdHJlZUVudmlyb25tZW50Q29udGV4dDogZW52aXJvbm1lbnQsIGRyYWdBbmREcm9wQ29udGV4dDogZG5kIH0pKTsgfSk7XG59O1xuIiwiZXhwb3J0IHZhciB3YWl0Rm9yID0gZnVuY3Rpb24gKGNoZWNrLCBpbnRlcnZhbE1zLCB0aW1lb3V0TXMpIHtcbiAgICBpZiAoaW50ZXJ2YWxNcyA9PT0gdm9pZCAwKSB7IGludGVydmFsTXMgPSA1MDsgfVxuICAgIGlmICh0aW1lb3V0TXMgPT09IHZvaWQgMCkgeyB0aW1lb3V0TXMgPSAxMDAwMDsgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgICAgICBpZiAoY2hlY2soKSkge1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBjb21wbGV0ZTtcbiAgICAgICAgdmFyIGludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKGNoZWNrKCkpIHtcbiAgICAgICAgICAgICAgICBjb21wbGV0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCBpbnRlcnZhbE1zKTtcbiAgICAgICAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbXBsZXRlKCk7XG4gICAgICAgIH0sIHRpbWVvdXRNcyk7XG4gICAgICAgIGNvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH07XG4gICAgfSk7XG59O1xuIiwidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG52YXIgX19nZW5lcmF0b3IgPSAodGhpcyAmJiB0aGlzLl9fZ2VuZXJhdG9yKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgYm9keSkge1xuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XG4gICAgICAgIHdoaWxlIChnICYmIChnID0gMCwgb3BbMF0gJiYgKF8gPSAwKSksIF8pIHRyeSB7XG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcbiAgICB9XG59O1xudmFyIF9fc3ByZWFkQXJyYXkgPSAodGhpcyAmJiB0aGlzLl9fc3ByZWFkQXJyYXkpIHx8IGZ1bmN0aW9uICh0bywgZnJvbSwgcGFjaykge1xuICAgIGlmIChwYWNrIHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIGZvciAodmFyIGkgPSAwLCBsID0gZnJvbS5sZW5ndGgsIGFyOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGlmIChhciB8fCAhKGkgaW4gZnJvbSkpIHtcbiAgICAgICAgICAgIGlmICghYXIpIGFyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSwgMCwgaSk7XG4gICAgICAgICAgICBhcltpXSA9IGZyb21baV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRvLmNvbmNhdChhciB8fCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tKSk7XG59O1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZU1lbW8gfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VEcmFnQW5kRHJvcCB9IGZyb20gJy4uL2RyYWcvRHJhZ0FuZERyb3BQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VUcmVlRW52aXJvbm1lbnQgfSBmcm9tICcuLi9jb250cm9sbGVkRW52aXJvbm1lbnQvQ29udHJvbGxlZFRyZWVFbnZpcm9ubWVudCc7XG5pbXBvcnQgeyB1c2VDcmVhdGVkRW52aXJvbm1lbnRSZWYgfSBmcm9tICcuL3VzZUNyZWF0ZWRFbnZpcm9ubWVudFJlZic7XG5pbXBvcnQgeyB1c2VSZWZDb3B5IH0gZnJvbSAnLi4vdXNlUmVmQ29weSc7XG5pbXBvcnQgeyB3YWl0Rm9yIH0gZnJvbSAnLi4vd2FpdEZvcic7XG52YXIgRW52aXJvbm1lbnRBY3Rpb25zQ29udGV4dCA9IFJlYWN0LmNyZWF0ZUNvbnRleHQobnVsbCk7XG5leHBvcnQgdmFyIHVzZUVudmlyb25tZW50QWN0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gUmVhY3QudXNlQ29udGV4dChFbnZpcm9ubWVudEFjdGlvbnNDb250ZXh0KTtcbn07XG52YXIgcmVjdXJzaXZlRXhwYW5kID0gZnVuY3Rpb24gKGl0ZW1JZCwgaXRlbXMsIG9uRXhwYW5kKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBfbG9vcF8xLCBfaSwgX2EsIGNoaWxkSWQ7XG4gICAgdmFyIF9iLCBfYywgX2Q7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfZSkge1xuICAgICAgICBfbG9vcF8xID0gZnVuY3Rpb24gKGNoaWxkSWQpIHtcbiAgICAgICAgICAgIHdhaXRGb3IoZnVuY3Rpb24gKCkgeyB2YXIgX2E7IHJldHVybiAhISgoX2EgPSBpdGVtcy5jdXJyZW50KSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2FbY2hpbGRJZF0pOyB9KS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSAoX2EgPSBpdGVtcy5jdXJyZW50KSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2FbY2hpbGRJZF07XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0gPT09IG51bGwgfHwgaXRlbSA9PT0gdm9pZCAwID8gdm9pZCAwIDogaXRlbS5pc0ZvbGRlcikge1xuICAgICAgICAgICAgICAgICAgICBvbkV4cGFuZChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgcmVjdXJzaXZlRXhwYW5kKGNoaWxkSWQsIGl0ZW1zLCBvbkV4cGFuZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIGZvciAoX2kgPSAwLCBfYSA9IChfZCA9IChfYyA9IChfYiA9IGl0ZW1zLmN1cnJlbnQpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYltpdGVtSWRdKSA9PT0gbnVsbCB8fCBfYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2MuY2hpbGRyZW4pICE9PSBudWxsICYmIF9kICE9PSB2b2lkIDAgPyBfZCA6IFtdOyBfaSA8IF9hLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgY2hpbGRJZCA9IF9hW19pXTtcbiAgICAgICAgICAgIF9sb29wXzEoY2hpbGRJZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgIH0pO1xufSk7IH07XG5leHBvcnQgdmFyIEVudmlyb25tZW50QWN0aW9uc1Byb3ZpZGVyID0gUmVhY3QuZm9yd2FyZFJlZihmdW5jdGlvbiAocHJvcHMsIHJlZikge1xuICAgIHZhciBfYSA9IHVzZVRyZWVFbnZpcm9ubWVudCgpLCBvbkNvbGxhcHNlSXRlbSA9IF9hLm9uQ29sbGFwc2VJdGVtLCBpdGVtcyA9IF9hLml0ZW1zLCB0cmVlcyA9IF9hLnRyZWVzLCB2aWV3U3RhdGUgPSBfYS52aWV3U3RhdGUsIG9uRXhwYW5kSXRlbSA9IF9hLm9uRXhwYW5kSXRlbSwgb25Gb2N1c0l0ZW0gPSBfYS5vbkZvY3VzSXRlbSwgc2V0QWN0aXZlVHJlZSA9IF9hLnNldEFjdGl2ZVRyZWUsIG9uUmVuYW1lSXRlbSA9IF9hLm9uUmVuYW1lSXRlbSwgb25TZWxlY3RJdGVtcyA9IF9hLm9uU2VsZWN0SXRlbXMsIG9uUHJpbWFyeUFjdGlvbiA9IF9hLm9uUHJpbWFyeUFjdGlvbiwgbGluZWFySXRlbXMgPSBfYS5saW5lYXJJdGVtcztcbiAgICB2YXIgX2IgPSB1c2VEcmFnQW5kRHJvcCgpLCBhYm9ydFByb2dyYW1tYXRpY0RyYWcgPSBfYi5hYm9ydFByb2dyYW1tYXRpY0RyYWcsIGNvbXBsZXRlUHJvZ3JhbW1hdGljRHJhZyA9IF9iLmNvbXBsZXRlUHJvZ3JhbW1hdGljRHJhZywgcHJvZ3JhbW1hdGljRHJhZ0Rvd24gPSBfYi5wcm9ncmFtbWF0aWNEcmFnRG93biwgcHJvZ3JhbW1hdGljRHJhZ1VwID0gX2IucHJvZ3JhbW1hdGljRHJhZ1VwLCBzdGFydFByb2dyYW1tYXRpY0RyYWcgPSBfYi5zdGFydFByb2dyYW1tYXRpY0RyYWc7XG4gICAgdmFyIGl0ZW1zUmVmID0gdXNlUmVmQ29weShpdGVtcyk7XG4gICAgLy8gVE9ETyByZXBsYWNlIGNhbGxiYWNrcyB3aXRoIHN0YWJsZSBoYW5kbGVyc1xuICAgIHZhciBjb2xsYXBzZUl0ZW0gPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoaXRlbUlkLCB0cmVlSWQpIHtcbiAgICAgICAgb25Db2xsYXBzZUl0ZW0gPT09IG51bGwgfHwgb25Db2xsYXBzZUl0ZW0gPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9uQ29sbGFwc2VJdGVtKGl0ZW1zW2l0ZW1JZF0sIHRyZWVJZCk7XG4gICAgfSwgW2l0ZW1zLCBvbkNvbGxhcHNlSXRlbV0pO1xuICAgIHZhciBleHBhbmRJdGVtID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKGl0ZW1JZCwgdHJlZUlkKSB7XG4gICAgICAgIG9uRXhwYW5kSXRlbSA9PT0gbnVsbCB8fCBvbkV4cGFuZEl0ZW0gPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9uRXhwYW5kSXRlbShpdGVtc1tpdGVtSWRdLCB0cmVlSWQpO1xuICAgIH0sIFtpdGVtcywgb25FeHBhbmRJdGVtXSk7XG4gICAgdmFyIGZvY3VzSXRlbSA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uIChpdGVtSWQsIHRyZWVJZCwgc2V0RG9tRm9jdXMpIHtcbiAgICAgICAgaWYgKHNldERvbUZvY3VzID09PSB2b2lkIDApIHsgc2V0RG9tRm9jdXMgPSB0cnVlOyB9XG4gICAgICAgIG9uRm9jdXNJdGVtID09PSBudWxsIHx8IG9uRm9jdXNJdGVtID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvbkZvY3VzSXRlbShpdGVtc1tpdGVtSWRdLCB0cmVlSWQsIHNldERvbUZvY3VzKTtcbiAgICB9LCBbaXRlbXMsIG9uRm9jdXNJdGVtXSk7XG4gICAgdmFyIGZvY3VzVHJlZSA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uICh0cmVlSWQsIGF1dG9Gb2N1cykge1xuICAgICAgICBpZiAoYXV0b0ZvY3VzID09PSB2b2lkIDApIHsgYXV0b0ZvY3VzID0gdHJ1ZTsgfVxuICAgICAgICBzZXRBY3RpdmVUcmVlKHRyZWVJZCwgYXV0b0ZvY3VzKTtcbiAgICB9LCBbc2V0QWN0aXZlVHJlZV0pO1xuICAgIHZhciBtb3ZlRm9jdXNEb3duID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKHRyZWVJZCkge1xuICAgICAgICB2YXIgdHJlZUxpbmVhckl0ZW1zID0gbGluZWFySXRlbXNbdHJlZUlkXTtcbiAgICAgICAgdmFyIGN1cnJlbnRGb2N1c0luZGV4ID0gdHJlZUxpbmVhckl0ZW1zLmZpbmRJbmRleChmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgIHZhciBfYjtcbiAgICAgICAgICAgIHZhciBpdGVtID0gX2EuaXRlbTtcbiAgICAgICAgICAgIHJldHVybiBpdGVtID09PSAoKF9iID0gdmlld1N0YXRlW3RyZWVJZF0pID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5mb2N1c2VkSXRlbSk7XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgbmV3SW5kZXggPSBjdXJyZW50Rm9jdXNJbmRleCAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICA/IE1hdGgubWluKHRyZWVMaW5lYXJJdGVtcy5sZW5ndGggLSAxLCBjdXJyZW50Rm9jdXNJbmRleCArIDEpXG4gICAgICAgICAgICA6IDA7XG4gICAgICAgIHZhciBuZXdJdGVtID0gaXRlbXNbdHJlZUxpbmVhckl0ZW1zW25ld0luZGV4XS5pdGVtXTtcbiAgICAgICAgb25Gb2N1c0l0ZW0gPT09IG51bGwgfHwgb25Gb2N1c0l0ZW0gPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9uRm9jdXNJdGVtKG5ld0l0ZW0sIHRyZWVJZCk7XG4gICAgfSwgW2l0ZW1zLCBsaW5lYXJJdGVtcywgb25Gb2N1c0l0ZW0sIHZpZXdTdGF0ZV0pO1xuICAgIHZhciBtb3ZlRm9jdXNVcCA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uICh0cmVlSWQpIHtcbiAgICAgICAgdmFyIHRyZWVMaW5lYXJJdGVtcyA9IGxpbmVhckl0ZW1zW3RyZWVJZF07XG4gICAgICAgIHZhciBjdXJyZW50Rm9jdXNJbmRleCA9IHRyZWVMaW5lYXJJdGVtcy5maW5kSW5kZXgoZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICB2YXIgX2I7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IF9hLml0ZW07XG4gICAgICAgICAgICByZXR1cm4gaXRlbSA9PT0gKChfYiA9IHZpZXdTdGF0ZVt0cmVlSWRdKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuZm9jdXNlZEl0ZW0pO1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIG5ld0luZGV4ID0gY3VycmVudEZvY3VzSW5kZXggIT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgPyBNYXRoLm1heCgwLCBjdXJyZW50Rm9jdXNJbmRleCAtIDEpXG4gICAgICAgICAgICA6IDA7XG4gICAgICAgIHZhciBuZXdJdGVtID0gaXRlbXNbdHJlZUxpbmVhckl0ZW1zW25ld0luZGV4XS5pdGVtXTtcbiAgICAgICAgb25Gb2N1c0l0ZW0gPT09IG51bGwgfHwgb25Gb2N1c0l0ZW0gPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9uRm9jdXNJdGVtKG5ld0l0ZW0sIHRyZWVJZCk7XG4gICAgfSwgW2l0ZW1zLCBsaW5lYXJJdGVtcywgb25Gb2N1c0l0ZW0sIHZpZXdTdGF0ZV0pO1xuICAgIHZhciByZW5hbWVJdGVtID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKGl0ZW1JZCwgbmFtZSwgdHJlZUlkKSB7XG4gICAgICAgIG9uUmVuYW1lSXRlbSA9PT0gbnVsbCB8fCBvblJlbmFtZUl0ZW0gPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9uUmVuYW1lSXRlbShpdGVtc1tpdGVtSWRdLCBuYW1lLCB0cmVlSWQpO1xuICAgIH0sIFtpdGVtcywgb25SZW5hbWVJdGVtXSk7XG4gICAgdmFyIHNlbGVjdEl0ZW1zID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKGl0ZW1zSWRzLCB0cmVlSWQpIHtcbiAgICAgICAgb25TZWxlY3RJdGVtcyA9PT0gbnVsbCB8fCBvblNlbGVjdEl0ZW1zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvblNlbGVjdEl0ZW1zKGl0ZW1zSWRzLCB0cmVlSWQpO1xuICAgIH0sIFtvblNlbGVjdEl0ZW1zXSk7XG4gICAgdmFyIHRvZ2dsZUl0ZW1FeHBhbmRlZFN0YXRlID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKGl0ZW1JZCwgdHJlZUlkKSB7XG4gICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgIGlmICgoX2IgPSAoX2EgPSB2aWV3U3RhdGVbdHJlZUlkXSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmV4cGFuZGVkSXRlbXMpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5pbmNsdWRlcyhpdGVtSWQpKSB7XG4gICAgICAgICAgICBvbkNvbGxhcHNlSXRlbSA9PT0gbnVsbCB8fCBvbkNvbGxhcHNlSXRlbSA9PT0gdm9pZCAwID8gdm9pZCAwIDogb25Db2xsYXBzZUl0ZW0oaXRlbXNbaXRlbUlkXSwgdHJlZUlkKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG9uRXhwYW5kSXRlbSA9PT0gbnVsbCB8fCBvbkV4cGFuZEl0ZW0gPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9uRXhwYW5kSXRlbShpdGVtc1tpdGVtSWRdLCB0cmVlSWQpO1xuICAgICAgICB9XG4gICAgfSwgW2l0ZW1zLCBvbkNvbGxhcHNlSXRlbSwgb25FeHBhbmRJdGVtLCB2aWV3U3RhdGVdKTtcbiAgICB2YXIgdG9nZ2xlSXRlbVNlbGVjdFN0YXR1cyA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uIChpdGVtSWQsIHRyZWVJZCkge1xuICAgICAgICB2YXIgX2EsIF9iLCBfYywgX2QsIF9lO1xuICAgICAgICBpZiAoKF9iID0gKF9hID0gdmlld1N0YXRlW3RyZWVJZF0pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5zZWxlY3RlZEl0ZW1zKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuaW5jbHVkZXMoaXRlbUlkKSkge1xuICAgICAgICAgICAgb25TZWxlY3RJdGVtcyA9PT0gbnVsbCB8fCBvblNlbGVjdEl0ZW1zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvblNlbGVjdEl0ZW1zKChfZCA9IChfYyA9IHZpZXdTdGF0ZVt0cmVlSWRdLnNlbGVjdGVkSXRlbXMpID09PSBudWxsIHx8IF9jID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYy5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHsgcmV0dXJuIGl0ZW0gIT09IGl0ZW1JZDsgfSkpICE9PSBudWxsICYmIF9kICE9PSB2b2lkIDAgPyBfZCA6IFtdLCB0cmVlSWQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgb25TZWxlY3RJdGVtcyA9PT0gbnVsbCB8fCBvblNlbGVjdEl0ZW1zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvblNlbGVjdEl0ZW1zKF9fc3ByZWFkQXJyYXkoX19zcHJlYWRBcnJheShbXSwgKChfZSA9IHZpZXdTdGF0ZVt0cmVlSWRdLnNlbGVjdGVkSXRlbXMpICE9PSBudWxsICYmIF9lICE9PSB2b2lkIDAgPyBfZSA6IFtdKSwgdHJ1ZSksIFtpdGVtSWRdLCBmYWxzZSksIHRyZWVJZCk7XG4gICAgICAgIH1cbiAgICB9LCBbb25TZWxlY3RJdGVtcywgdmlld1N0YXRlXSk7XG4gICAgdmFyIGludm9rZVByaW1hcnlBY3Rpb24gPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoaXRlbUlkLCB0cmVlSWQpIHtcbiAgICAgICAgb25QcmltYXJ5QWN0aW9uID09PSBudWxsIHx8IG9uUHJpbWFyeUFjdGlvbiA9PT0gdm9pZCAwID8gdm9pZCAwIDogb25QcmltYXJ5QWN0aW9uKGl0ZW1zW2l0ZW1JZF0sIHRyZWVJZCk7XG4gICAgfSwgW2l0ZW1zLCBvblByaW1hcnlBY3Rpb25dKTtcbiAgICB2YXIgZXhwYW5kU3Vic2VxdWVudGx5ID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKHRyZWVJZCwgaXRlbUlkcykgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGN1cnJlbnQsIHJlc3Q7XG4gICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnQgPSBpdGVtSWRzWzBdLCByZXN0ID0gaXRlbUlkcy5zbGljZSgxKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgd2FpdEZvcihmdW5jdGlvbiAoKSB7IHZhciBfYTsgcmV0dXJuICEhKChfYSA9IGl0ZW1zUmVmLmN1cnJlbnQpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYVtjdXJyZW50XSk7IH0pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpdGVtID0gaXRlbXNSZWYuY3VycmVudFtjdXJyZW50XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkV4cGFuZEl0ZW0gPT09IG51bGwgfHwgb25FeHBhbmRJdGVtID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvbkV4cGFuZEl0ZW0oaXRlbSwgdHJlZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBleHBhbmRTdWJzZXF1ZW50bHkodHJlZUlkLCByZXN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSldO1xuICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pOyB9LCBbaXRlbXNSZWYsIG9uRXhwYW5kSXRlbV0pO1xuICAgIHZhciBleHBhbmRBbGwgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAodHJlZUlkKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gWzQgLyp5aWVsZCovLCByZWN1cnNpdmVFeHBhbmQodHJlZXNbdHJlZUlkXS5yb290SXRlbSwgaXRlbXNSZWYsIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb25FeHBhbmRJdGVtID09PSBudWxsIHx8IG9uRXhwYW5kSXRlbSA9PT0gdm9pZCAwID8gdm9pZCAwIDogb25FeHBhbmRJdGVtKGl0ZW0sIHRyZWVJZCk7XG4gICAgICAgICAgICAgICAgICAgIH0pXTtcbiAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgIF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTsgfSwgW2l0ZW1zUmVmLCBvbkV4cGFuZEl0ZW0sIHRyZWVzXSk7XG4gICAgdmFyIGNvbGxhcHNlQWxsID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKHRyZWVJZCkge1xuICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIF9jID0gKF9iID0gKF9hID0gdmlld1N0YXRlW3RyZWVJZF0pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5leHBhbmRlZEl0ZW1zKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiBbXTsgX2kgPCBfYy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciBpdGVtSWQgPSBfY1tfaV07XG4gICAgICAgICAgICBvbkNvbGxhcHNlSXRlbSA9PT0gbnVsbCB8fCBvbkNvbGxhcHNlSXRlbSA9PT0gdm9pZCAwID8gdm9pZCAwIDogb25Db2xsYXBzZUl0ZW0oaXRlbXNbaXRlbUlkXSwgdHJlZUlkKTtcbiAgICAgICAgfVxuICAgIH0sIFtpdGVtcywgb25Db2xsYXBzZUl0ZW0sIHZpZXdTdGF0ZV0pO1xuICAgIC8vIFRPRE8gY2hhbmdlIGVudmlyb25tZW50IGNoaWxkcyB0byB1c2UgYWN0aW9ucyByYXRoZXIgdGhhbiBvdXRwdXQgZXZlbnRzIHdoZXJlIHBvc3NpYmxlXG4gICAgdmFyIGFjdGlvbnMgPSB1c2VNZW1vKGZ1bmN0aW9uICgpIHsgcmV0dXJuICh7XG4gICAgICAgIGNvbGxhcHNlSXRlbTogY29sbGFwc2VJdGVtLFxuICAgICAgICBleHBhbmRJdGVtOiBleHBhbmRJdGVtLFxuICAgICAgICBmb2N1c0l0ZW06IGZvY3VzSXRlbSxcbiAgICAgICAgZm9jdXNUcmVlOiBmb2N1c1RyZWUsXG4gICAgICAgIG1vdmVGb2N1c0Rvd246IG1vdmVGb2N1c0Rvd24sXG4gICAgICAgIG1vdmVGb2N1c1VwOiBtb3ZlRm9jdXNVcCxcbiAgICAgICAgcmVuYW1lSXRlbTogcmVuYW1lSXRlbSxcbiAgICAgICAgc2VsZWN0SXRlbXM6IHNlbGVjdEl0ZW1zLFxuICAgICAgICB0b2dnbGVJdGVtRXhwYW5kZWRTdGF0ZTogdG9nZ2xlSXRlbUV4cGFuZGVkU3RhdGUsXG4gICAgICAgIHRvZ2dsZUl0ZW1TZWxlY3RTdGF0dXM6IHRvZ2dsZUl0ZW1TZWxlY3RTdGF0dXMsXG4gICAgICAgIGludm9rZVByaW1hcnlBY3Rpb246IGludm9rZVByaW1hcnlBY3Rpb24sXG4gICAgICAgIGV4cGFuZEFsbDogZXhwYW5kQWxsLFxuICAgICAgICBleHBhbmRTdWJzZXF1ZW50bHk6IGV4cGFuZFN1YnNlcXVlbnRseSxcbiAgICAgICAgY29sbGFwc2VBbGw6IGNvbGxhcHNlQWxsLFxuICAgICAgICBhYm9ydFByb2dyYW1tYXRpY0RyYWc6IGFib3J0UHJvZ3JhbW1hdGljRHJhZyxcbiAgICAgICAgY29tcGxldGVQcm9ncmFtbWF0aWNEcmFnOiBjb21wbGV0ZVByb2dyYW1tYXRpY0RyYWcsXG4gICAgICAgIG1vdmVQcm9ncmFtbWF0aWNEcmFnUG9zaXRpb25Eb3duOiBwcm9ncmFtbWF0aWNEcmFnRG93bixcbiAgICAgICAgbW92ZVByb2dyYW1tYXRpY0RyYWdQb3NpdGlvblVwOiBwcm9ncmFtbWF0aWNEcmFnVXAsXG4gICAgICAgIHN0YXJ0UHJvZ3JhbW1hdGljRHJhZzogc3RhcnRQcm9ncmFtbWF0aWNEcmFnLFxuICAgIH0pOyB9LCBbXG4gICAgICAgIGNvbGxhcHNlSXRlbSxcbiAgICAgICAgZXhwYW5kSXRlbSxcbiAgICAgICAgZm9jdXNJdGVtLFxuICAgICAgICBmb2N1c1RyZWUsXG4gICAgICAgIG1vdmVGb2N1c0Rvd24sXG4gICAgICAgIG1vdmVGb2N1c1VwLFxuICAgICAgICByZW5hbWVJdGVtLFxuICAgICAgICBzZWxlY3RJdGVtcyxcbiAgICAgICAgdG9nZ2xlSXRlbUV4cGFuZGVkU3RhdGUsXG4gICAgICAgIHRvZ2dsZUl0ZW1TZWxlY3RTdGF0dXMsXG4gICAgICAgIGludm9rZVByaW1hcnlBY3Rpb24sXG4gICAgICAgIGV4cGFuZEFsbCxcbiAgICAgICAgZXhwYW5kU3Vic2VxdWVudGx5LFxuICAgICAgICBjb2xsYXBzZUFsbCxcbiAgICAgICAgYWJvcnRQcm9ncmFtbWF0aWNEcmFnLFxuICAgICAgICBjb21wbGV0ZVByb2dyYW1tYXRpY0RyYWcsXG4gICAgICAgIHByb2dyYW1tYXRpY0RyYWdEb3duLFxuICAgICAgICBwcm9ncmFtbWF0aWNEcmFnVXAsXG4gICAgICAgIHN0YXJ0UHJvZ3JhbW1hdGljRHJhZyxcbiAgICBdKTtcbiAgICB1c2VDcmVhdGVkRW52aXJvbm1lbnRSZWYocmVmLCBhY3Rpb25zKTtcbiAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoRW52aXJvbm1lbnRBY3Rpb25zQ29udGV4dC5Qcm92aWRlciwgeyB2YWx1ZTogYWN0aW9ucyB9LCBwcm9wcy5jaGlsZHJlbikpO1xufSk7XG4iLCJpbXBvcnQgeyBnZXREb2N1bWVudCB9IGZyb20gJy4uL3V0aWxzJztcbmV4cG9ydCB2YXIgc2Nyb2xsSW50b1ZpZXcgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgIHZhciBfYSwgX2IsIF9jLCBfZDtcbiAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoZWxlbWVudC5zY3JvbGxJbnRvVmlld0lmTmVlZGVkKSB7XG4gICAgICAgIGVsZW1lbnQuc2Nyb2xsSW50b1ZpZXdJZk5lZWRlZCgpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdmFyIGJvdW5kaW5nQm94ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgdmFyIGlzRWxlbWVudEluVmlld3BvcnQgPSBib3VuZGluZ0JveC50b3AgPj0gMCAmJlxuICAgICAgICAgICAgYm91bmRpbmdCb3gubGVmdCA+PSAwICYmXG4gICAgICAgICAgICBib3VuZGluZ0JveC5ib3R0b20gPD1cbiAgICAgICAgICAgICAgICAod2luZG93LmlubmVySGVpZ2h0IHx8XG4gICAgICAgICAgICAgICAgICAgICEhKChfYiA9IChfYSA9IGdldERvY3VtZW50KCkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5kb2N1bWVudEVsZW1lbnQpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5jbGllbnRIZWlnaHQpKSAmJlxuICAgICAgICAgICAgYm91bmRpbmdCb3gucmlnaHQgPD1cbiAgICAgICAgICAgICAgICAod2luZG93LmlubmVyV2lkdGggfHwgISEoKF9kID0gKF9jID0gZ2V0RG9jdW1lbnQoKSkgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLmRvY3VtZW50RWxlbWVudCkgPT09IG51bGwgfHwgX2QgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9kLmNsaWVudFdpZHRoKSk7XG4gICAgICAgIGlmICghaXNFbGVtZW50SW5WaWV3cG9ydCkge1xuICAgICAgICAgICAgZWxlbWVudC5zY3JvbGxJbnRvVmlldygpO1xuICAgICAgICB9XG4gICAgfVxufTtcbiIsInZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IGZ1bmN0aW9uICgpIHtcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXG4gICAgICAgICAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xudmFyIGN4ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBjbGFzc05hbWVzID0gW107XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgY2xhc3NOYW1lc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgIH1cbiAgICByZXR1cm4gY2xhc3NOYW1lcy5maWx0ZXIoZnVuY3Rpb24gKGNuKSB7IHJldHVybiAhIWNuOyB9KS5qb2luKCcgJyk7XG59O1xuZXhwb3J0IHZhciBjcmVhdGVEZWZhdWx0UmVuZGVyZXJzID0gZnVuY3Rpb24gKHJlbmRlckRlcHRoT2Zmc2V0LCBydGwpIHsgcmV0dXJuICh7XG4gICAgcmVuZGVySXRlbVRpdGxlOiBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgdmFyIHRpdGxlID0gX2EudGl0bGUsIGNvbnRleHQgPSBfYS5jb250ZXh0LCBpbmZvID0gX2EuaW5mbztcbiAgICAgICAgaWYgKCFpbmZvLmlzU2VhcmNoaW5nIHx8ICFjb250ZXh0LmlzU2VhcmNoTWF0Y2hpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aXRsZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgc3RhcnRJbmRleCA9IHRpdGxlLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihpbmZvLnNlYXJjaC50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkZyYWdtZW50LCBudWxsLFxuICAgICAgICAgICAgc3RhcnRJbmRleCA+IDAgJiYgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgbnVsbCwgdGl0bGUuc2xpY2UoMCwgc3RhcnRJbmRleCkpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgeyBjbGFzc05hbWU6IFwicmN0LXRyZWUtaXRlbS1zZWFyY2gtaGlnaGxpZ2h0XCIgfSwgdGl0bGUuc2xpY2Uoc3RhcnRJbmRleCwgc3RhcnRJbmRleCArIGluZm8uc2VhcmNoLmxlbmd0aCkpLFxuICAgICAgICAgICAgc3RhcnRJbmRleCArIGluZm8uc2VhcmNoLmxlbmd0aCA8IHRpdGxlLmxlbmd0aCAmJiAoUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgbnVsbCwgdGl0bGUuc2xpY2Uoc3RhcnRJbmRleCArIGluZm8uc2VhcmNoLmxlbmd0aCwgdGl0bGUubGVuZ3RoKSkpKSk7XG4gICAgfSxcbiAgICByZW5kZXJJdGVtQXJyb3c6IGZ1bmN0aW9uIChfYSkge1xuICAgICAgICB2YXIgaXRlbSA9IF9hLml0ZW0sIGNvbnRleHQgPSBfYS5jb250ZXh0O1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAvLyBJY29ucyBmcm9tIGh0dHBzOi8vYmx1ZXByaW50anMuY29tL2RvY3MvI2ljb25zXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgX19hc3NpZ24oeyBjbGFzc05hbWU6IGN4KGl0ZW0uaXNGb2xkZXIgJiYgJ3JjdC10cmVlLWl0ZW0tYXJyb3ctaXNGb2xkZXInLCBjb250ZXh0LmlzRXhwYW5kZWQgJiYgJ3JjdC10cmVlLWl0ZW0tYXJyb3ctZXhwYW5kZWQnLCAncmN0LXRyZWUtaXRlbS1hcnJvdycpIH0sIGNvbnRleHQuYXJyb3dQcm9wcyksIGl0ZW0uaXNGb2xkZXIgJiZcbiAgICAgICAgICAgIChjb250ZXh0LmlzRXhwYW5kZWQgPyAoUmVhY3QuY3JlYXRlRWxlbWVudChcInN2Z1wiLCB7IHZlcnNpb246IFwiMS4xXCIsIHhtbG5zOiBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsIHhtbG5zWGxpbms6IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLCB4OiBcIjBweFwiLCB5OiBcIjBweFwiLCB2aWV3Qm94OiBcIjAgMCAxNiAxNlwiLCBlbmFibGVCYWNrZ3JvdW5kOiBcIm5ldyAwIDAgMTYgMTZcIiwgeG1sU3BhY2U6IFwicHJlc2VydmVcIiB9LFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJnXCIsIG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJnXCIsIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwicGF0aFwiLCB7IGZpbGxSdWxlOiBcImV2ZW5vZGRcIiwgY2xpcFJ1bGU6IFwiZXZlbm9kZFwiLCBkOiBcIk0xLjY0NiA0LjY0NmEuNS41IDAgMCAxIC43MDggMEw4IDEwLjI5M2w1LjY0Ni01LjY0N2EuNS41IDAgMCAxIC43MDguNzA4bC02IDZhLjUuNSAwIDAgMS0uNzA4IDBsLTYtNmEuNS41IDAgMCAxIDAtLjcwOHpcIiwgY2xhc3NOYW1lOiBcInJjdC10cmVlLWl0ZW0tYXJyb3ctcGF0aFwiIH0pKSkpKSA6IChSZWFjdC5jcmVhdGVFbGVtZW50KFwic3ZnXCIsIHsgdmVyc2lvbjogXCIxLjFcIiwgeG1sbnM6IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgeG1sbnNYbGluazogXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIsIHg6IFwiMHB4XCIsIHk6IFwiMHB4XCIsIHZpZXdCb3g6IFwiMCAwIDE2IDE2XCIsIGVuYWJsZUJhY2tncm91bmQ6IFwibmV3IDAgMCAxNiAxNlwiLCB4bWxTcGFjZTogXCJwcmVzZXJ2ZVwiIH0sXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImdcIiwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImdcIiwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJwYXRoXCIsIHsgZmlsbFJ1bGU6IFwiZXZlbm9kZFwiLCBjbGlwUnVsZTogXCJldmVub2RkXCIsIGQ6IFwiTTQuNjQ2IDEuNjQ2YS41LjUgMCAwIDEgLjcwOCAwbDYgNmEuNS41IDAgMCAxIDAgLjcwOGwtNiA2YS41LjUgMCAwIDEtLjcwOC0uNzA4TDEwLjI5MyA4IDQuNjQ2IDIuMzU0YS41LjUgMCAwIDEgMC0uNzA4elwiLCBjbGFzc05hbWU6IFwicmN0LXRyZWUtaXRlbS1hcnJvdy1wYXRoXCIgfSkpKSkpKSkpO1xuICAgIH0sXG4gICAgcmVuZGVySXRlbTogZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHZhciBpdGVtID0gX2EuaXRlbSwgZGVwdGggPSBfYS5kZXB0aCwgY2hpbGRyZW4gPSBfYS5jaGlsZHJlbiwgdGl0bGUgPSBfYS50aXRsZSwgY29udGV4dCA9IF9hLmNvbnRleHQsIGFycm93ID0gX2EuYXJyb3c7XG4gICAgICAgIHZhciBJbnRlcmFjdGl2ZUNvbXBvbmVudCA9IGNvbnRleHQuaXNSZW5hbWluZyA/ICdkaXYnIDogJ2J1dHRvbic7XG4gICAgICAgIHZhciB0eXBlID0gY29udGV4dC5pc1JlbmFtaW5nID8gdW5kZWZpbmVkIDogJ2J1dHRvbic7XG4gICAgICAgIC8vIFRPRE8gaGF2ZSBvbmx5IHJvb3QgbGkgY29tcG9uZW50IGNyZWF0ZSBhbGwgdGhlIGNsYXNzZXNcbiAgICAgICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwgX19hc3NpZ24oe30sIGNvbnRleHQuaXRlbUNvbnRhaW5lcldpdGhDaGlsZHJlblByb3BzLCB7IGNsYXNzTmFtZTogY3goJ3JjdC10cmVlLWl0ZW0tbGknLCBpdGVtLmlzRm9sZGVyICYmICdyY3QtdHJlZS1pdGVtLWxpLWlzRm9sZGVyJywgY29udGV4dC5pc1NlbGVjdGVkICYmICdyY3QtdHJlZS1pdGVtLWxpLXNlbGVjdGVkJywgY29udGV4dC5pc0V4cGFuZGVkICYmICdyY3QtdHJlZS1pdGVtLWxpLWV4cGFuZGVkJywgY29udGV4dC5pc0ZvY3VzZWQgJiYgJ3JjdC10cmVlLWl0ZW0tbGktZm9jdXNlZCcsIGNvbnRleHQuaXNEcmFnZ2luZ092ZXIgJiYgJ3JjdC10cmVlLWl0ZW0tbGktZHJhZ2dpbmctb3ZlcicsIGNvbnRleHQuaXNTZWFyY2hNYXRjaGluZyAmJiAncmN0LXRyZWUtaXRlbS1saS1zZWFyY2gtbWF0Y2gnKSB9KSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgX19hc3NpZ24oe30sIGNvbnRleHQuaXRlbUNvbnRhaW5lcldpdGhvdXRDaGlsZHJlblByb3BzLCB7IHN0eWxlOiB7ICctLWRlcHRoT2Zmc2V0JzogXCJcIi5jb25jYXQoKGRlcHRoICsgMSkgKiByZW5kZXJEZXB0aE9mZnNldCwgXCJweFwiKSB9LCBjbGFzc05hbWU6IGN4KCdyY3QtdHJlZS1pdGVtLXRpdGxlLWNvbnRhaW5lcicsIGl0ZW0uaXNGb2xkZXIgJiYgJ3JjdC10cmVlLWl0ZW0tdGl0bGUtY29udGFpbmVyLWlzRm9sZGVyJywgY29udGV4dC5pc1NlbGVjdGVkICYmICdyY3QtdHJlZS1pdGVtLXRpdGxlLWNvbnRhaW5lci1zZWxlY3RlZCcsIGNvbnRleHQuaXNFeHBhbmRlZCAmJiAncmN0LXRyZWUtaXRlbS10aXRsZS1jb250YWluZXItZXhwYW5kZWQnLCBjb250ZXh0LmlzRm9jdXNlZCAmJiAncmN0LXRyZWUtaXRlbS10aXRsZS1jb250YWluZXItZm9jdXNlZCcsIGNvbnRleHQuaXNEcmFnZ2luZ092ZXIgJiZcbiAgICAgICAgICAgICAgICAgICAgJ3JjdC10cmVlLWl0ZW0tdGl0bGUtY29udGFpbmVyLWRyYWdnaW5nLW92ZXInLCBjb250ZXh0LmlzU2VhcmNoTWF0Y2hpbmcgJiZcbiAgICAgICAgICAgICAgICAgICAgJ3JjdC10cmVlLWl0ZW0tdGl0bGUtY29udGFpbmVyLXNlYXJjaC1tYXRjaCcpIH0pLFxuICAgICAgICAgICAgICAgIGFycm93LFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSW50ZXJhY3RpdmVDb21wb25lbnQsIF9fYXNzaWduKHsgdHlwZTogdHlwZSB9LCBjb250ZXh0LmludGVyYWN0aXZlRWxlbWVudFByb3BzLCB7IGNsYXNzTmFtZTogY3goJ3JjdC10cmVlLWl0ZW0tYnV0dG9uJywgaXRlbS5pc0ZvbGRlciAmJiAncmN0LXRyZWUtaXRlbS1idXR0b24taXNGb2xkZXInLCBjb250ZXh0LmlzU2VsZWN0ZWQgJiYgJ3JjdC10cmVlLWl0ZW0tYnV0dG9uLXNlbGVjdGVkJywgY29udGV4dC5pc0V4cGFuZGVkICYmICdyY3QtdHJlZS1pdGVtLWJ1dHRvbi1leHBhbmRlZCcsIGNvbnRleHQuaXNGb2N1c2VkICYmICdyY3QtdHJlZS1pdGVtLWJ1dHRvbi1mb2N1c2VkJywgY29udGV4dC5pc0RyYWdnaW5nT3ZlciAmJiAncmN0LXRyZWUtaXRlbS1idXR0b24tZHJhZ2dpbmctb3ZlcicsIGNvbnRleHQuaXNTZWFyY2hNYXRjaGluZyAmJiAncmN0LXRyZWUtaXRlbS1idXR0b24tc2VhcmNoLW1hdGNoJykgfSksIHRpdGxlKSksXG4gICAgICAgICAgICBjaGlsZHJlbikpO1xuICAgIH0sXG4gICAgcmVuZGVyUmVuYW1lSW5wdXQ6IGZ1bmN0aW9uIChfYSkge1xuICAgICAgICB2YXIgaW5wdXRQcm9wcyA9IF9hLmlucHV0UHJvcHMsIGlucHV0UmVmID0gX2EuaW5wdXRSZWYsIHN1Ym1pdEJ1dHRvblByb3BzID0gX2Euc3VibWl0QnV0dG9uUHJvcHMsIHN1Ym1pdEJ1dHRvblJlZiA9IF9hLnN1Ym1pdEJ1dHRvblJlZiwgZm9ybVByb3BzID0gX2EuZm9ybVByb3BzO1xuICAgICAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJmb3JtXCIsIF9fYXNzaWduKHt9LCBmb3JtUHJvcHMsIHsgY2xhc3NOYW1lOiBcInJjdC10cmVlLWl0ZW0tcmVuYW1pbmctZm9ybVwiIH0pLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIF9fYXNzaWduKHt9LCBpbnB1dFByb3BzLCB7IHJlZjogaW5wdXRSZWYsIGNsYXNzTmFtZTogXCJyY3QtdHJlZS1pdGVtLXJlbmFtaW5nLWlucHV0XCIgfSkpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIF9fYXNzaWduKHt9LCBzdWJtaXRCdXR0b25Qcm9wcywgeyByZWY6IHN1Ym1pdEJ1dHRvblJlZiwgdHlwZTogXCJzdWJtaXRcIiwgY2xhc3NOYW1lOiBcInJjdC10cmVlLWl0ZW0tcmVuYW1pbmctc3VibWl0LWJ1dHRvblwiLCB2YWx1ZTogXCJcXHVEODNEXFx1RERGOFwiIH0pKSkpO1xuICAgIH0sXG4gICAgcmVuZGVyVHJlZUNvbnRhaW5lcjogZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHZhciBjaGlsZHJlbiA9IF9hLmNoaWxkcmVuLCBjb250YWluZXJQcm9wcyA9IF9hLmNvbnRhaW5lclByb3BzLCBpbmZvID0gX2EuaW5mbztcbiAgICAgICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBjeCgncmN0LXRyZWUtcm9vdCcsIGluZm8uaXNGb2N1c2VkICYmICdyY3QtdHJlZS1yb290LWZvY3VzJywgaW5mby5pc1JlbmFtaW5nICYmICdyY3QtdHJlZS1yb290LXJlbmFtaW5nJywgaW5mby5hcmVJdGVtc1NlbGVjdGVkICYmICdyY3QtdHJlZS1yb290LWl0ZW1zc2VsZWN0ZWQnLCBydGwgJiYgJ3JjdC1ydGwnKSB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBfX2Fzc2lnbih7fSwgY29udGFpbmVyUHJvcHMsIHsgc3R5bGU6IF9fYXNzaWduKHsgbWluSGVpZ2h0OiAnMzBweCcgfSwgY29udGFpbmVyUHJvcHMuc3R5bGUpIH0pLCBjaGlsZHJlbikpKTtcbiAgICB9LFxuICAgIHJlbmRlckl0ZW1zQ29udGFpbmVyOiBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgdmFyIGNoaWxkcmVuID0gX2EuY2hpbGRyZW4sIGNvbnRhaW5lclByb3BzID0gX2EuY29udGFpbmVyUHJvcHM7XG4gICAgICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChcInVsXCIsIF9fYXNzaWduKHt9LCBjb250YWluZXJQcm9wcywgeyBjbGFzc05hbWU6IFwicmN0LXRyZWUtaXRlbXMtY29udGFpbmVyXCIgfSksIGNoaWxkcmVuKSk7XG4gICAgfSxcbiAgICByZW5kZXJEcmFnQmV0d2VlbkxpbmU6IGZ1bmN0aW9uIChfYSkge1xuICAgICAgICB2YXIgZHJhZ2dpbmdQb3NpdGlvbiA9IF9hLmRyYWdnaW5nUG9zaXRpb24sIGxpbmVQcm9wcyA9IF9hLmxpbmVQcm9wcztcbiAgICAgICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIF9fYXNzaWduKHt9LCBsaW5lUHJvcHMsIHsgc3R5bGU6IHsgbGVmdDogXCJcIi5jb25jYXQoZHJhZ2dpbmdQb3NpdGlvbi5kZXB0aCAqIHJlbmRlckRlcHRoT2Zmc2V0LCBcInB4XCIpIH0sIGNsYXNzTmFtZTogY3goJ3JjdC10cmVlLWRyYWctYmV0d2Vlbi1saW5lJywgZHJhZ2dpbmdQb3NpdGlvbi50YXJnZXRUeXBlID09PSAnYmV0d2Vlbi1pdGVtcycgJiZcbiAgICAgICAgICAgICAgICBkcmFnZ2luZ1Bvc2l0aW9uLmxpbmVQb3NpdGlvbiA9PT0gJ3RvcCcgJiZcbiAgICAgICAgICAgICAgICAncmN0LXRyZWUtZHJhZy1iZXR3ZWVuLWxpbmUtdG9wJywgZHJhZ2dpbmdQb3NpdGlvbi50YXJnZXRUeXBlID09PSAnYmV0d2Vlbi1pdGVtcycgJiZcbiAgICAgICAgICAgICAgICBkcmFnZ2luZ1Bvc2l0aW9uLmxpbmVQb3NpdGlvbiA9PT0gJ2JvdHRvbScgJiZcbiAgICAgICAgICAgICAgICAncmN0LXRyZWUtZHJhZy1iZXR3ZWVuLWxpbmUtYm90dG9tJykgfSkpKTtcbiAgICB9LFxuICAgIHJlbmRlclNlYXJjaElucHV0OiBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgdmFyIGlucHV0UHJvcHMgPSBfYS5pbnB1dFByb3BzO1xuICAgICAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IGN4KCdyY3QtdHJlZS1zZWFyY2gtaW5wdXQtY29udGFpbmVyJykgfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHsgY2xhc3NOYW1lOiBcInJjdC10cmVlLWlucHV0LWljb25cIiB9KSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCBfX2Fzc2lnbih7fSwgaW5wdXRQcm9wcywgeyBjbGFzc05hbWU6IGN4KCdyY3QtdHJlZS1zZWFyY2gtaW5wdXQnKSB9KSkpKTtcbiAgICB9LFxuICAgIHJlbmRlckxpdmVEZXNjcmlwdG9yQ29udGFpbmVyOiBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgdmFyIHRyZWUgPSBfYS50cmVlLCBjaGlsZHJlbiA9IF9hLmNoaWxkcmVuO1xuICAgICAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBpZDogXCJyY3QtbGl2ZWRlc2NyaXB0aW9uLVwiLmNvbmNhdCh0cmVlLnRyZWVJZCksIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgY2xpcDogJ3JlY3QoMCAwIDAgMCknLFxuICAgICAgICAgICAgICAgIGNsaXBQYXRoOiAnaW5zZXQoNTAlKScsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMXB4JyxcbiAgICAgICAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgd2hpdGVTcGFjZTogJ25vd3JhcCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxcHgnLFxuICAgICAgICAgICAgfSB9LCBjaGlsZHJlbikpO1xuICAgIH0sXG4gICAgcmVuZGVyRGVwdGhPZmZzZXQ6IHJlbmRlckRlcHRoT2Zmc2V0LFxufSk7IH07XG4iLCJpbXBvcnQgeyB1c2VNZW1vIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgY3JlYXRlRGVmYXVsdFJlbmRlcmVycyB9IGZyb20gJy4vY3JlYXRlRGVmYXVsdFJlbmRlcmVycyc7XG5leHBvcnQgdmFyIHVzZVJlbmRlcmVycyA9IGZ1bmN0aW9uIChfYSkge1xuICAgIHZhciByZW5kZXJJdGVtID0gX2EucmVuZGVySXRlbSwgcmVuZGVySXRlbVRpdGxlID0gX2EucmVuZGVySXRlbVRpdGxlLCByZW5kZXJJdGVtQXJyb3cgPSBfYS5yZW5kZXJJdGVtQXJyb3csIHJlbmRlclJlbmFtZUlucHV0ID0gX2EucmVuZGVyUmVuYW1lSW5wdXQsIHJlbmRlckl0ZW1zQ29udGFpbmVyID0gX2EucmVuZGVySXRlbXNDb250YWluZXIsIHJlbmRlclRyZWVDb250YWluZXIgPSBfYS5yZW5kZXJUcmVlQ29udGFpbmVyLCByZW5kZXJEcmFnQmV0d2VlbkxpbmUgPSBfYS5yZW5kZXJEcmFnQmV0d2VlbkxpbmUsIHJlbmRlclNlYXJjaElucHV0ID0gX2EucmVuZGVyU2VhcmNoSW5wdXQsIHJlbmRlckxpdmVEZXNjcmlwdG9yQ29udGFpbmVyID0gX2EucmVuZGVyTGl2ZURlc2NyaXB0b3JDb250YWluZXIsIHJlbmRlckRlcHRoT2Zmc2V0ID0gX2EucmVuZGVyRGVwdGhPZmZzZXQ7XG4gICAgdmFyIGRlZmF1bHRSZW5kZXJlcnMgPSB1c2VNZW1vKGZ1bmN0aW9uICgpIHsgcmV0dXJuIGNyZWF0ZURlZmF1bHRSZW5kZXJlcnMocmVuZGVyRGVwdGhPZmZzZXQgIT09IG51bGwgJiYgcmVuZGVyRGVwdGhPZmZzZXQgIT09IHZvaWQgMCA/IHJlbmRlckRlcHRoT2Zmc2V0IDogMTApOyB9LCBbcmVuZGVyRGVwdGhPZmZzZXRdKTtcbiAgICB2YXIgY3VzdG9tUmVuZGVyZXJzID0ge1xuICAgICAgICByZW5kZXJJdGVtOiByZW5kZXJJdGVtLFxuICAgICAgICByZW5kZXJJdGVtVGl0bGU6IHJlbmRlckl0ZW1UaXRsZSxcbiAgICAgICAgcmVuZGVySXRlbUFycm93OiByZW5kZXJJdGVtQXJyb3csXG4gICAgICAgIHJlbmRlclJlbmFtZUlucHV0OiByZW5kZXJSZW5hbWVJbnB1dCxcbiAgICAgICAgcmVuZGVySXRlbXNDb250YWluZXI6IHJlbmRlckl0ZW1zQ29udGFpbmVyLFxuICAgICAgICByZW5kZXJUcmVlQ29udGFpbmVyOiByZW5kZXJUcmVlQ29udGFpbmVyLFxuICAgICAgICByZW5kZXJEcmFnQmV0d2VlbkxpbmU6IHJlbmRlckRyYWdCZXR3ZWVuTGluZSxcbiAgICAgICAgcmVuZGVyU2VhcmNoSW5wdXQ6IHJlbmRlclNlYXJjaElucHV0LFxuICAgICAgICByZW5kZXJMaXZlRGVzY3JpcHRvckNvbnRhaW5lcjogcmVuZGVyTGl2ZURlc2NyaXB0b3JDb250YWluZXIsXG4gICAgICAgIHJlbmRlckRlcHRoT2Zmc2V0OiByZW5kZXJEZXB0aE9mZnNldCxcbiAgICB9O1xuICAgIHZhciByZW5kZXJlcnMgPSBPYmplY3QuZW50cmllcyhkZWZhdWx0UmVuZGVyZXJzKS5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgX2EpIHtcbiAgICAgICAgdmFyIGtleSA9IF9hWzBdLCB2YWx1ZSA9IF9hWzFdO1xuICAgICAgICB2YXIga2V5TWFwcGVkID0ga2V5O1xuICAgICAgICBpZiAoY3VzdG9tUmVuZGVyZXJzW2tleU1hcHBlZF0pIHtcbiAgICAgICAgICAgIGFjY1trZXlNYXBwZWRdID0gY3VzdG9tUmVuZGVyZXJzW2tleU1hcHBlZF07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhY2Nba2V5TWFwcGVkXSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhY2M7XG4gICAgfSwge30pO1xuICAgIHJlbmRlcmVycy5yZW5kZXJJdGVtLmRpc3BsYXlOYW1lID0gJ1JlbmRlckl0ZW0nO1xuICAgIHJlbmRlcmVycy5yZW5kZXJJdGVtVGl0bGUuZGlzcGxheU5hbWUgPSAnUmVuZGVySXRlbVRpdGxlJztcbiAgICByZW5kZXJlcnMucmVuZGVySXRlbUFycm93LmRpc3BsYXlOYW1lID0gJ1JlbmRlckl0ZW1BcnJvdyc7XG4gICAgcmVuZGVyZXJzLnJlbmRlclJlbmFtZUlucHV0LmRpc3BsYXlOYW1lID0gJ1JlbmRlclJlbmFtZUlucHV0JztcbiAgICByZW5kZXJlcnMucmVuZGVySXRlbXNDb250YWluZXIuZGlzcGxheU5hbWUgPSAnUmVuZGVySXRlbXNDb250YWluZXInO1xuICAgIHJlbmRlcmVycy5yZW5kZXJUcmVlQ29udGFpbmVyLmRpc3BsYXlOYW1lID0gJ1JlbmRlclRyZWVDb250YWluZXInO1xuICAgIHJlbmRlcmVycy5yZW5kZXJEcmFnQmV0d2VlbkxpbmUuZGlzcGxheU5hbWUgPVxuICAgICAgICAnUmVuZGVyRHJhZ0JldHdlZW5MaW5lJztcbiAgICByZW5kZXJlcnMucmVuZGVyU2VhcmNoSW5wdXQuZGlzcGxheU5hbWUgPSAnUmVuZGVyU2VhcmNoSW5wdXQnO1xuICAgIHJldHVybiByZW5kZXJlcnM7XG59O1xuIiwiZXhwb3J0IHZhciBnZXRJdGVtc0xpbmVhcmx5ID0gZnVuY3Rpb24gKHJvb3RJdGVtLCB2aWV3U3RhdGUsIGl0ZW1zLCBkZXB0aCkge1xuICAgIHZhciBfYSwgX2IsIF9jO1xuICAgIGlmIChkZXB0aCA9PT0gdm9pZCAwKSB7IGRlcHRoID0gMDsgfVxuICAgIHZhciBpdGVtSWRzID0gW107XG4gICAgZm9yICh2YXIgX2kgPSAwLCBfZCA9IChfYiA9IChfYSA9IGl0ZW1zW3Jvb3RJdGVtXSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmNoaWxkcmVuKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiBbXTsgX2kgPCBfZC5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgdmFyIGl0ZW1JZCA9IF9kW19pXTtcbiAgICAgICAgdmFyIGl0ZW0gPSBpdGVtc1tpdGVtSWRdO1xuICAgICAgICBpdGVtSWRzLnB1c2goeyBpdGVtOiBpdGVtSWQsIGRlcHRoOiBkZXB0aCB9KTtcbiAgICAgICAgaWYgKGl0ZW0gJiZcbiAgICAgICAgICAgIGl0ZW0uaXNGb2xkZXIgJiZcbiAgICAgICAgICAgICEhaXRlbS5jaGlsZHJlbiAmJlxuICAgICAgICAgICAgKChfYyA9IHZpZXdTdGF0ZS5leHBhbmRlZEl0ZW1zKSA9PT0gbnVsbCB8fCBfYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2MuaW5jbHVkZXMoaXRlbUlkKSkpIHtcbiAgICAgICAgICAgIGl0ZW1JZHMucHVzaC5hcHBseShpdGVtSWRzLCBnZXRJdGVtc0xpbmVhcmx5KGl0ZW1JZCwgdmlld1N0YXRlLCBpdGVtcywgZGVwdGggKyAxKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGl0ZW1JZHM7XG59O1xuIiwidmFyIF9fYXNzaWduID0gKHRoaXMgJiYgdGhpcy5fX2Fzc2lnbikgfHwgZnVuY3Rpb24gKCkge1xuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0KSB7XG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSlcbiAgICAgICAgICAgICAgICB0W3BdID0gc1twXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdDtcbiAgICB9O1xuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcbnZhciBfX3Jlc3QgPSAodGhpcyAmJiB0aGlzLl9fcmVzdCkgfHwgZnVuY3Rpb24gKHMsIGUpIHtcbiAgICB2YXIgdCA9IHt9O1xuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxuICAgICAgICB0W3BdID0gc1twXTtcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChlLmluZGV4T2YocFtpXSkgPCAwICYmIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzLCBwW2ldKSlcbiAgICAgICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcbiAgICAgICAgfVxuICAgIHJldHVybiB0O1xufTtcbmltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VNZW1vLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHNjcm9sbEludG9WaWV3IH0gZnJvbSAnLi4vdHJlZS9zY3JvbGxJbnRvVmlldyc7XG5pbXBvcnQgeyB1c2VSZW5kZXJlcnMgfSBmcm9tICcuLi9yZW5kZXJlcnMvdXNlUmVuZGVyZXJzJztcbmltcG9ydCB7IGJ1aWxkTWFwRm9yVHJlZXMsIGdldERvY3VtZW50IH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHsgZ2V0SXRlbXNMaW5lYXJseSB9IGZyb20gJy4uL3RyZWUvZ2V0SXRlbXNMaW5lYXJseSc7XG5pbXBvcnQgeyB1c2VSZWZDb3B5IH0gZnJvbSAnLi4vdXNlUmVmQ29weSc7XG5leHBvcnQgdmFyIHVzZUNvbnRyb2xsZWRUcmVlRW52aXJvbm1lbnRQcm9wcyA9IGZ1bmN0aW9uIChfYSkge1xuICAgIHZhciBvbkV4cGFuZEl0ZW1Qcm9wID0gX2Eub25FeHBhbmRJdGVtLCBvbkNvbGxhcHNlUHJvcCA9IF9hLm9uQ29sbGFwc2VJdGVtLCBvbkRyb3BQcm9wID0gX2Eub25Ecm9wLCBwcm9wcyA9IF9fcmVzdChfYSwgW1wib25FeHBhbmRJdGVtXCIsIFwib25Db2xsYXBzZUl0ZW1cIiwgXCJvbkRyb3BcIl0pO1xuICAgIHZhciBfYiA9IHVzZVN0YXRlKHt9KSwgdHJlZXMgPSBfYlswXSwgc2V0VHJlZXMgPSBfYlsxXTtcbiAgICB2YXIgX2MgPSB1c2VTdGF0ZSgpLCBhY3RpdmVUcmVlSWQgPSBfY1swXSwgc2V0QWN0aXZlVHJlZUlkID0gX2NbMV07XG4gICAgdmFyIHRyZWVJZHMgPSB1c2VNZW1vKGZ1bmN0aW9uICgpIHsgcmV0dXJuIE9iamVjdC5rZXlzKHRyZWVzKTsgfSwgW3RyZWVzXSk7XG4gICAgdmFyIG9uRm9jdXNJdGVtID0gcHJvcHMub25Gb2N1c0l0ZW0sIGF1dG9Gb2N1cyA9IHByb3BzLmF1dG9Gb2N1cywgb25SZWdpc3RlclRyZWUgPSBwcm9wcy5vblJlZ2lzdGVyVHJlZSwgb25VbnJlZ2lzdGVyVHJlZSA9IHByb3BzLm9uVW5yZWdpc3RlclRyZWUsIGl0ZW1zID0gcHJvcHMuaXRlbXMsIHZpZXdTdGF0ZSA9IHByb3BzLnZpZXdTdGF0ZTtcbiAgICB2YXIgb25Gb2N1c0l0ZW1SZWYgPSB1c2VSZWZDb3B5KG9uRm9jdXNJdGVtKTtcbiAgICB2YXIgdmlld1N0YXRlUmVmID0gdXNlUmVmQ29weSh2aWV3U3RhdGUpO1xuICAgIHZhciBsaW5lYXJJdGVtcyA9IHVzZU1lbW8oZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gYnVpbGRNYXBGb3JUcmVlcyh0cmVlSWRzLCBmdW5jdGlvbiAodHJlZUlkKSB7IHZhciBfYTsgcmV0dXJuIGdldEl0ZW1zTGluZWFybHkodHJlZXNbdHJlZUlkXS5yb290SXRlbSwgKF9hID0gdmlld1N0YXRlW3RyZWVJZF0pICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IHt9LCBpdGVtcyk7IH0pO1xuICAgIH0sIFt0cmVlcywgaXRlbXMsIHRyZWVJZHMsIHZpZXdTdGF0ZV0pO1xuICAgIHZhciBvbkZvY3VzSXRlbUhhbmRsZXIgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoaXRlbSwgdHJlZUlkLCBzZXREb21Gb2N1cykge1xuICAgICAgICB2YXIgX2EsIF9iLCBfYywgX2QsIF9lLCBfZiwgX2csIF9oLCBfajtcbiAgICAgICAgaWYgKHNldERvbUZvY3VzID09PSB2b2lkIDApIHsgc2V0RG9tRm9jdXMgPSB0cnVlOyB9XG4gICAgICAgIGlmICgoYXV0b0ZvY3VzICE9PSBudWxsICYmIGF1dG9Gb2N1cyAhPT0gdm9pZCAwID8gYXV0b0ZvY3VzIDogdHJ1ZSkgJiYgc2V0RG9tRm9jdXMpIHtcbiAgICAgICAgICAgIHZhciBuZXdJdGVtID0gKF9iID0gKF9hID0gZ2V0RG9jdW1lbnQoKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1yY3QtdHJlZT1cXFwiXCIuY29uY2F0KHRyZWVJZCwgXCJcXFwiXSBbZGF0YS1yY3QtaXRlbS1pZD1cXFwiXCIpLmNvbmNhdChpdGVtLmluZGV4LCBcIlxcXCJdXCIpKSkgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogKF9jID0gZ2V0RG9jdW1lbnQoKSkgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1yY3QtdHJlZT1cXFwiXCIuY29uY2F0KHRyZWVJZCwgXCJcXFwiXSBbZGF0YS1yY3QtaXRlbS1pZF1cIikpO1xuICAgICAgICAgICAgaWYgKCgoX2YgPSAoX2UgPSAoX2QgPSBnZXREb2N1bWVudCgpKSA9PT0gbnVsbCB8fCBfZCA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2QuYWN0aXZlRWxlbWVudCkgPT09IG51bGwgfHwgX2UgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9lLmF0dHJpYnV0ZXMuZ2V0TmFtZWRJdGVtKCdkYXRhLXJjdC1zZWFyY2gtaW5wdXQnKSkgPT09IG51bGwgfHwgX2YgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9mLnZhbHVlKSAhPT0gJ3RydWUnKSB7XG4gICAgICAgICAgICAgICAgLy8gTW92ZSBET00gZm9jdXMgdG8gaXRlbSBpZiB0aGUgY3VycmVudCBmb2N1cyBpcyBub3Qgb24gdGhlIHNlYXJjaCBpbnB1dFxuICAgICAgICAgICAgICAgIChfZyA9IG5ld0l0ZW0gPT09IG51bGwgfHwgbmV3SXRlbSA9PT0gdm9pZCAwID8gdm9pZCAwIDogbmV3SXRlbS5mb2N1cykgPT09IG51bGwgfHwgX2cgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9nLmNhbGwobmV3SXRlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBPdGhlcndpc2UganVzdCBtYW51YWxseSBzY3JvbGwgaW50byB2aWV3XG4gICAgICAgICAgICAgICAgc2Nyb2xsSW50b1ZpZXcobmV3SXRlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCgoX2ggPSB2aWV3U3RhdGVSZWYuY3VycmVudFt0cmVlSWRdKSA9PT0gbnVsbCB8fCBfaCA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2guZm9jdXNlZEl0ZW0pID09PSBpdGVtLmluZGV4KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgKF9qID0gb25Gb2N1c0l0ZW1SZWYuY3VycmVudCkgPT09IG51bGwgfHwgX2ogPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9qLmNhbGwob25Gb2N1c0l0ZW1SZWYsIGl0ZW0sIHRyZWVJZCk7XG4gICAgfSwgW2F1dG9Gb2N1cywgb25Gb2N1c0l0ZW1SZWYsIHZpZXdTdGF0ZVJlZl0pO1xuICAgIHZhciByZWdpc3RlclRyZWUgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAodHJlZSkge1xuICAgICAgICBzZXRUcmVlcyhmdW5jdGlvbiAodHJlZXMpIHtcbiAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgIHJldHVybiAoX19hc3NpZ24oX19hc3NpZ24oe30sIHRyZWVzKSwgKF9hID0ge30sIF9hW3RyZWUudHJlZUlkXSA9IHRyZWUsIF9hKSkpO1xuICAgICAgICB9KTtcbiAgICAgICAgb25SZWdpc3RlclRyZWUgPT09IG51bGwgfHwgb25SZWdpc3RlclRyZWUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9uUmVnaXN0ZXJUcmVlKHRyZWUpO1xuICAgIH0sIFtvblJlZ2lzdGVyVHJlZV0pO1xuICAgIHZhciB1bnJlZ2lzdGVyVHJlZSA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uICh0cmVlSWQpIHtcbiAgICAgICAgb25VbnJlZ2lzdGVyVHJlZSA9PT0gbnVsbCB8fCBvblVucmVnaXN0ZXJUcmVlID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvblVucmVnaXN0ZXJUcmVlKHRyZWVzW3RyZWVJZF0pO1xuICAgICAgICBkZWxldGUgdHJlZXNbdHJlZUlkXTtcbiAgICAgICAgc2V0VHJlZXModHJlZXMpO1xuICAgIH0sIFtvblVucmVnaXN0ZXJUcmVlLCB0cmVlc10pO1xuICAgIHZhciBvbkNvbGxhcHNlSXRlbSA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uIChpdGVtLCB0cmVlSWQpIHtcbiAgICAgICAgb25Db2xsYXBzZVByb3AgPT09IG51bGwgfHwgb25Db2xsYXBzZVByb3AgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9uQ29sbGFwc2VQcm9wKGl0ZW0sIHRyZWVJZCk7XG4gICAgICAgIHNldFRyZWVzKGZ1bmN0aW9uICh0cmVlcykgeyByZXR1cm4gdHJlZXM7IH0pO1xuICAgIH0sIFtvbkNvbGxhcHNlUHJvcF0pO1xuICAgIHZhciBvbkV4cGFuZEl0ZW0gPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoaXRlbSwgdHJlZUlkKSB7XG4gICAgICAgIG9uRXhwYW5kSXRlbVByb3AgPT09IG51bGwgfHwgb25FeHBhbmRJdGVtUHJvcCA9PT0gdm9pZCAwID8gdm9pZCAwIDogb25FeHBhbmRJdGVtUHJvcChpdGVtLCB0cmVlSWQpO1xuICAgICAgICBzZXRUcmVlcyhmdW5jdGlvbiAodHJlZXMpIHsgcmV0dXJuIHRyZWVzOyB9KTtcbiAgICB9LCBbb25FeHBhbmRJdGVtUHJvcF0pO1xuICAgIHZhciBvbkRyb3AgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoaXRlbXMsIHRhcmdldCkge1xuICAgICAgICBvbkRyb3BQcm9wID09PSBudWxsIHx8IG9uRHJvcFByb3AgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9uRHJvcFByb3AoaXRlbXMsIHRhcmdldCk7XG4gICAgICAgIHNldFRyZWVzKGZ1bmN0aW9uICh0cmVlcykgeyByZXR1cm4gdHJlZXM7IH0pO1xuICAgIH0sIFtvbkRyb3BQcm9wXSk7XG4gICAgdmFyIGZvY3VzVHJlZSA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uICh0cmVlSWQpIHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgdmFyIGZvY3VzSXRlbSA9IChfYSA9IGdldERvY3VtZW50KCkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtcmN0LXRyZWU9XFxcIlwiLmNvbmNhdCh0cmVlSWQsIFwiXFxcIl0gW2RhdGEtcmN0LWl0ZW0tZm9jdXM9XFxcInRydWVcXFwiXVwiKSk7XG4gICAgICAgIChfYiA9IGZvY3VzSXRlbSA9PT0gbnVsbCB8fCBmb2N1c0l0ZW0gPT09IHZvaWQgMCA/IHZvaWQgMCA6IGZvY3VzSXRlbS5mb2N1cykgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmNhbGwoZm9jdXNJdGVtKTtcbiAgICB9LCBbXSk7XG4gICAgdmFyIHNldEFjdGl2ZVRyZWUgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAodHJlZUlkT3JTZXRTdGF0ZUZ1bmN0aW9uLCBhdXRvRm9jdXNUcmVlKSB7XG4gICAgICAgIGlmIChhdXRvRm9jdXNUcmVlID09PSB2b2lkIDApIHsgYXV0b0ZvY3VzVHJlZSA9IHRydWU7IH1cbiAgICAgICAgdmFyIG1heWJlRm9jdXNUcmVlID0gZnVuY3Rpb24gKHRyZWVJZCkge1xuICAgICAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgICAgIGlmIChhdXRvRm9jdXNUcmVlICYmXG4gICAgICAgICAgICAgICAgKGF1dG9Gb2N1cyAhPT0gbnVsbCAmJiBhdXRvRm9jdXMgIT09IHZvaWQgMCA/IGF1dG9Gb2N1cyA6IHRydWUpICYmXG4gICAgICAgICAgICAgICAgdHJlZUlkICYmXG4gICAgICAgICAgICAgICAgISgoX2IgPSAoX2EgPSBnZXREb2N1bWVudCgpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucXVlcnlTZWxlY3RvcihcIltkYXRhLXJjdC10cmVlPVxcXCJcIi5jb25jYXQodHJlZUlkLCBcIlxcXCJdXCIpKSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmNvbnRhaW5zKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpKSkge1xuICAgICAgICAgICAgICAgIGZvY3VzVHJlZSh0cmVlSWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBpZiAodHlwZW9mIHRyZWVJZE9yU2V0U3RhdGVGdW5jdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgc2V0QWN0aXZlVHJlZUlkKGZ1bmN0aW9uIChvbGRWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHZhciB0cmVlSWQgPSB0cmVlSWRPclNldFN0YXRlRnVuY3Rpb24ob2xkVmFsdWUpO1xuICAgICAgICAgICAgICAgIGlmICh0cmVlSWQgIT09IG9sZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIG1heWJlRm9jdXNUcmVlKHRyZWVJZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0cmVlSWQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciB0cmVlSWQgPSB0cmVlSWRPclNldFN0YXRlRnVuY3Rpb247XG4gICAgICAgICAgICBzZXRBY3RpdmVUcmVlSWQodHJlZUlkKTtcbiAgICAgICAgICAgIG1heWJlRm9jdXNUcmVlKHRyZWVJZCk7XG4gICAgICAgIH1cbiAgICB9LCBbYXV0b0ZvY3VzLCBmb2N1c1RyZWVdKTtcbiAgICB2YXIgcmVuZGVyZXJzID0gdXNlUmVuZGVyZXJzKHByb3BzKTtcbiAgICByZXR1cm4gX19hc3NpZ24oX19hc3NpZ24oX19hc3NpZ24oe30sIHJlbmRlcmVycyksIHByb3BzKSwgeyBvbkZvY3VzSXRlbTogb25Gb2N1c0l0ZW1IYW5kbGVyLCByZWdpc3RlclRyZWU6IHJlZ2lzdGVyVHJlZSwgdW5yZWdpc3RlclRyZWU6IHVucmVnaXN0ZXJUcmVlLCBvbkV4cGFuZEl0ZW06IG9uRXhwYW5kSXRlbSwgb25Db2xsYXBzZUl0ZW06IG9uQ29sbGFwc2VJdGVtLCBvbkRyb3A6IG9uRHJvcCwgc2V0QWN0aXZlVHJlZTogc2V0QWN0aXZlVHJlZSwgdHJlZUlkczogdHJlZUlkcywgdHJlZXM6IHRyZWVzLCBhY3RpdmVUcmVlSWQ6IGFjdGl2ZVRyZWVJZCwgbGluZWFySXRlbXM6IGxpbmVhckl0ZW1zIH0pO1xufTtcbiIsInZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IGZ1bmN0aW9uICgpIHtcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXG4gICAgICAgICAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VDb250ZXh0IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgSW50ZXJhY3Rpb25NYW5hZ2VyUHJvdmlkZXIgfSBmcm9tICcuL0ludGVyYWN0aW9uTWFuYWdlclByb3ZpZGVyJztcbmltcG9ydCB7IERyYWdBbmREcm9wUHJvdmlkZXIgfSBmcm9tICcuLi9kcmFnL0RyYWdBbmREcm9wUHJvdmlkZXInO1xuaW1wb3J0IHsgRW52aXJvbm1lbnRBY3Rpb25zUHJvdmlkZXIgfSBmcm9tICcuLi9lbnZpcm9ubWVudEFjdGlvbnMvRW52aXJvbm1lbnRBY3Rpb25zUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlQ29udHJvbGxlZFRyZWVFbnZpcm9ubWVudFByb3BzIH0gZnJvbSAnLi91c2VDb250cm9sbGVkVHJlZUVudmlyb25tZW50UHJvcHMnO1xudmFyIFRyZWVFbnZpcm9ubWVudENvbnRleHQgPSBSZWFjdC5jcmVhdGVDb250ZXh0KG51bGwpO1xuZXhwb3J0IHZhciB1c2VUcmVlRW52aXJvbm1lbnQgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB1c2VDb250ZXh0KFRyZWVFbnZpcm9ubWVudENvbnRleHQpOyB9O1xuZXhwb3J0IHZhciBDb250cm9sbGVkVHJlZUVudmlyb25tZW50ID0gUmVhY3QuZm9yd2FyZFJlZihmdW5jdGlvbiAocHJvcHMsIHJlZikge1xuICAgIHZhciBfYSwgX2IsIF9jO1xuICAgIHZhciBlbnZpcm9ubWVudENvbnRleHRQcm9wcyA9IHVzZUNvbnRyb2xsZWRUcmVlRW52aXJvbm1lbnRQcm9wcyhwcm9wcyk7XG4gICAgdmFyIHZpZXdTdGF0ZSA9IHByb3BzLnZpZXdTdGF0ZTtcbiAgICAvLyBNYWtlIHN1cmUgdGhhdCBldmVyeSB0cmVlIHZpZXcgc3RhdGUgaGFzIGEgZm9jdXNlZCBpdGVtXG4gICAgZm9yICh2YXIgX2kgPSAwLCBfZCA9IE9iamVjdC5rZXlzKGVudmlyb25tZW50Q29udGV4dFByb3BzLnRyZWVzKTsgX2kgPCBfZC5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgdmFyIHRyZWVJZCA9IF9kW19pXTtcbiAgICAgICAgLy8gVE9ETyBpZiB0aGUgZm9jdXMgaXRlbSBpcyBkcmFnZ2VkIG91dCBvZiB0aGUgdHJlZSBhbmQgaXMgbm90IHdpdGhpbiB0aGUgZXhwYW5kZWQgaXRlbXNcbiAgICAgICAgLy8gVE9ETyBvZiB0aGF0IHRyZWUsIHRoZSB0cmVlIGRvZXMgbm90IHNob3cgYW55IGZvY3VzIGl0ZW0gYW55bW9yZS5cbiAgICAgICAgLy8gRml4OiB1c2UgbGluZWFyIGl0ZW1zIHRvIHNlZSBpZiBmb2N1cyBpdGVtIGlzIHZpc2libGUsIGFuZCByZXNldCBpZiBub3QuIE9ubHkgcmVmcmVzaCB0aGF0XG4gICAgICAgIC8vIGluZm9ybWF0aW9uIHdoZW4gdGhlIHZpZXdzdGF0ZSBjaGFuZ2VzXG4gICAgICAgIGlmICghKChfYSA9IHZpZXdTdGF0ZVt0cmVlSWRdKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZm9jdXNlZEl0ZW0pICYmXG4gICAgICAgICAgICBlbnZpcm9ubWVudENvbnRleHRQcm9wcy50cmVlc1t0cmVlSWRdKSB7XG4gICAgICAgICAgICB2aWV3U3RhdGVbdHJlZUlkXSA9IF9fYXNzaWduKF9fYXNzaWduKHt9LCB2aWV3U3RhdGVbdHJlZUlkXSksIHsgZm9jdXNlZEl0ZW06IChfYyA9IChfYiA9IHByb3BzLml0ZW1zW2Vudmlyb25tZW50Q29udGV4dFByb3BzLnRyZWVzW3RyZWVJZF0ucm9vdEl0ZW1dKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuY2hpbGRyZW4pID09PSBudWxsIHx8IF9jID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfY1swXSB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoVHJlZUVudmlyb25tZW50Q29udGV4dC5Qcm92aWRlciwgeyB2YWx1ZTogZW52aXJvbm1lbnRDb250ZXh0UHJvcHMgfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJbnRlcmFjdGlvbk1hbmFnZXJQcm92aWRlciwgbnVsbCxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRHJhZ0FuZERyb3BQcm92aWRlciwgbnVsbCxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEVudmlyb25tZW50QWN0aW9uc1Byb3ZpZGVyLCB7IHJlZjogcmVmIH0sIHByb3BzLmNoaWxkcmVuKSkpKSk7XG59KTtcbiIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZVRyZWUgfSBmcm9tICcuL1RyZWUnO1xuaW1wb3J0IHsgdXNlRHJhZ0FuZERyb3AgfSBmcm9tICcuLi9kcmFnL0RyYWdBbmREcm9wUHJvdmlkZXInO1xuZXhwb3J0IHZhciBEcmFnQmV0d2VlbkxpbmUgPSBmdW5jdGlvbiAoX2EpIHtcbiAgICB2YXIgX2I7XG4gICAgdmFyIHRyZWVJZCA9IF9hLnRyZWVJZDtcbiAgICB2YXIgX2MgPSB1c2VEcmFnQW5kRHJvcCgpLCBkcmFnZ2luZ1Bvc2l0aW9uID0gX2MuZHJhZ2dpbmdQb3NpdGlvbiwgaXRlbUhlaWdodCA9IF9jLml0ZW1IZWlnaHQ7XG4gICAgdmFyIHJlbmRlcmVycyA9IHVzZVRyZWUoKS5yZW5kZXJlcnM7XG4gICAgdmFyIHNob3VsZERpc3BsYXkgPSBkcmFnZ2luZ1Bvc2l0aW9uICYmXG4gICAgICAgIGRyYWdnaW5nUG9zaXRpb24udGFyZ2V0VHlwZSA9PT0gJ2JldHdlZW4taXRlbXMnICYmXG4gICAgICAgIGRyYWdnaW5nUG9zaXRpb24udHJlZUlkID09PSB0cmVlSWQ7XG4gICAgaWYgKCFzaG91bGREaXNwbGF5KSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICB2YXIgbGluZVByb3BzID0ge1xuICAgICAgICBvbkRyYWdPdmVyOiBmdW5jdGlvbiAoZSkgeyByZXR1cm4gZS5wcmV2ZW50RGVmYXVsdCgpOyB9LCAvLyBBbGxvdyBkcm9wcGluZ1xuICAgIH07XG4gICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgc3R5bGU6IHtcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgbGVmdDogJzAnLFxuICAgICAgICAgICAgcmlnaHQ6ICcwJyxcbiAgICAgICAgICAgIHRvcDogXCJcIi5jb25jYXQoKChfYiA9IGRyYWdnaW5nUG9zaXRpb24gPT09IG51bGwgfHwgZHJhZ2dpbmdQb3NpdGlvbiA9PT0gdm9pZCAwID8gdm9pZCAwIDogZHJhZ2dpbmdQb3NpdGlvbi5saW5lYXJJbmRleCkgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogMCkgKiBpdGVtSGVpZ2h0LCBcInB4XCIpLFxuICAgICAgICB9IH0sIHJlbmRlcmVycy5yZW5kZXJEcmFnQmV0d2VlbkxpbmUoe1xuICAgICAgICBkcmFnZ2luZ1Bvc2l0aW9uOiBkcmFnZ2luZ1Bvc2l0aW9uLFxuICAgICAgICBsaW5lUHJvcHM6IGxpbmVQcm9wcyxcbiAgICB9KSkpO1xufTtcbiIsImltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZVN0YWJsZUhhbmRsZXIgfSBmcm9tICcuL3VzZVN0YWJsZUhhbmRsZXInO1xuZXhwb3J0IHZhciB1c2VIdG1sRWxlbWVudEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbiAoZWxlbWVudCwgdHlwZSwgbGlzdGVuZXIpIHtcbiAgICB2YXIgc3RhYmxlTGlzdGVuZXIgPSB1c2VTdGFibGVIYW5kbGVyKGxpc3RlbmVyKTtcbiAgICB1c2VFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKHR5cGUsIHN0YWJsZUxpc3RlbmVyKTtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7IHJldHVybiBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgc3RhYmxlTGlzdGVuZXIpOyB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7IH07XG4gICAgfSwgW2VsZW1lbnQsIHN0YWJsZUxpc3RlbmVyLCB0eXBlXSk7XG59O1xuIiwiaW1wb3J0IHsgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZUh0bWxFbGVtZW50RXZlbnRMaXN0ZW5lciB9IGZyb20gJy4uL3VzZUh0bWxFbGVtZW50RXZlbnRMaXN0ZW5lcic7XG5pbXBvcnQgeyB1c2VDYWxsU29vbiB9IGZyb20gJy4uL3VzZUNhbGxTb29uJztcbmV4cG9ydCB2YXIgdXNlRm9jdXNXaXRoaW4gPSBmdW5jdGlvbiAoZWxlbWVudCwgb25Gb2N1c0luLCBvbkZvY3VzT3V0KSB7XG4gICAgdmFyIF9hID0gdXNlU3RhdGUoZmFsc2UpLCBmb2N1c1dpdGhpbiA9IF9hWzBdLCBzZXRGb2N1c1dpdGhpbiA9IF9hWzFdO1xuICAgIHZhciBpc0xvb3NpbmdGb2N1c0ZsYWcgPSB1c2VSZWYoZmFsc2UpO1xuICAgIHZhciBjYWxsU29vbiA9IHVzZUNhbGxTb29uKCk7XG4gICAgdXNlSHRtbEVsZW1lbnRFdmVudExpc3RlbmVyKGVsZW1lbnQsICdmb2N1c2luJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIWZvY3VzV2l0aGluKSB7XG4gICAgICAgICAgICBzZXRGb2N1c1dpdGhpbih0cnVlKTtcbiAgICAgICAgICAgIG9uRm9jdXNJbiA9PT0gbnVsbCB8fCBvbkZvY3VzSW4gPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9uRm9jdXNJbigpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc0xvb3NpbmdGb2N1c0ZsYWcuY3VycmVudCkge1xuICAgICAgICAgICAgaXNMb29zaW5nRm9jdXNGbGFnLmN1cnJlbnQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHVzZUh0bWxFbGVtZW50RXZlbnRMaXN0ZW5lcihlbGVtZW50LCAnZm9jdXNvdXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlzTG9vc2luZ0ZvY3VzRmxhZy5jdXJyZW50ID0gdHJ1ZTtcbiAgICAgICAgY2FsbFNvb24oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKGlzTG9vc2luZ0ZvY3VzRmxhZy5jdXJyZW50ICYmXG4gICAgICAgICAgICAgICAgIShlbGVtZW50ID09PSBudWxsIHx8IGVsZW1lbnQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGVsZW1lbnQuY29udGFpbnMoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkpKSB7XG4gICAgICAgICAgICAgICAgb25Gb2N1c091dCA9PT0gbnVsbCB8fCBvbkZvY3VzT3V0ID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvbkZvY3VzT3V0KCk7XG4gICAgICAgICAgICAgICAgaXNMb29zaW5nRm9jdXNGbGFnLmN1cnJlbnQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBzZXRGb2N1c1dpdGhpbihmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBmb2N1c1dpdGhpbjtcbn07XG4iLCJpbXBvcnQgeyB1c2VIdG1sRWxlbWVudEV2ZW50TGlzdGVuZXIgfSBmcm9tICcuLi91c2VIdG1sRWxlbWVudEV2ZW50TGlzdGVuZXInO1xuaW1wb3J0IHsgZ2V0RG9jdW1lbnQgfSBmcm9tICcuLi91dGlscyc7XG5leHBvcnQgdmFyIHVzZUtleSA9IGZ1bmN0aW9uIChrZXksIG9uSGl0LCBhY3RpdmUpIHtcbiAgICB1c2VIdG1sRWxlbWVudEV2ZW50TGlzdGVuZXIoZ2V0RG9jdW1lbnQoKSwgJ2tleWRvd24nLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoIWFjdGl2ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhY3RpdmUgJiYga2V5LnRvTG93ZXJDYXNlKCkgPT09IGUua2V5LnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgICAgIG9uSGl0KGUpO1xuICAgICAgICB9XG4gICAgfSk7XG59O1xuIiwiZXhwb3J0IHZhciBkZWZhdWx0S2V5Ym9hcmRCaW5kaW5ncyA9IHtcbiAgICBleHBhbmRTaWJsaW5nczogWydjb250cm9sKyonXSxcbiAgICBtb3ZlRm9jdXNUb0ZpcnN0SXRlbTogWydob21lJ10sXG4gICAgbW92ZUZvY3VzVG9MYXN0SXRlbTogWydlbmQnXSxcbiAgICBwcmltYXJ5QWN0aW9uOiBbJ2VudGVyJ10sXG4gICAgcmVuYW1lSXRlbTogWydmMiddLFxuICAgIGFib3J0UmVuYW1lSXRlbTogWydlc2NhcGUnXSxcbiAgICB0b2dnbGVTZWxlY3RJdGVtOiBbJ2NvbnRyb2wrc3BhY2UnXSxcbiAgICBhYm9ydFNlYXJjaDogWydlc2NhcGUnLCAnZW50ZXInXSxcbiAgICBzdGFydFNlYXJjaDogW10sXG4gICAgc2VsZWN0QWxsOiBbJ2NvbnRyb2wrYSddLFxuICAgIHN0YXJ0UHJvZ3JhbW1hdGljRG5kOiBbJ2NvbnRyb2wrZCddLFxuICAgIGNvbXBsZXRlUHJvZ3JhbW1hdGljRG5kOiBbJ2VudGVyJ10sXG4gICAgYWJvcnRQcm9ncmFtbWF0aWNEbmQ6IFsnZXNjYXBlJ10sXG59O1xuIiwidmFyIF9fYXNzaWduID0gKHRoaXMgJiYgdGhpcy5fX2Fzc2lnbikgfHwgZnVuY3Rpb24gKCkge1xuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0KSB7XG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSlcbiAgICAgICAgICAgICAgICB0W3BdID0gc1twXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdDtcbiAgICB9O1xuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcbmltcG9ydCB7IHVzZU1lbW8gfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VUcmVlRW52aXJvbm1lbnQgfSBmcm9tICcuLi9jb250cm9sbGVkRW52aXJvbm1lbnQvQ29udHJvbGxlZFRyZWVFbnZpcm9ubWVudCc7XG5pbXBvcnQgeyBkZWZhdWx0S2V5Ym9hcmRCaW5kaW5ncyB9IGZyb20gJy4vZGVmYXVsdEtleWJvYXJkQmluZGluZ3MnO1xuZXhwb3J0IHZhciB1c2VLZXlib2FyZEJpbmRpbmdzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBlbnZpcm9ubWVudCA9IHVzZVRyZWVFbnZpcm9ubWVudCgpO1xuICAgIHJldHVybiB1c2VNZW1vKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGVudmlyb25tZW50LmtleWJvYXJkQmluZGluZ3MpIHtcbiAgICAgICAgICAgIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgZGVmYXVsdEtleWJvYXJkQmluZGluZ3MpLCBlbnZpcm9ubWVudC5rZXlib2FyZEJpbmRpbmdzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVmYXVsdEtleWJvYXJkQmluZGluZ3M7XG4gICAgfSwgW2Vudmlyb25tZW50LmtleWJvYXJkQmluZGluZ3NdKTtcbn07XG4iLCJpbXBvcnQgeyB1c2VNZW1vLCB1c2VSZWYgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VIdG1sRWxlbWVudEV2ZW50TGlzdGVuZXIgfSBmcm9tICcuLi91c2VIdG1sRWxlbWVudEV2ZW50TGlzdGVuZXInO1xuaW1wb3J0IHsgdXNlS2V5Ym9hcmRCaW5kaW5ncyB9IGZyb20gJy4vdXNlS2V5Ym9hcmRCaW5kaW5ncyc7XG5pbXBvcnQgeyB1c2VDYWxsU29vbiB9IGZyb20gJy4uL3VzZUNhbGxTb29uJztcbmltcG9ydCB7IGdldERvY3VtZW50IH0gZnJvbSAnLi4vdXRpbHMnO1xudmFyIGVsZW1lbnRzVGhhdENhblRha2VUZXh0ID0gWydpbnB1dCcsICd0ZXh0YXJlYSddO1xuZXhwb3J0IHZhciB1c2VIb3RrZXkgPSBmdW5jdGlvbiAoY29tYmluYXRpb25OYW1lLCBvbkhpdCwgYWN0aXZlLCBhY3RpdmF0YWJsZVdoaWxlRm9jdXNpbmdJbnB1dCkge1xuICAgIGlmIChhY3RpdmF0YWJsZVdoaWxlRm9jdXNpbmdJbnB1dCA9PT0gdm9pZCAwKSB7IGFjdGl2YXRhYmxlV2hpbGVGb2N1c2luZ0lucHV0ID0gZmFsc2U7IH1cbiAgICB2YXIgcHJlc3NlZEtleXMgPSB1c2VSZWYoW10pO1xuICAgIHZhciBrZXlib2FyZEJpbmRpbmdzID0gdXNlS2V5Ym9hcmRCaW5kaW5ncygpO1xuICAgIHZhciBjYWxsU29vbiA9IHVzZUNhbGxTb29uKCk7XG4gICAgdmFyIHBvc3NpYmxlQ29tYmluYXRpb25zID0gdXNlTWVtbyhmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBrZXlib2FyZEJpbmRpbmdzW2NvbWJpbmF0aW9uTmFtZV0ubWFwKGZ1bmN0aW9uIChjb21iaW5hdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIGNvbWJpbmF0aW9uLnNwbGl0KCcrJyk7XG4gICAgICAgIH0pO1xuICAgIH0sIFtjb21iaW5hdGlvbk5hbWUsIGtleWJvYXJkQmluZGluZ3NdKTtcbiAgICB1c2VIdG1sRWxlbWVudEV2ZW50TGlzdGVuZXIoZ2V0RG9jdW1lbnQoKSwgJ2tleWRvd24nLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIGlmIChhY3RpdmUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKChlbGVtZW50c1RoYXRDYW5UYWtlVGV4dC5pbmNsdWRlcygoX2EgPSBlLnRhcmdldC50YWdOYW1lKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EudG9Mb3dlckNhc2UoKSkgfHxcbiAgICAgICAgICAgIGUudGFyZ2V0LmlzQ29udGVudEVkaXRhYmxlKSAmJlxuICAgICAgICAgICAgIWFjdGl2YXRhYmxlV2hpbGVGb2N1c2luZ0lucHV0KSB7XG4gICAgICAgICAgICAvLyBTa2lwIGlmIGFuIGlucHV0IGlzIHNlbGVjdGVkXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFwcmVzc2VkS2V5cy5jdXJyZW50LmluY2x1ZGVzKGUua2V5KSkge1xuICAgICAgICAgICAgcHJlc3NlZEtleXMuY3VycmVudC5wdXNoKGUua2V5KTtcbiAgICAgICAgICAgIHZhciBwcmVzc2VkS2V5c0xvd2VyY2FzZV8xID0gcHJlc3NlZEtleXMuY3VycmVudC5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBrZXkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdmFyIHBhcnRpYWxNYXRjaCA9IHBvc3NpYmxlQ29tYmluYXRpb25zXG4gICAgICAgICAgICAgICAgLm1hcChmdW5jdGlvbiAoY29tYmluYXRpb24pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJlc3NlZEtleXNMb3dlcmNhc2VfMVxuICAgICAgICAgICAgICAgICAgICAubWFwKGZ1bmN0aW9uIChrZXkpIHsgcmV0dXJuIGNvbWJpbmF0aW9uLmluY2x1ZGVzKGtleS50b0xvd2VyQ2FzZSgpKTsgfSlcbiAgICAgICAgICAgICAgICAgICAgLnJlZHVjZShmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gYSAmJiBiOyB9LCB0cnVlKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnJlZHVjZShmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gYSB8fCBiOyB9LCBmYWxzZSk7XG4gICAgICAgICAgICBpZiAocGFydGlhbE1hdGNoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHByZXNzZWRLZXlzLmN1cnJlbnQubGVuZ3RoID4gMSB8fCAhL15bYS16QS1aXSQvLnRlc3QoZS5rZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFByZXZlbnQgZGVmYXVsdCwgYnV0IG5vdCBpZiB0aGlzIGlzIHRoZSBmaXJzdCBpbnB1dCBhbmQgYSBsZXR0ZXIgKHdoaWNoIHNob3VsZCB0cmlnZ2VyIGEgc2VhcmNoKVxuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgdXNlSHRtbEVsZW1lbnRFdmVudExpc3RlbmVyKGdldERvY3VtZW50KCksICdrZXl1cCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmIChhY3RpdmUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHByZXNzZWRLZXlzTG93ZXJjYXNlID0gcHJlc3NlZEtleXMuY3VycmVudC5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgcmV0dXJuIGtleS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIG1hdGNoID0gcG9zc2libGVDb21iaW5hdGlvbnNcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKGNvbWJpbmF0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gY29tYmluYXRpb25cbiAgICAgICAgICAgICAgICAubWFwKGZ1bmN0aW9uIChrZXkpIHsgcmV0dXJuIHByZXNzZWRLZXlzTG93ZXJjYXNlLmluY2x1ZGVzKGtleS50b0xvd2VyQ2FzZSgpKTsgfSlcbiAgICAgICAgICAgICAgICAucmVkdWNlKGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiBhICYmIGI7IH0sIHRydWUpO1xuICAgICAgICB9KVxuICAgICAgICAgICAgLnJlZHVjZShmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gYSB8fCBiOyB9LCBmYWxzZSk7XG4gICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgY2FsbFNvb24oZnVuY3Rpb24gKCkgeyByZXR1cm4gb25IaXQoZSk7IH0pO1xuICAgICAgICB9XG4gICAgICAgIHByZXNzZWRLZXlzLmN1cnJlbnQgPSBwcmVzc2VkS2V5cy5jdXJyZW50LmZpbHRlcihmdW5jdGlvbiAoa2V5KSB7IHJldHVybiBrZXkgIT09IGUua2V5OyB9KTtcbiAgICB9KTtcbn07XG4iLCJpbXBvcnQgeyB1c2VUcmVlIH0gZnJvbSAnLi9UcmVlJztcbmltcG9ydCB7IHVzZVRyZWVFbnZpcm9ubWVudCB9IGZyb20gJy4uL2NvbnRyb2xsZWRFbnZpcm9ubWVudC9Db250cm9sbGVkVHJlZUVudmlyb25tZW50JztcbmV4cG9ydCB2YXIgdXNlVmlld1N0YXRlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBfYTtcbiAgICB2YXIgdHJlZUlkID0gdXNlVHJlZSgpLnRyZWVJZDtcbiAgICB2YXIgdmlld1N0YXRlID0gdXNlVHJlZUVudmlyb25tZW50KCkudmlld1N0YXRlO1xuICAgIHJldHVybiAoX2EgPSB2aWV3U3RhdGVbdHJlZUlkXSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDoge307XG59O1xuIiwiaW1wb3J0IHsgdXNlVHJlZUVudmlyb25tZW50IH0gZnJvbSAnLi9Db250cm9sbGVkVHJlZUVudmlyb25tZW50JztcbmV4cG9ydCB2YXIgdXNlTGluZWFySXRlbXMgPSBmdW5jdGlvbiAodHJlZUlkKSB7XG4gICAgcmV0dXJuIHVzZVRyZWVFbnZpcm9ubWVudCgpLmxpbmVhckl0ZW1zW3RyZWVJZF07XG59O1xuIiwiaW1wb3J0IHsgdXNlVmlld1N0YXRlIH0gZnJvbSAnLi91c2VWaWV3U3RhdGUnO1xuaW1wb3J0IHsgdXNlVHJlZSB9IGZyb20gJy4vVHJlZSc7XG5pbXBvcnQgeyB1c2VUcmVlRW52aXJvbm1lbnQgfSBmcm9tICcuLi9jb250cm9sbGVkRW52aXJvbm1lbnQvQ29udHJvbGxlZFRyZWVFbnZpcm9ubWVudCc7XG5pbXBvcnQgeyB1c2VMaW5lYXJJdGVtcyB9IGZyb20gJy4uL2NvbnRyb2xsZWRFbnZpcm9ubWVudC91c2VMaW5lYXJJdGVtcyc7XG5pbXBvcnQgeyB1c2VTdGFibGVIYW5kbGVyIH0gZnJvbSAnLi4vdXNlU3RhYmxlSGFuZGxlcic7XG5leHBvcnQgdmFyIHVzZU1vdmVGb2N1c1RvSW5kZXggPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRyZWVJZCA9IHVzZVRyZWUoKS50cmVlSWQ7XG4gICAgdmFyIF9hID0gdXNlVHJlZUVudmlyb25tZW50KCksIG9uRm9jdXNJdGVtID0gX2Eub25Gb2N1c0l0ZW0sIGl0ZW1zID0gX2EuaXRlbXM7XG4gICAgdmFyIGxpbmVhckl0ZW1zID0gdXNlTGluZWFySXRlbXModHJlZUlkKTtcbiAgICB2YXIgdmlld1N0YXRlID0gdXNlVmlld1N0YXRlKCk7XG4gICAgcmV0dXJuIHVzZVN0YWJsZUhhbmRsZXIoZnVuY3Rpb24gKGNvbXB1dGVOZXdJbmRleCkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHZhciBjdXJyZW50SW5kZXggPSAoX2EgPSBsaW5lYXJJdGVtcy5maW5kSW5kZXgoZnVuY3Rpb24gKGl0ZW0pIHsgcmV0dXJuIGl0ZW0uaXRlbSA9PT0gdmlld1N0YXRlLmZvY3VzZWRJdGVtOyB9KSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogMDtcbiAgICAgICAgdmFyIG5ld0luZGV4ID0gY29tcHV0ZU5ld0luZGV4KGN1cnJlbnRJbmRleCwgbGluZWFySXRlbXMpO1xuICAgICAgICB2YXIgbmV3SW5kZXhCb3VuZGVkID0gTWF0aC5tYXgoMCwgTWF0aC5taW4obGluZWFySXRlbXMubGVuZ3RoIC0gMSwgbmV3SW5kZXgpKTtcbiAgICAgICAgdmFyIG5ld0ZvY3VzSXRlbSA9IGl0ZW1zW2xpbmVhckl0ZW1zW25ld0luZGV4Qm91bmRlZF0uaXRlbV07XG4gICAgICAgIG9uRm9jdXNJdGVtID09PSBudWxsIHx8IG9uRm9jdXNJdGVtID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvbkZvY3VzSXRlbShuZXdGb2N1c0l0ZW0sIHRyZWVJZCk7XG4gICAgICAgIHJldHVybiBuZXdGb2N1c0l0ZW07XG4gICAgfSk7XG59O1xuIiwidmFyIF9fc3ByZWFkQXJyYXkgPSAodGhpcyAmJiB0aGlzLl9fc3ByZWFkQXJyYXkpIHx8IGZ1bmN0aW9uICh0bywgZnJvbSwgcGFjaykge1xuICAgIGlmIChwYWNrIHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIGZvciAodmFyIGkgPSAwLCBsID0gZnJvbS5sZW5ndGgsIGFyOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGlmIChhciB8fCAhKGkgaW4gZnJvbSkpIHtcbiAgICAgICAgICAgIGlmICghYXIpIGFyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSwgMCwgaSk7XG4gICAgICAgICAgICBhcltpXSA9IGZyb21baV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRvLmNvbmNhdChhciB8fCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tKSk7XG59O1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZVJlZiB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZVZpZXdTdGF0ZSB9IGZyb20gJy4vdXNlVmlld1N0YXRlJztcbmltcG9ydCB7IHVzZVRyZWUgfSBmcm9tICcuL1RyZWUnO1xuaW1wb3J0IHsgdXNlVHJlZUVudmlyb25tZW50IH0gZnJvbSAnLi4vY29udHJvbGxlZEVudmlyb25tZW50L0NvbnRyb2xsZWRUcmVlRW52aXJvbm1lbnQnO1xuaW1wb3J0IHsgdXNlTGluZWFySXRlbXMgfSBmcm9tICcuLi9jb250cm9sbGVkRW52aXJvbm1lbnQvdXNlTGluZWFySXRlbXMnO1xudmFyIHVzZVByZXZpb3VzID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgdmFyIHJlZiA9IHVzZVJlZih7XG4gICAgICAgIHRhcmdldDogdmFsdWUsXG4gICAgICAgIHByZXZpb3VzOiB1bmRlZmluZWQsXG4gICAgfSk7XG4gICAgaWYgKHJlZi5jdXJyZW50LnRhcmdldCAhPT0gdmFsdWUpIHtcbiAgICAgICAgcmVmLmN1cnJlbnQucHJldmlvdXMgPSByZWYuY3VycmVudC50YXJnZXQ7XG4gICAgICAgIHJlZi5jdXJyZW50LnRhcmdldCA9IHZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gcmVmLmN1cnJlbnQucHJldmlvdXM7XG59O1xuZXhwb3J0IHZhciB1c2VTZWxlY3RVcFRvID0gZnVuY3Rpb24gKHN0YXJ0aW5nQXQpIHtcbiAgICB2YXIgdmlld1N0YXRlID0gdXNlVmlld1N0YXRlKCk7XG4gICAgdmFyIHRyZWVJZCA9IHVzZVRyZWUoKS50cmVlSWQ7XG4gICAgdmFyIGxpbmVhckl0ZW1zID0gdXNlTGluZWFySXRlbXModHJlZUlkKTtcbiAgICB2YXIgb25TZWxlY3RJdGVtcyA9IHVzZVRyZWVFbnZpcm9ubWVudCgpLm9uU2VsZWN0SXRlbXM7XG4gICAgdmFyIGZvY3VzZWRJdGVtUHJldmlvdXMgPSB1c2VQcmV2aW91cyh2aWV3U3RhdGUuZm9jdXNlZEl0ZW0pO1xuICAgIHJldHVybiB1c2VDYWxsYmFjayhmdW5jdGlvbiAoaXRlbSwgb3ZlcnJpZGVPbGRTZWxlY3Rpb24pIHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgaWYgKG92ZXJyaWRlT2xkU2VsZWN0aW9uID09PSB2b2lkIDApIHsgb3ZlcnJpZGVPbGRTZWxlY3Rpb24gPSBmYWxzZTsgfVxuICAgICAgICB2YXIgaXRlbUluZGV4ID0gaXRlbS5pbmRleDtcbiAgICAgICAgdmFyIHNlbGVjdE1lcmdlZEl0ZW1zID0gZnVuY3Rpb24gKG9sZFNlbGVjdGlvbiwgbmV3U2VsZWN0aW9uKSB7XG4gICAgICAgICAgICB2YXIgbWVyZ2VkID0gX19zcHJlYWRBcnJheShfX3NwcmVhZEFycmF5KFtdLCAob3ZlcnJpZGVPbGRTZWxlY3Rpb24gPyBbXSA6IG9sZFNlbGVjdGlvbiksIHRydWUpLCBuZXdTZWxlY3Rpb24uZmlsdGVyKGZ1bmN0aW9uIChpKSB7IHJldHVybiBvdmVycmlkZU9sZFNlbGVjdGlvbiB8fCAhb2xkU2VsZWN0aW9uLmluY2x1ZGVzKGkpOyB9KSwgdHJ1ZSk7XG4gICAgICAgICAgICBvblNlbGVjdEl0ZW1zID09PSBudWxsIHx8IG9uU2VsZWN0SXRlbXMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9uU2VsZWN0SXRlbXMobWVyZ2VkLCB0cmVlSWQpO1xuICAgICAgICB9O1xuICAgICAgICBpZiAodmlld1N0YXRlICYmXG4gICAgICAgICAgICB2aWV3U3RhdGUuc2VsZWN0ZWRJdGVtcyAmJlxuICAgICAgICAgICAgdmlld1N0YXRlLnNlbGVjdGVkSXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgLy8gRGVwZW5kaW5nIG9uIHdoZXRoZXIgZm9jdXNJdGVtKCkgb3Igc2VsZWN0VXBUbygpIHdhcyBjYWxsZWQgZmlyc3QsIHdoaWNoIGl0ZW0gd2FzIHRoZSBsYXN0IGZvY3VzZWQgaXRlbSBkZXBlbmRzXG4gICAgICAgICAgICB2YXIgbGFzdEZvY3VzXzEgPSB2aWV3U3RhdGUuZm9jdXNlZEl0ZW0gPT09IGl0ZW1JbmRleFxuICAgICAgICAgICAgICAgID8gZm9jdXNlZEl0ZW1QcmV2aW91c1xuICAgICAgICAgICAgICAgIDogdmlld1N0YXRlLmZvY3VzZWRJdGVtO1xuICAgICAgICAgICAgdmFyIHNlbGVjdGlvblN0YXJ0ID0gc3RhcnRpbmdBdCA9PT0gJ2xhc3QtZm9jdXMnXG4gICAgICAgICAgICAgICAgPyBsaW5lYXJJdGVtcy5maW5kSW5kZXgoZnVuY3Rpb24gKGxpbmVhckl0ZW0pIHsgcmV0dXJuIGxhc3RGb2N1c18xID09PSBsaW5lYXJJdGVtLml0ZW07IH0pXG4gICAgICAgICAgICAgICAgOiBsaW5lYXJJdGVtcy5maW5kSW5kZXgoZnVuY3Rpb24gKGxpbmVhckl0ZW0pIHsgdmFyIF9hOyByZXR1cm4gKF9hID0gdmlld1N0YXRlLnNlbGVjdGVkSXRlbXMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5pbmNsdWRlcyhsaW5lYXJJdGVtLml0ZW0pOyB9KTtcbiAgICAgICAgICAgIHZhciBzZWxlY3Rpb25FbmQgPSBsaW5lYXJJdGVtcy5maW5kSW5kZXgoZnVuY3Rpb24gKGxpbmVhckl0ZW0pIHsgcmV0dXJuIGxpbmVhckl0ZW0uaXRlbSA9PT0gaXRlbUluZGV4OyB9KTtcbiAgICAgICAgICAgIGlmIChzZWxlY3Rpb25TdGFydCA8IHNlbGVjdGlvbkVuZCkge1xuICAgICAgICAgICAgICAgIHZhciBzZWxlY3Rpb24gPSBsaW5lYXJJdGVtc1xuICAgICAgICAgICAgICAgICAgICAuc2xpY2Uoc2VsZWN0aW9uU3RhcnQsIHNlbGVjdGlvbkVuZCArIDEpXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpdGVtID0gX2EuaXRlbTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgc2VsZWN0TWVyZ2VkSXRlbXMoKF9hID0gdmlld1N0YXRlLnNlbGVjdGVkSXRlbXMpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IFtdLCBzZWxlY3Rpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGVjdGlvbiA9IGxpbmVhckl0ZW1zXG4gICAgICAgICAgICAgICAgICAgIC5zbGljZShzZWxlY3Rpb25FbmQsIHNlbGVjdGlvblN0YXJ0ICsgMSlcbiAgICAgICAgICAgICAgICAgICAgLm1hcChmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSBfYS5pdGVtO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBzZWxlY3RNZXJnZWRJdGVtcygoX2IgPSB2aWV3U3RhdGUuc2VsZWN0ZWRJdGVtcykgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogW10sIHNlbGVjdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBvblNlbGVjdEl0ZW1zID09PSBudWxsIHx8IG9uU2VsZWN0SXRlbXMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9uU2VsZWN0SXRlbXMoW2l0ZW1JbmRleF0sIHRyZWVJZCk7XG4gICAgICAgIH1cbiAgICB9LCBbXG4gICAgICAgIHZpZXdTdGF0ZSxcbiAgICAgICAgb25TZWxlY3RJdGVtcyxcbiAgICAgICAgdHJlZUlkLFxuICAgICAgICBzdGFydGluZ0F0LFxuICAgICAgICBsaW5lYXJJdGVtcyxcbiAgICAgICAgZm9jdXNlZEl0ZW1QcmV2aW91cyxcbiAgICBdKTtcbn07XG4iLCJ2YXIgX19zcHJlYWRBcnJheSA9ICh0aGlzICYmIHRoaXMuX19zcHJlYWRBcnJheSkgfHwgZnVuY3Rpb24gKHRvLCBmcm9tLCBwYWNrKSB7XG4gICAgaWYgKHBhY2sgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gMikgZm9yICh2YXIgaSA9IDAsIGwgPSBmcm9tLmxlbmd0aCwgYXI7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgaWYgKGFyIHx8ICEoaSBpbiBmcm9tKSkge1xuICAgICAgICAgICAgaWYgKCFhcikgYXIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tLCAwLCBpKTtcbiAgICAgICAgICAgIGFyW2ldID0gZnJvbVtpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdG8uY29uY2F0KGFyIHx8IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20pKTtcbn07XG5pbXBvcnQgeyB1c2VLZXkgfSBmcm9tICcuLi9ob3RrZXlzL3VzZUtleSc7XG5pbXBvcnQgeyB1c2VIb3RrZXkgfSBmcm9tICcuLi9ob3RrZXlzL3VzZUhvdGtleSc7XG5pbXBvcnQgeyB1c2VNb3ZlRm9jdXNUb0luZGV4IH0gZnJvbSAnLi91c2VNb3ZlRm9jdXNUb0luZGV4JztcbmltcG9ydCB7IHVzZVZpZXdTdGF0ZSB9IGZyb20gJy4vdXNlVmlld1N0YXRlJztcbmltcG9ydCB7IHVzZVRyZWUgfSBmcm9tICcuL1RyZWUnO1xuaW1wb3J0IHsgdXNlVHJlZUVudmlyb25tZW50IH0gZnJvbSAnLi4vY29udHJvbGxlZEVudmlyb25tZW50L0NvbnRyb2xsZWRUcmVlRW52aXJvbm1lbnQnO1xuaW1wb3J0IHsgdXNlRHJhZ0FuZERyb3AgfSBmcm9tICcuLi9kcmFnL0RyYWdBbmREcm9wUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlU2VsZWN0VXBUbyB9IGZyb20gJy4vdXNlU2VsZWN0VXBUbyc7XG5pbXBvcnQgeyB1c2VMaW5lYXJJdGVtcyB9IGZyb20gJy4uL2NvbnRyb2xsZWRFbnZpcm9ubWVudC91c2VMaW5lYXJJdGVtcyc7XG5leHBvcnQgdmFyIHVzZVRyZWVLZXlib2FyZEJpbmRpbmdzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBfYTtcbiAgICB2YXIgZW52aXJvbm1lbnQgPSB1c2VUcmVlRW52aXJvbm1lbnQoKTtcbiAgICB2YXIgX2IgPSB1c2VUcmVlKCksIHRyZWVJZCA9IF9iLnRyZWVJZCwgc2V0UmVuYW1pbmdJdGVtID0gX2Iuc2V0UmVuYW1pbmdJdGVtLCBzZXRTZWFyY2ggPSBfYi5zZXRTZWFyY2gsIHJlbmFtaW5nSXRlbSA9IF9iLnJlbmFtaW5nSXRlbTtcbiAgICB2YXIgbGluZWFySXRlbXMgPSB1c2VMaW5lYXJJdGVtcyh0cmVlSWQpO1xuICAgIHZhciBkbmQgPSB1c2VEcmFnQW5kRHJvcCgpO1xuICAgIHZhciB2aWV3U3RhdGUgPSB1c2VWaWV3U3RhdGUoKTtcbiAgICB2YXIgbW92ZUZvY3VzVG9JbmRleCA9IHVzZU1vdmVGb2N1c1RvSW5kZXgoKTtcbiAgICB2YXIgc2VsZWN0VXBUbyA9IHVzZVNlbGVjdFVwVG8oJ2ZpcnN0LXNlbGVjdGVkJyk7XG4gICAgdmFyIGlzQWN0aXZlVHJlZSA9IGVudmlyb25tZW50LmFjdGl2ZVRyZWVJZCA9PT0gdHJlZUlkO1xuICAgIHZhciBpc1JlbmFtaW5nID0gISFyZW5hbWluZ0l0ZW07XG4gICAgdmFyIGRpc2FibGVBcnJvd0tleXMgPSBlbnZpcm9ubWVudC5kaXNhYmxlQXJyb3dLZXlzO1xuICAgIHZhciBlbmFibGVBcnJvd0tleXMgPSAhZGlzYWJsZUFycm93S2V5cyAmJiBpc0FjdGl2ZVRyZWUgJiYgIWlzUmVuYW1pbmc7XG4gICAgdXNlS2V5KCdhcnJvd2Rvd24nLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGlmIChkbmQuaXNQcm9ncmFtbWF0aWNhbGx5RHJhZ2dpbmcpIHtcbiAgICAgICAgICAgIGRuZC5wcm9ncmFtbWF0aWNEcmFnRG93bigpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIG5ld0ZvY3VzSXRlbSA9IG1vdmVGb2N1c1RvSW5kZXgoZnVuY3Rpb24gKGN1cnJlbnRJbmRleCkgeyByZXR1cm4gY3VycmVudEluZGV4ICsgMTsgfSk7XG4gICAgICAgICAgICBpZiAoZS5zaGlmdEtleSkge1xuICAgICAgICAgICAgICAgIHNlbGVjdFVwVG8obmV3Rm9jdXNJdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sIGVuYWJsZUFycm93S2V5cyk7XG4gICAgdXNlS2V5KCdhcnJvd3VwJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBpZiAoZG5kLmlzUHJvZ3JhbW1hdGljYWxseURyYWdnaW5nKSB7XG4gICAgICAgICAgICBkbmQucHJvZ3JhbW1hdGljRHJhZ1VwKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgbmV3Rm9jdXNJdGVtID0gbW92ZUZvY3VzVG9JbmRleChmdW5jdGlvbiAoY3VycmVudEluZGV4KSB7IHJldHVybiBjdXJyZW50SW5kZXggLSAxOyB9KTtcbiAgICAgICAgICAgIGlmIChlLnNoaWZ0S2V5KSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0VXBUbyhuZXdGb2N1c0l0ZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSwgZW5hYmxlQXJyb3dLZXlzKTtcbiAgICB1c2VIb3RrZXkoJ21vdmVGb2N1c1RvRmlyc3RJdGVtJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBtb3ZlRm9jdXNUb0luZGV4KGZ1bmN0aW9uICgpIHsgcmV0dXJuIDA7IH0pO1xuICAgIH0sIGlzQWN0aXZlVHJlZSAmJiAhZG5kLmlzUHJvZ3JhbW1hdGljYWxseURyYWdnaW5nICYmICFpc1JlbmFtaW5nKTtcbiAgICB1c2VIb3RrZXkoJ21vdmVGb2N1c1RvTGFzdEl0ZW0nLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIG1vdmVGb2N1c1RvSW5kZXgoZnVuY3Rpb24gKGN1cnJlbnRJbmRleCwgbGluZWFySXRlbXMpIHsgcmV0dXJuIGxpbmVhckl0ZW1zLmxlbmd0aCAtIDE7IH0pO1xuICAgIH0sIGlzQWN0aXZlVHJlZSAmJiAhZG5kLmlzUHJvZ3JhbW1hdGljYWxseURyYWdnaW5nICYmICFpc1JlbmFtaW5nKTtcbiAgICB1c2VLZXkoJ2Fycm93cmlnaHQnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIG1vdmVGb2N1c1RvSW5kZXgoZnVuY3Rpb24gKGN1cnJlbnRJbmRleCwgbGluZWFySXRlbXMpIHtcbiAgICAgICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IGVudmlyb25tZW50Lml0ZW1zW2xpbmVhckl0ZW1zW2N1cnJlbnRJbmRleF0uaXRlbV07XG4gICAgICAgICAgICBpZiAoaXRlbS5pc0ZvbGRlcikge1xuICAgICAgICAgICAgICAgIGlmICgoX2EgPSB2aWV3U3RhdGUuZXhwYW5kZWRJdGVtcykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmluY2x1ZGVzKGl0ZW0uaW5kZXgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjdXJyZW50SW5kZXggKyAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAoX2IgPSBlbnZpcm9ubWVudC5vbkV4cGFuZEl0ZW0pID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5jYWxsKGVudmlyb25tZW50LCBpdGVtLCB0cmVlSWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnRJbmRleDtcbiAgICAgICAgfSk7XG4gICAgfSwgZW5hYmxlQXJyb3dLZXlzICYmICFkbmQuaXNQcm9ncmFtbWF0aWNhbGx5RHJhZ2dpbmcpO1xuICAgIHVzZUtleSgnYXJyb3dsZWZ0JywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBtb3ZlRm9jdXNUb0luZGV4KGZ1bmN0aW9uIChjdXJyZW50SW5kZXgsIGxpbmVhckl0ZW1zKSB7XG4gICAgICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSBlbnZpcm9ubWVudC5pdGVtc1tsaW5lYXJJdGVtc1tjdXJyZW50SW5kZXhdLml0ZW1dO1xuICAgICAgICAgICAgdmFyIGl0ZW1EZXB0aCA9IGxpbmVhckl0ZW1zW2N1cnJlbnRJbmRleF0uZGVwdGg7XG4gICAgICAgICAgICBpZiAoaXRlbS5pc0ZvbGRlciAmJiAoKF9hID0gdmlld1N0YXRlLmV4cGFuZGVkSXRlbXMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5pbmNsdWRlcyhpdGVtLmluZGV4KSkpIHtcbiAgICAgICAgICAgICAgICAoX2IgPSBlbnZpcm9ubWVudC5vbkNvbGxhcHNlSXRlbSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmNhbGwoZW52aXJvbm1lbnQsIGl0ZW0sIHRyZWVJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpdGVtRGVwdGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhcmVudEluZGV4ID0gY3VycmVudEluZGV4O1xuICAgICAgICAgICAgICAgIGZvciAocGFyZW50SW5kZXg7IGxpbmVhckl0ZW1zW3BhcmVudEluZGV4XS5kZXB0aCAhPT0gaXRlbURlcHRoIC0gMTsgcGFyZW50SW5kZXggLT0gMSlcbiAgICAgICAgICAgICAgICAgICAgO1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJlbnRJbmRleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50SW5kZXg7XG4gICAgICAgIH0pO1xuICAgIH0sIGVuYWJsZUFycm93S2V5cyAmJiAhZG5kLmlzUHJvZ3JhbW1hdGljYWxseURyYWdnaW5nKTtcbiAgICB1c2VIb3RrZXkoJ3ByaW1hcnlBY3Rpb24nLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGlmICh2aWV3U3RhdGUuZm9jdXNlZEl0ZW0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgKF9hID0gZW52aXJvbm1lbnQub25TZWxlY3RJdGVtcykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmNhbGwoZW52aXJvbm1lbnQsIFt2aWV3U3RhdGUuZm9jdXNlZEl0ZW1dLCB0cmVlSWQpO1xuICAgICAgICAgICAgKF9iID0gZW52aXJvbm1lbnQub25QcmltYXJ5QWN0aW9uKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuY2FsbChlbnZpcm9ubWVudCwgZW52aXJvbm1lbnQuaXRlbXNbdmlld1N0YXRlLmZvY3VzZWRJdGVtXSwgdHJlZUlkKTtcbiAgICAgICAgfVxuICAgIH0sIGlzQWN0aXZlVHJlZSAmJiAhZG5kLmlzUHJvZ3JhbW1hdGljYWxseURyYWdnaW5nICYmICFpc1JlbmFtaW5nKTtcbiAgICB1c2VIb3RrZXkoJ3RvZ2dsZVNlbGVjdEl0ZW0nLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgX2EsIF9iLCBfYztcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBpZiAodmlld1N0YXRlLmZvY3VzZWRJdGVtICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlmICh2aWV3U3RhdGUuc2VsZWN0ZWRJdGVtcyAmJlxuICAgICAgICAgICAgICAgIHZpZXdTdGF0ZS5zZWxlY3RlZEl0ZW1zLmluY2x1ZGVzKHZpZXdTdGF0ZS5mb2N1c2VkSXRlbSkpIHtcbiAgICAgICAgICAgICAgICAoX2EgPSBlbnZpcm9ubWVudC5vblNlbGVjdEl0ZW1zKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuY2FsbChlbnZpcm9ubWVudCwgdmlld1N0YXRlLnNlbGVjdGVkSXRlbXMuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7IHJldHVybiBpdGVtICE9PSB2aWV3U3RhdGUuZm9jdXNlZEl0ZW07IH0pLCB0cmVlSWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgKF9iID0gZW52aXJvbm1lbnQub25TZWxlY3RJdGVtcykgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmNhbGwoZW52aXJvbm1lbnQsIF9fc3ByZWFkQXJyYXkoX19zcHJlYWRBcnJheShbXSwgKChfYyA9IHZpZXdTdGF0ZS5zZWxlY3RlZEl0ZW1zKSAhPT0gbnVsbCAmJiBfYyAhPT0gdm9pZCAwID8gX2MgOiBbXSksIHRydWUpLCBbdmlld1N0YXRlLmZvY3VzZWRJdGVtXSwgZmFsc2UpLCB0cmVlSWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSwgaXNBY3RpdmVUcmVlICYmICFkbmQuaXNQcm9ncmFtbWF0aWNhbGx5RHJhZ2dpbmcgJiYgIWlzUmVuYW1pbmcpO1xuICAgIHVzZUhvdGtleSgnc2VsZWN0QWxsJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIChfYSA9IGVudmlyb25tZW50Lm9uU2VsZWN0SXRlbXMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5jYWxsKGVudmlyb25tZW50LCBsaW5lYXJJdGVtcy5tYXAoZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IF9hLml0ZW07XG4gICAgICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgICAgfSksIHRyZWVJZCk7XG4gICAgfSwgaXNBY3RpdmVUcmVlICYmICFkbmQuaXNQcm9ncmFtbWF0aWNhbGx5RHJhZ2dpbmcgJiYgIWlzUmVuYW1pbmcpO1xuICAgIHVzZUhvdGtleSgncmVuYW1lSXRlbScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgaWYgKHZpZXdTdGF0ZS5mb2N1c2VkSXRlbSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB2YXIgaXRlbSA9IGVudmlyb25tZW50Lml0ZW1zW3ZpZXdTdGF0ZS5mb2N1c2VkSXRlbV07XG4gICAgICAgIGlmIChpdGVtLmNhblJlbmFtZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAoX2EgPSBlbnZpcm9ubWVudC5vblN0YXJ0UmVuYW1pbmdJdGVtKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuY2FsbChlbnZpcm9ubWVudCwgaXRlbSwgdHJlZUlkKTtcbiAgICAgICAgc2V0UmVuYW1pbmdJdGVtKGl0ZW0uaW5kZXgpO1xuICAgIH0sIGlzQWN0aXZlVHJlZSAmJiAoKF9hID0gZW52aXJvbm1lbnQuY2FuUmVuYW1lKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiB0cnVlKSAmJiAhaXNSZW5hbWluZyk7XG4gICAgdXNlSG90a2V5KCdzdGFydFNlYXJjaCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgc2V0U2VhcmNoKCcnKTtcbiAgICAgICAgKF9iID0gKF9hID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtcmN0LXNlYXJjaC1pbnB1dD1cInRydWVcIl0nKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmZvY3VzKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuY2FsbChfYSk7XG4gICAgfSwgaXNBY3RpdmVUcmVlICYmICFkbmQuaXNQcm9ncmFtbWF0aWNhbGx5RHJhZ2dpbmcgJiYgIWlzUmVuYW1pbmcpO1xuICAgIHVzZUhvdGtleSgnc3RhcnRQcm9ncmFtbWF0aWNEbmQnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGRuZC5zdGFydFByb2dyYW1tYXRpY0RyYWcoKTtcbiAgICB9LCBpc0FjdGl2ZVRyZWUgJiYgIWlzUmVuYW1pbmcpO1xuICAgIHVzZUhvdGtleSgnY29tcGxldGVQcm9ncmFtbWF0aWNEbmQnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGRuZC5jb21wbGV0ZVByb2dyYW1tYXRpY0RyYWcoKTtcbiAgICB9LCBpc0FjdGl2ZVRyZWUgJiYgZG5kLmlzUHJvZ3JhbW1hdGljYWxseURyYWdnaW5nICYmICFpc1JlbmFtaW5nKTtcbiAgICB1c2VIb3RrZXkoJ2Fib3J0UHJvZ3JhbW1hdGljRG5kJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBkbmQuYWJvcnRQcm9ncmFtbWF0aWNEcmFnKCk7XG4gICAgfSwgaXNBY3RpdmVUcmVlICYmIGRuZC5pc1Byb2dyYW1tYXRpY2FsbHlEcmFnZ2luZyAmJiAhaXNSZW5hbWluZyk7XG59O1xuIiwiZXhwb3J0IHZhciBkZWZhdWx0TWF0Y2hlciA9IGZ1bmN0aW9uIChzZWFyY2gsIGl0ZW0sIGl0ZW1UaXRsZSkge1xuICAgIHJldHVybiBpdGVtVGl0bGUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhzZWFyY2gudG9Mb3dlckNhc2UoKSk7XG59O1xuIiwiaW1wb3J0IHsgdXNlVHJlZSB9IGZyb20gJy4uL3RyZWUvVHJlZSc7XG5pbXBvcnQgeyB1c2VUcmVlRW52aXJvbm1lbnQgfSBmcm9tICcuLi9jb250cm9sbGVkRW52aXJvbm1lbnQvQ29udHJvbGxlZFRyZWVFbnZpcm9ubWVudCc7XG5pbXBvcnQgeyBkZWZhdWx0TWF0Y2hlciB9IGZyb20gJy4vZGVmYXVsdE1hdGNoZXInO1xuaW1wb3J0IHsgdXNlU2lkZUVmZmVjdCB9IGZyb20gJy4uL3VzZVNpZGVFZmZlY3QnO1xuaW1wb3J0IHsgdXNlTGluZWFySXRlbXMgfSBmcm9tICcuLi9jb250cm9sbGVkRW52aXJvbm1lbnQvdXNlTGluZWFySXRlbXMnO1xuaW1wb3J0IHsgdXNlQ2FsbFNvb24gfSBmcm9tICcuLi91c2VDYWxsU29vbic7XG5leHBvcnQgdmFyIHVzZVNlYXJjaE1hdGNoRm9jdXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF9hID0gdXNlVHJlZUVudmlyb25tZW50KCksIGRvZXNTZWFyY2hNYXRjaEl0ZW0gPSBfYS5kb2VzU2VhcmNoTWF0Y2hJdGVtLCBpdGVtcyA9IF9hLml0ZW1zLCBnZXRJdGVtVGl0bGUgPSBfYS5nZXRJdGVtVGl0bGUsIG9uRm9jdXNJdGVtID0gX2Eub25Gb2N1c0l0ZW07XG4gICAgdmFyIF9iID0gdXNlVHJlZSgpLCBzZWFyY2ggPSBfYi5zZWFyY2gsIHRyZWVJZCA9IF9iLnRyZWVJZDtcbiAgICB2YXIgbGluZWFySXRlbXMgPSB1c2VMaW5lYXJJdGVtcyh0cmVlSWQpO1xuICAgIHZhciBjYWxsU29vbiA9IHVzZUNhbGxTb29uKCk7XG4gICAgdXNlU2lkZUVmZmVjdChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChzZWFyY2ggJiYgc2VhcmNoLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNhbGxTb29uKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgZm9jdXNJdGVtID0gbGluZWFySXRlbXMuZmluZChmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSBfYS5pdGVtO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKGRvZXNTZWFyY2hNYXRjaEl0ZW0gIT09IG51bGwgJiYgZG9lc1NlYXJjaE1hdGNoSXRlbSAhPT0gdm9pZCAwID8gZG9lc1NlYXJjaE1hdGNoSXRlbSA6IGRlZmF1bHRNYXRjaGVyKShzZWFyY2gsIGl0ZW1zW2l0ZW1dLCBnZXRJdGVtVGl0bGUoaXRlbXNbaXRlbV0pKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAoZm9jdXNJdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIG9uRm9jdXNJdGVtID09PSBudWxsIHx8IG9uRm9jdXNJdGVtID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvbkZvY3VzSXRlbShpdGVtc1tmb2N1c0l0ZW0uaXRlbV0sIHRyZWVJZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LCBbXG4gICAgICAgIGRvZXNTZWFyY2hNYXRjaEl0ZW0sXG4gICAgICAgIGdldEl0ZW1UaXRsZSxcbiAgICAgICAgbGluZWFySXRlbXMsXG4gICAgICAgIGl0ZW1zLFxuICAgICAgICBvbkZvY3VzSXRlbSxcbiAgICAgICAgc2VhcmNoLFxuICAgICAgICB0cmVlSWQsXG4gICAgICAgIGNhbGxTb29uLFxuICAgIF0sIFtzZWFyY2hdKTtcbn07XG4iLCJ2YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxuICAgICAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0O1xuICAgIH07XG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuaW1wb3J0IHsgdXNlSHRtbEVsZW1lbnRFdmVudExpc3RlbmVyIH0gZnJvbSAnLi4vdXNlSHRtbEVsZW1lbnRFdmVudExpc3RlbmVyJztcbmltcG9ydCB7IHVzZUhvdGtleSB9IGZyb20gJy4uL2hvdGtleXMvdXNlSG90a2V5JztcbmltcG9ydCB7IHVzZVRyZWUgfSBmcm9tICcuLi90cmVlL1RyZWUnO1xuaW1wb3J0IHsgdXNlVHJlZUVudmlyb25tZW50IH0gZnJvbSAnLi4vY29udHJvbGxlZEVudmlyb25tZW50L0NvbnRyb2xsZWRUcmVlRW52aXJvbm1lbnQnO1xuaW1wb3J0IHsgdXNlU2VhcmNoTWF0Y2hGb2N1cyB9IGZyb20gJy4vdXNlU2VhcmNoTWF0Y2hGb2N1cyc7XG5pbXBvcnQgeyB1c2VWaWV3U3RhdGUgfSBmcm9tICcuLi90cmVlL3VzZVZpZXdTdGF0ZSc7XG5pbXBvcnQgeyB1c2VDYWxsU29vbiB9IGZyb20gJy4uL3VzZUNhbGxTb29uJztcbmltcG9ydCB7IGdldERvY3VtZW50IH0gZnJvbSAnLi4vdXRpbHMnO1xuZXhwb3J0IHZhciBTZWFyY2hJbnB1dCA9IGZ1bmN0aW9uIChfYSkge1xuICAgIHZhciBfYjtcbiAgICB2YXIgY29udGFpbmVyUmVmID0gX2EuY29udGFpbmVyUmVmO1xuICAgIHZhciBfYyA9IHVzZVRyZWUoKSwgc2VhcmNoID0gX2Muc2VhcmNoLCBzZXRTZWFyY2ggPSBfYy5zZXRTZWFyY2gsIHRyZWVJZCA9IF9jLnRyZWVJZCwgcmVuZGVyZXJzID0gX2MucmVuZGVyZXJzLCByZW5hbWluZ0l0ZW0gPSBfYy5yZW5hbWluZ0l0ZW07XG4gICAgdmFyIGVudmlyb25tZW50ID0gdXNlVHJlZUVudmlyb25tZW50KCk7XG4gICAgdXNlVmlld1N0YXRlKCk7XG4gICAgdmFyIGlzQWN0aXZlVHJlZSA9IGVudmlyb25tZW50LmFjdGl2ZVRyZWVJZCA9PT0gdHJlZUlkO1xuICAgIHZhciBjYWxsU29vbiA9IHVzZUNhbGxTb29uKCk7XG4gICAgdXNlU2VhcmNoTWF0Y2hGb2N1cygpO1xuICAgIHZhciBjbGVhclNlYXJjaCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF9hLCBfYiwgX2M7XG4gICAgICAgIHNldFNlYXJjaChudWxsKTtcbiAgICAgICAgaWYgKChfYSA9IGVudmlyb25tZW50LmF1dG9Gb2N1cykgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogdHJ1ZSkge1xuICAgICAgICAgICAgLy8gUmVmb2N1cyBpdGVtIGluIHRyZWVcbiAgICAgICAgICAgIC8vIFRPRE8gbW92ZSBsb2dpYyBhcyByZXVzYWJsZSBtZXRob2QgaW50byB0cmVlIG9yIHRyZWUgZW52aXJvbm1lbnRcbiAgICAgICAgICAgIHZhciBmb2N1c0l0ZW0gPSAoX2IgPSBnZXREb2N1bWVudCgpKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IucXVlcnlTZWxlY3RvcihcIltkYXRhLXJjdC10cmVlPVxcXCJcIi5jb25jYXQodHJlZUlkLCBcIlxcXCJdIFtkYXRhLXJjdC1pdGVtLWZvY3VzPVxcXCJ0cnVlXFxcIl1cIikpO1xuICAgICAgICAgICAgKF9jID0gZm9jdXNJdGVtID09PSBudWxsIHx8IGZvY3VzSXRlbSA9PT0gdm9pZCAwID8gdm9pZCAwIDogZm9jdXNJdGVtLmZvY3VzKSA9PT0gbnVsbCB8fCBfYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2MuY2FsbChmb2N1c0l0ZW0pO1xuICAgICAgICB9XG4gICAgfTtcbiAgICB1c2VIb3RrZXkoJ2Fib3J0U2VhcmNoJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBXaXRob3V0IHRoZSBjYWxsU29vbiwgaGl0dGluZyBlbnRlciB0byBhYm9ydFxuICAgICAgICAvLyBhbmQgdGhlbiBtb3ZpbmcgZm9jdXMgd2VpcmRseSBtb3ZlcyB0aGUgc2VsZWN0ZWQgaXRlbSBhbG9uZ1xuICAgICAgICAvLyB3aXRoIHRoZSBmb2N1c2VkIGl0ZW0uXG4gICAgICAgIGNhbGxTb29uKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNsZWFyU2VhcmNoKCk7XG4gICAgICAgIH0pO1xuICAgIH0sIGlzQWN0aXZlVHJlZSAmJiBzZWFyY2ggIT09IG51bGwsIHRydWUpO1xuICAgIHVzZUh0bWxFbGVtZW50RXZlbnRMaXN0ZW5lcihjb250YWluZXJSZWYsICdrZXlkb3duJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgdmFyIHVuaWNvZGUgPSBlLmtleS5jaGFyQ29kZUF0KDApO1xuICAgICAgICBpZiAoKChfYSA9IGVudmlyb25tZW50LmNhblNlYXJjaCkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogdHJ1ZSkgJiZcbiAgICAgICAgICAgICgoX2IgPSBlbnZpcm9ubWVudC5jYW5TZWFyY2hCeVN0YXJ0aW5nVHlwaW5nKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiB0cnVlKSAmJlxuICAgICAgICAgICAgaXNBY3RpdmVUcmVlICYmXG4gICAgICAgICAgICBzZWFyY2ggPT09IG51bGwgJiZcbiAgICAgICAgICAgICFyZW5hbWluZ0l0ZW0gJiZcbiAgICAgICAgICAgICFlLmN0cmxLZXkgJiZcbiAgICAgICAgICAgICFlLnNoaWZ0S2V5ICYmXG4gICAgICAgICAgICAhZS5hbHRLZXkgJiZcbiAgICAgICAgICAgICFlLm1ldGFLZXkgJiZcbiAgICAgICAgICAgICgodW5pY29kZSA+PSA0OCAmJiB1bmljb2RlIDw9IDU3KSB8fCAvLyBudW1iZXJcbiAgICAgICAgICAgICAgICAvLyAodW5pY29kZSA+PSA2NSAmJiB1bmljb2RlIDw9IDkwKSB8fCAvLyB1cHBlcmNhc2UgbGV0dGVyXG4gICAgICAgICAgICAgICAgKHVuaWNvZGUgPj0gOTcgJiYgdW5pY29kZSA8PSAxMjIpKSAvLyBsb3dlcmNhc2UgbGV0dGVyXG4gICAgICAgICkge1xuICAgICAgICAgICAgc2V0U2VhcmNoKCcnKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGlmICghKChfYiA9IGVudmlyb25tZW50LmNhblNlYXJjaCkgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogdHJ1ZSkgfHwgc2VhcmNoID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gcmVuZGVyZXJzLnJlbmRlclNlYXJjaElucHV0KHtcbiAgICAgICAgaW5wdXRQcm9wczogX19hc3NpZ24oeyB2YWx1ZTogc2VhcmNoLCBvbkNoYW5nZTogZnVuY3Rpb24gKGUpIHsgcmV0dXJuIHNldFNlYXJjaChlLnRhcmdldC52YWx1ZSk7IH0sIG9uQmx1cjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNsZWFyU2VhcmNoKCk7XG4gICAgICAgICAgICB9LCByZWY6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgICAgICAoX2EgPSBlbCA9PT0gbnVsbCB8fCBlbCA9PT0gdm9pZCAwID8gdm9pZCAwIDogZWwuZm9jdXMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5jYWxsKGVsKTtcbiAgICAgICAgICAgIH0sICdhcmlhLWxhYmVsJzogJ1NlYXJjaCBmb3IgaXRlbXMnIH0sIHtcbiAgICAgICAgICAgICdkYXRhLXJjdC1zZWFyY2gtaW5wdXQnOiAndHJ1ZScsXG4gICAgICAgIH0pLFxuICAgIH0pO1xufTtcbiIsImV4cG9ydCB2YXIgZGVmYXVsdExpdmVEZXNjcmlwdG9ycyA9IHtcbiAgICBpbnRyb2R1Y3Rpb246IFwiXFxuICAgIDxwPkFjY2Vzc2liaWxpdHkgZ3VpZGUgZm9yIHRyZWUge3RyZWVMYWJlbH0uPC9wPlxcbiAgICA8cD5cXG4gICAgICBOYXZpZ2F0ZSB0aGUgdHJlZSB3aXRoIHRoZSBhcnJvdyBrZXlzLiBDb21tb24gdHJlZSBob3RrZXlzIGFwcGx5LiBGdXJ0aGVyIGtleWJpbmRpbmdzIGFyZSBhdmFpbGFibGU6XFxuICAgIDwvcD5cXG4gICAgPHVsPlxcbiAgICAgIDxsaT57a2V5YmluZGluZzpwcmltYXJ5QWN0aW9ufSB0byBleGVjdXRlIHByaW1hcnkgYWN0aW9uIG9uIGZvY3VzZWQgaXRlbTwvbGk+XFxuICAgICAgPGxpPntrZXliaW5kaW5nOnJlbmFtZUl0ZW19IHRvIHN0YXJ0IHJlbmFtaW5nIHRoZSBmb2N1c2VkIGl0ZW08L2xpPlxcbiAgICAgIDxsaT57a2V5YmluZGluZzphYm9ydFJlbmFtZUl0ZW19IHRvIGFib3J0IHJlbmFtaW5nIGFuIGl0ZW08L2xpPlxcbiAgICAgIDxsaT57a2V5YmluZGluZzpzdGFydFByb2dyYW1tYXRpY0RuZH0gdG8gc3RhcnQgZHJhZ2dpbmcgc2VsZWN0ZWQgaXRlbXM8L2xpPlxcbiAgICA8L3VsPlxcbiAgXCIsXG4gICAgcmVuYW1pbmdJdGVtOiBcIlxcbiAgICA8cD5SZW5hbWluZyB0aGUgaXRlbSB7cmVuYW1pbmdJdGVtfS48L3A+XFxuICAgIDxwPlVzZSB0aGUga2V5YmluZGluZyB7a2V5YmluZGluZzphYm9ydFJlbmFtZUl0ZW19IHRvIGFib3J0IHJlbmFtaW5nLjwvcD5cXG4gIFwiLFxuICAgIHNlYXJjaGluZzogXCJcXG4gICAgPHA+U2VhcmNoaW5nPC9wPlxcbiAgXCIsXG4gICAgcHJvZ3JhbW1hdGljYWxseURyYWdnaW5nOiBcIlxcbiAgICA8cD5EcmFnZ2luZyBpdGVtcyB7ZHJhZ0l0ZW1zfS48L3A+XFxuICAgIDxwPlByZXNzIHRoZSBhcnJvdyBrZXlzIHRvIG1vdmUgdGhlIGRyYWcgdGFyZ2V0LjwvcD5cXG4gICAgPHA+UHJlc3Mge2tleWJpbmRpbmc6Y29tcGxldGVQcm9ncmFtbWF0aWNEbmR9IHRvIGRyb3Agb3Ige2tleWJpbmRpbmc6YWJvcnRQcm9ncmFtbWF0aWNEbmR9IHRvIGFib3J0LjwvcD5cXG4gIFwiLFxuICAgIHByb2dyYW1tYXRpY2FsbHlEcmFnZ2luZ1RhcmdldDogXCJcXG4gICAgPHA+RHJvcCB0YXJnZXQgaXMge2Ryb3BUYXJnZXR9LjwvcD5cXG4gIFwiLFxufTtcbiIsImV4cG9ydCB2YXIgcmVzb2x2ZUxpdmVEZXNjcmlwdG9yID0gZnVuY3Rpb24gKGRlc2NyaXB0b3IsIGVudmlyb25tZW50LCBkbmQsIHRyZWUsIGtleWJvYXJkQmluZGluZ3MpIHtcbiAgICB2YXIgZ2V0SXRlbVRpdGxlID0gZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgIHJldHVybiBlbnZpcm9ubWVudC5nZXRJdGVtVGl0bGUoZW52aXJvbm1lbnQuaXRlbXNbaW5kZXhdKTtcbiAgICB9O1xuICAgIHJldHVybiBkZXNjcmlwdG9yLnJlcGxhY2UoLyh7W15cXHN9XSspfS9nLCBmdW5jdGlvbiAodmFyaWFibGVOYW1lV2l0aEJyYWNrZXRzKSB7XG4gICAgICAgIHZhciBfYSwgX2IsIF9jO1xuICAgICAgICB2YXIgdmFyaWFibGVOYW1lID0gdmFyaWFibGVOYW1lV2l0aEJyYWNrZXRzLnNsaWNlKDEsIC0xKTtcbiAgICAgICAgc3dpdGNoICh2YXJpYWJsZU5hbWUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3RyZWVMYWJlbCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIChfYSA9IHRyZWUudHJlZUxhYmVsKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiAnJztcbiAgICAgICAgICAgIGNhc2UgJ3JlbmFtaW5nSXRlbSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRyZWUucmVuYW1pbmdJdGVtID8gZ2V0SXRlbVRpdGxlKHRyZWUucmVuYW1pbmdJdGVtKSA6ICdOb25lJztcbiAgICAgICAgICAgIGNhc2UgJ2RyYWdJdGVtcyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuICgoX2MgPSAoX2IgPSBkbmQuZHJhZ2dpbmdJdGVtcykgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLm1hcChmdW5jdGlvbiAoaXRlbSkgeyByZXR1cm4gZW52aXJvbm1lbnQuZ2V0SXRlbVRpdGxlKGl0ZW0pOyB9KS5qb2luKCcsICcpKSAhPT0gbnVsbCAmJiBfYyAhPT0gdm9pZCAwID8gX2MgOiAnTm9uZScpO1xuICAgICAgICAgICAgY2FzZSAnZHJvcFRhcmdldCc6IHtcbiAgICAgICAgICAgICAgICBpZiAoIWRuZC5kcmFnZ2luZ1Bvc2l0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnTm9uZSc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChkbmQuZHJhZ2dpbmdQb3NpdGlvbi50YXJnZXRUeXBlID09PSAnaXRlbScgfHxcbiAgICAgICAgICAgICAgICAgICAgZG5kLmRyYWdnaW5nUG9zaXRpb24udGFyZ2V0VHlwZSA9PT0gJ3Jvb3QnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcIndpdGhpbiBcIi5jb25jYXQoZ2V0SXRlbVRpdGxlKGRuZC5kcmFnZ2luZ1Bvc2l0aW9uLnRhcmdldEl0ZW0pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHBhcmVudEl0ZW0gPSBlbnZpcm9ubWVudC5pdGVtc1tkbmQuZHJhZ2dpbmdQb3NpdGlvbi5wYXJlbnRJdGVtXTtcbiAgICAgICAgICAgICAgICB2YXIgcGFyZW50VGl0bGUgPSBlbnZpcm9ubWVudC5nZXRJdGVtVGl0bGUocGFyZW50SXRlbSk7XG4gICAgICAgICAgICAgICAgaWYgKGRuZC5kcmFnZ2luZ1Bvc2l0aW9uLmNoaWxkSW5kZXggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwid2l0aGluIFwiLmNvbmNhdChwYXJlbnRUaXRsZSwgXCIgYXQgdGhlIHN0YXJ0XCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gXCJ3aXRoaW4gXCIuY29uY2F0KHBhcmVudFRpdGxlLCBcIiBhZnRlciBcIikuY29uY2F0KGdldEl0ZW1UaXRsZShwYXJlbnRJdGVtLmNoaWxkcmVuW2RuZC5kcmFnZ2luZ1Bvc2l0aW9uLmNoaWxkSW5kZXggLSAxXSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBpZiAodmFyaWFibGVOYW1lLnN0YXJ0c1dpdGgoJ2tleWJpbmRpbmc6JykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleWJvYXJkQmluZGluZ3NbdmFyaWFibGVOYW1lLnNsaWNlKDExKV1bMF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiVW5rbm93biBsaXZlIGRlc2NyaXB0b3IgdmFyaWFibGUge1wiLmNvbmNhdCh2YXJpYWJsZU5hbWUsIFwifVwiKSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG4iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VNZW1vIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlVHJlZUVudmlyb25tZW50IH0gZnJvbSAnLi4vY29udHJvbGxlZEVudmlyb25tZW50L0NvbnRyb2xsZWRUcmVlRW52aXJvbm1lbnQnO1xuaW1wb3J0IHsgZGVmYXVsdExpdmVEZXNjcmlwdG9ycyB9IGZyb20gJy4vZGVmYXVsdExpdmVEZXNjcmlwdG9ycyc7XG5pbXBvcnQgeyB1c2VUcmVlIH0gZnJvbSAnLi9UcmVlJztcbmltcG9ydCB7IHVzZURyYWdBbmREcm9wIH0gZnJvbSAnLi4vZHJhZy9EcmFnQW5kRHJvcFByb3ZpZGVyJztcbmltcG9ydCB7IHJlc29sdmVMaXZlRGVzY3JpcHRvciB9IGZyb20gJy4vcmVzb2x2ZUxpdmVEZXNjcmlwdG9yJztcbmltcG9ydCB7IHVzZUtleWJvYXJkQmluZGluZ3MgfSBmcm9tICcuLi9ob3RrZXlzL3VzZUtleWJvYXJkQmluZGluZ3MnO1xudmFyIExpdmVXcmFwcGVyID0gZnVuY3Rpb24gKF9hKSB7XG4gICAgdmFyIGNoaWxkcmVuID0gX2EuY2hpbGRyZW4sIGxpdmUgPSBfYS5saXZlO1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgXCJhcmlhLWxpdmVcIjogbGl2ZSwgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw6IHsgX19odG1sOiBjaGlsZHJlbiB9IH0pO1xufTtcbmV4cG9ydCB2YXIgTGl2ZURlc2NyaXB0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBlbnYgPSB1c2VUcmVlRW52aXJvbm1lbnQoKTtcbiAgICB2YXIgdHJlZSA9IHVzZVRyZWUoKTtcbiAgICB2YXIgZG5kID0gdXNlRHJhZ0FuZERyb3AoKTtcbiAgICB2YXIga2V5cyA9IHVzZUtleWJvYXJkQmluZGluZ3MoKTtcbiAgICB2YXIgZGVzY3JpcHRvcnMgPSB1c2VNZW1vKGZ1bmN0aW9uICgpIHsgdmFyIF9hOyByZXR1cm4gKF9hID0gZW52LmxpdmVEZXNjcmlwdG9ycykgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogZGVmYXVsdExpdmVEZXNjcmlwdG9yczsgfSwgW2Vudi5saXZlRGVzY3JpcHRvcnNdKTtcbiAgICB2YXIgTWFpbldyYXBwZXIgPSB0cmVlLnJlbmRlcmVycy5yZW5kZXJMaXZlRGVzY3JpcHRvckNvbnRhaW5lcjtcbiAgICBpZiAodHJlZS50cmVlSW5mb3JtYXRpb24uaXNSZW5hbWluZykge1xuICAgICAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoTWFpbldyYXBwZXIsIHsgdHJlZTogdHJlZSB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChMaXZlV3JhcHBlciwgeyBsaXZlOiBcInBvbGl0ZVwiIH0sIHJlc29sdmVMaXZlRGVzY3JpcHRvcihkZXNjcmlwdG9ycy5yZW5hbWluZ0l0ZW0sIGVudiwgZG5kLCB0cmVlLCBrZXlzKSkpKTtcbiAgICB9XG4gICAgaWYgKHRyZWUudHJlZUluZm9ybWF0aW9uLmlzU2VhcmNoaW5nKSB7XG4gICAgICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChNYWluV3JhcHBlciwgeyB0cmVlOiB0cmVlIH0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KExpdmVXcmFwcGVyLCB7IGxpdmU6IFwicG9saXRlXCIgfSwgcmVzb2x2ZUxpdmVEZXNjcmlwdG9yKGRlc2NyaXB0b3JzLnNlYXJjaGluZywgZW52LCBkbmQsIHRyZWUsIGtleXMpKSkpO1xuICAgIH1cbiAgICBpZiAodHJlZS50cmVlSW5mb3JtYXRpb24uaXNQcm9ncmFtbWF0aWNhbGx5RHJhZ2dpbmcpIHtcbiAgICAgICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KE1haW5XcmFwcGVyLCB7IHRyZWU6IHRyZWUgfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTGl2ZVdyYXBwZXIsIHsgbGl2ZTogXCJwb2xpdGVcIiB9LCByZXNvbHZlTGl2ZURlc2NyaXB0b3IoZGVzY3JpcHRvcnMucHJvZ3JhbW1hdGljYWxseURyYWdnaW5nLCBlbnYsIGRuZCwgdHJlZSwga2V5cykpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChMaXZlV3JhcHBlciwgeyBsaXZlOiBcImFzc2VydGl2ZVwiIH0sIHJlc29sdmVMaXZlRGVzY3JpcHRvcihkZXNjcmlwdG9ycy5wcm9ncmFtbWF0aWNhbGx5RHJhZ2dpbmdUYXJnZXQsIGVudiwgZG5kLCB0cmVlLCBrZXlzKSkpKTtcbiAgICB9XG4gICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KE1haW5XcmFwcGVyLCB7IHRyZWU6IHRyZWUgfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChMaXZlV3JhcHBlciwgeyBsaXZlOiBcIm9mZlwiIH0sIHJlc29sdmVMaXZlRGVzY3JpcHRvcihkZXNjcmlwdG9ycy5pbnRyb2R1Y3Rpb24sIGVudiwgZG5kLCB0cmVlLCBrZXlzKSkpKTtcbn07XG4iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VUcmVlRW52aXJvbm1lbnQgfSBmcm9tICcuLi9jb250cm9sbGVkRW52aXJvbm1lbnQvQ29udHJvbGxlZFRyZWVFbnZpcm9ubWVudCc7XG5pbXBvcnQgeyBMaXZlRGVzY3JpcHRpb24gfSBmcm9tICcuL0xpdmVEZXNjcmlwdGlvbic7XG5leHBvcnQgdmFyIE1heWJlTGl2ZURlc2NyaXB0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBfYTtcbiAgICB2YXIgZW52ID0gdXNlVHJlZUVudmlyb25tZW50KCk7XG4gICAgaWYgKCEoKF9hID0gZW52LnNob3dMaXZlRGVzY3JpcHRpb24pICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IHRydWUpKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChMaXZlRGVzY3JpcHRpb24sIG51bGwpO1xufTtcbiIsInZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IGZ1bmN0aW9uICgpIHtcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXG4gICAgICAgICAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VSZWYgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBUcmVlSXRlbUNoaWxkcmVuIH0gZnJvbSAnLi4vdHJlZUl0ZW0vVHJlZUl0ZW1DaGlsZHJlbic7XG5pbXBvcnQgeyBEcmFnQmV0d2VlbkxpbmUgfSBmcm9tICcuL0RyYWdCZXR3ZWVuTGluZSc7XG5pbXBvcnQgeyB1c2VGb2N1c1dpdGhpbiB9IGZyb20gJy4vdXNlRm9jdXNXaXRoaW4nO1xuaW1wb3J0IHsgdXNlVHJlZUtleWJvYXJkQmluZGluZ3MgfSBmcm9tICcuL3VzZVRyZWVLZXlib2FyZEJpbmRpbmdzJztcbmltcG9ydCB7IFNlYXJjaElucHV0IH0gZnJvbSAnLi4vc2VhcmNoL1NlYXJjaElucHV0JztcbmltcG9ydCB7IHVzZVRyZWUgfSBmcm9tICcuL1RyZWUnO1xuaW1wb3J0IHsgdXNlVHJlZUVudmlyb25tZW50IH0gZnJvbSAnLi4vY29udHJvbGxlZEVudmlyb25tZW50L0NvbnRyb2xsZWRUcmVlRW52aXJvbm1lbnQnO1xuaW1wb3J0IHsgdXNlRHJhZ0FuZERyb3AgfSBmcm9tICcuLi9kcmFnL0RyYWdBbmREcm9wUHJvdmlkZXInO1xuaW1wb3J0IHsgTWF5YmVMaXZlRGVzY3JpcHRpb24gfSBmcm9tICcuL01heWJlTGl2ZURlc2NyaXB0aW9uJztcbmV4cG9ydCB2YXIgVHJlZU1hbmFnZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF9hID0gdXNlVHJlZSgpLCB0cmVlSWQgPSBfYS50cmVlSWQsIHJvb3RJdGVtID0gX2Eucm9vdEl0ZW0sIHJlbmRlcmVycyA9IF9hLnJlbmRlcmVycywgdHJlZUluZm9ybWF0aW9uID0gX2EudHJlZUluZm9ybWF0aW9uO1xuICAgIHZhciBlbnZpcm9ubWVudCA9IHVzZVRyZWVFbnZpcm9ubWVudCgpO1xuICAgIHZhciBjb250YWluZXJSZWYgPSB1c2VSZWYoKTtcbiAgICB2YXIgZG5kID0gdXNlRHJhZ0FuZERyb3AoKTtcbiAgICB1c2VUcmVlS2V5Ym9hcmRCaW5kaW5ncygpO1xuICAgIHVzZUZvY3VzV2l0aGluKGNvbnRhaW5lclJlZi5jdXJyZW50LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGVudmlyb25tZW50LnNldEFjdGl2ZVRyZWUodHJlZUlkKTtcbiAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGVudmlyb25tZW50LnNldEFjdGl2ZVRyZWUoZnVuY3Rpb24gKG9sZFRyZWVJZCkge1xuICAgICAgICAgICAgcmV0dXJuIG9sZFRyZWVJZCA9PT0gdHJlZUlkID8gdW5kZWZpbmVkIDogb2xkVHJlZUlkO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICB2YXIgcm9vdENoaWxkcmVuID0gZW52aXJvbm1lbnQuaXRlbXNbcm9vdEl0ZW1dLmNoaWxkcmVuO1xuICAgIHZhciB0cmVlQ2hpbGRyZW4gPSAoUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5GcmFnbWVudCwgbnVsbCxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNYXliZUxpdmVEZXNjcmlwdGlvbiwgbnVsbCksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVHJlZUl0ZW1DaGlsZHJlbiwgeyBkZXB0aDogMCwgcGFyZW50SWQ6IHJvb3RJdGVtIH0sIHJvb3RDaGlsZHJlbiAhPT0gbnVsbCAmJiByb290Q2hpbGRyZW4gIT09IHZvaWQgMCA/IHJvb3RDaGlsZHJlbiA6IFtdKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChEcmFnQmV0d2VlbkxpbmUsIHsgdHJlZUlkOiB0cmVlSWQgfSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoU2VhcmNoSW5wdXQsIHsgY29udGFpbmVyUmVmOiBjb250YWluZXJSZWYuY3VycmVudCB9KSkpO1xuICAgIHZhciBjb250YWluZXJQcm9wcyA9IF9fYXNzaWduKHsgb25EcmFnT3ZlcjogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTsgLy8gQWxsb3cgZHJvcC4gQWxzbyBpbXBsaWNpdGx5IHNldCBieSBpdGVtcywgYnV0IG5lZWRlZCBoZXJlIGFzIHdlbGwgZm9yIGRyb3BwaW5nIG9uIGVtcHR5IHNwYWNlXG4gICAgICAgICAgICBkbmQub25EcmFnT3ZlclRyZWVIYW5kbGVyKGUsIHRyZWVJZCwgY29udGFpbmVyUmVmKTtcbiAgICAgICAgfSwgb25EcmFnTGVhdmU6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBkbmQub25EcmFnTGVhdmVDb250YWluZXJIYW5kbGVyKGUsIGNvbnRhaW5lclJlZik7XG4gICAgICAgIH0sIG9uTW91c2VEb3duOiBmdW5jdGlvbiAoKSB7IHJldHVybiBkbmQuYWJvcnRQcm9ncmFtbWF0aWNEcmFnKCk7IH0sIHJlZjogY29udGFpbmVyUmVmLCBzdHlsZTogeyBwb3NpdGlvbjogJ3JlbGF0aXZlJyB9LCByb2xlOiAndHJlZScsICdhcmlhLWxhYmVsJzogIXRyZWVJbmZvcm1hdGlvbi50cmVlTGFiZWxsZWRCeVxuICAgICAgICAgICAgPyB0cmVlSW5mb3JtYXRpb24udHJlZUxhYmVsXG4gICAgICAgICAgICA6IHVuZGVmaW5lZCwgJ2FyaWEtbGFiZWxsZWRieSc6IHRyZWVJbmZvcm1hdGlvbi50cmVlTGFiZWxsZWRCeSB9LCB7XG4gICAgICAgICdkYXRhLXJjdC10cmVlJzogdHJlZUlkLFxuICAgIH0pO1xuICAgIHJldHVybiByZW5kZXJlcnMucmVuZGVyVHJlZUNvbnRhaW5lcih7XG4gICAgICAgIGNoaWxkcmVuOiB0cmVlQ2hpbGRyZW4sXG4gICAgICAgIGluZm86IHRyZWVJbmZvcm1hdGlvbixcbiAgICAgICAgY29udGFpbmVyUHJvcHM6IGNvbnRhaW5lclByb3BzLFxuICAgIH0pO1xufTtcbiIsImltcG9ydCB7IHVzZU1lbW8gfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VUcmVlRW52aXJvbm1lbnQgfSBmcm9tICcuLi9jb250cm9sbGVkRW52aXJvbm1lbnQvQ29udHJvbGxlZFRyZWVFbnZpcm9ubWVudCc7XG5pbXBvcnQgeyB1c2VEcmFnQW5kRHJvcCB9IGZyb20gJy4uL2RyYWcvRHJhZ0FuZERyb3BQcm92aWRlcic7XG5leHBvcnQgdmFyIHVzZUNyZWF0ZWRUcmVlSW5mb3JtYXRpb24gPSBmdW5jdGlvbiAodHJlZSwgcmVuYW1pbmdJdGVtLCBzZWFyY2gpIHtcbiAgICB2YXIgX2E7XG4gICAgdmFyIGVudmlyb25tZW50ID0gdXNlVHJlZUVudmlyb25tZW50KCk7XG4gICAgdmFyIGRuZCA9IHVzZURyYWdBbmREcm9wKCk7XG4gICAgdmFyIHNlbGVjdGVkSXRlbXMgPSAoX2EgPSBlbnZpcm9ubWVudC52aWV3U3RhdGVbdHJlZS50cmVlSWRdKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Euc2VsZWN0ZWRJdGVtcztcbiAgICByZXR1cm4gdXNlTWVtbyhmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgIHJldHVybiAoe1xuICAgICAgICAgICAgaXNGb2N1c2VkOiBlbnZpcm9ubWVudC5hY3RpdmVUcmVlSWQgPT09IHRyZWUudHJlZUlkLFxuICAgICAgICAgICAgaXNSZW5hbWluZzogISFyZW5hbWluZ0l0ZW0sXG4gICAgICAgICAgICBhcmVJdGVtc1NlbGVjdGVkOiAoKF9hID0gc2VsZWN0ZWRJdGVtcyA9PT0gbnVsbCB8fCBzZWxlY3RlZEl0ZW1zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBzZWxlY3RlZEl0ZW1zLmxlbmd0aCkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogMCkgPiAwLFxuICAgICAgICAgICAgaXNTZWFyY2hpbmc6IHNlYXJjaCAhPT0gbnVsbCxcbiAgICAgICAgICAgIHNlYXJjaDogc2VhcmNoLFxuICAgICAgICAgICAgaXNQcm9ncmFtbWF0aWNhbGx5RHJhZ2dpbmc6IChfYiA9IGRuZC5pc1Byb2dyYW1tYXRpY2FsbHlEcmFnZ2luZykgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogZmFsc2UsXG4gICAgICAgICAgICB0cmVlSWQ6IHRyZWUudHJlZUlkLFxuICAgICAgICAgICAgcm9vdEl0ZW06IHRyZWUucm9vdEl0ZW0sXG4gICAgICAgICAgICB0cmVlTGFiZWw6IHRyZWUudHJlZUxhYmVsLFxuICAgICAgICAgICAgdHJlZUxhYmVsbGVkQnk6IHRyZWUudHJlZUxhYmVsbGVkQnksXG4gICAgICAgIH0pO1xuICAgIH0sIFtcbiAgICAgICAgZW52aXJvbm1lbnQuYWN0aXZlVHJlZUlkLFxuICAgICAgICB0cmVlLnRyZWVJZCxcbiAgICAgICAgdHJlZS5yb290SXRlbSxcbiAgICAgICAgdHJlZS50cmVlTGFiZWwsXG4gICAgICAgIHRyZWUudHJlZUxhYmVsbGVkQnksXG4gICAgICAgIHJlbmFtaW5nSXRlbSxcbiAgICAgICAgc2VsZWN0ZWRJdGVtcyA9PT0gbnVsbCB8fCBzZWxlY3RlZEl0ZW1zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBzZWxlY3RlZEl0ZW1zLmxlbmd0aCxcbiAgICAgICAgc2VhcmNoLFxuICAgICAgICBkbmQuaXNQcm9ncmFtbWF0aWNhbGx5RHJhZ2dpbmcsXG4gICAgXSk7XG59O1xuIiwidmFyIF9fYXNzaWduID0gKHRoaXMgJiYgdGhpcy5fX2Fzc2lnbikgfHwgZnVuY3Rpb24gKCkge1xuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0KSB7XG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSlcbiAgICAgICAgICAgICAgICB0W3BdID0gc1twXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdDtcbiAgICB9O1xuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcbmltcG9ydCB7IHVzZUltcGVyYXRpdmVIYW5kbGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VUcmVlRW52aXJvbm1lbnQgfSBmcm9tICcuLi9jb250cm9sbGVkRW52aXJvbm1lbnQvQ29udHJvbGxlZFRyZWVFbnZpcm9ubWVudCc7XG5pbXBvcnQgeyB1c2VEcmFnQW5kRHJvcCB9IGZyb20gJy4uL2RyYWcvRHJhZ0FuZERyb3BQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VUcmVlIH0gZnJvbSAnLi4vdHJlZS9UcmVlJztcbmV4cG9ydCB2YXIgdXNlQ3JlYXRlZFRyZWVSZWYgPSBmdW5jdGlvbiAocmVmLCBhY3Rpb25zKSB7XG4gICAgdmFyIGVudmlyb25tZW50ID0gdXNlVHJlZUVudmlyb25tZW50KCk7XG4gICAgdmFyIHRyZWUgPSB1c2VUcmVlKCk7XG4gICAgdmFyIGRuZCA9IHVzZURyYWdBbmREcm9wKCk7XG4gICAgdXNlSW1wZXJhdGl2ZUhhbmRsZShyZWYsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIChfX2Fzc2lnbihfX2Fzc2lnbihfX2Fzc2lnbih7fSwgYWN0aW9ucyksIHsgdHJlZUVudmlyb25tZW50Q29udGV4dDogZW52aXJvbm1lbnQsIGRyYWdBbmREcm9wQ29udGV4dDogZG5kLCB0cmVlQ29udGV4dDogdHJlZSB9KSwgdHJlZS50cmVlSW5mb3JtYXRpb24pKTsgfSk7XG59O1xuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZURyYWdBbmREcm9wIH0gZnJvbSAnLi4vZHJhZy9EcmFnQW5kRHJvcFByb3ZpZGVyJztcbmltcG9ydCB7IHVzZVRyZWVFbnZpcm9ubWVudCB9IGZyb20gJy4uL2NvbnRyb2xsZWRFbnZpcm9ubWVudC9Db250cm9sbGVkVHJlZUVudmlyb25tZW50JztcbmltcG9ydCB7IHVzZUNyZWF0ZWRUcmVlUmVmIH0gZnJvbSAnLi91c2VDcmVhdGVkVHJlZVJlZic7XG5pbXBvcnQgeyB1c2VUcmVlIH0gZnJvbSAnLi4vdHJlZS9UcmVlJztcbmltcG9ydCB7IHVzZUVudmlyb25tZW50QWN0aW9ucyB9IGZyb20gJy4uL2Vudmlyb25tZW50QWN0aW9ucy9FbnZpcm9ubWVudEFjdGlvbnNQcm92aWRlcic7XG52YXIgRW52aXJvbm1lbnRBY3Rpb25zQ29udGV4dCA9IFJlYWN0LmNyZWF0ZUNvbnRleHQobnVsbCk7XG5leHBvcnQgdmFyIHVzZVRyZWVBY3Rpb25zID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gUmVhY3QudXNlQ29udGV4dChFbnZpcm9ubWVudEFjdGlvbnNDb250ZXh0KTsgfTtcbmV4cG9ydCB2YXIgVHJlZUFjdGlvbnNQcm92aWRlciA9IFJlYWN0LmZvcndhcmRSZWYoZnVuY3Rpb24gKHByb3BzLCByZWYpIHtcbiAgICB1c2VUcmVlRW52aXJvbm1lbnQoKTtcbiAgICB2YXIgdHJlZSA9IHVzZVRyZWUoKTtcbiAgICB1c2VEcmFnQW5kRHJvcCgpO1xuICAgIHZhciBlbnZBY3Rpb25zID0gdXNlRW52aXJvbm1lbnRBY3Rpb25zKCk7XG4gICAgLy8gVE9ETyBjaGFuZ2UgdHJlZSBjaGlsZHMgdG8gdXNlIGFjdGlvbnMgcmF0aGVyIHRoYW4gb3V0cHV0IGV2ZW50cyB3aGVyZSBwb3NzaWJsZVxuICAgIC8vIFRPRE8gbWF5YmUgcmVwbGFjZSB3aXRoIHN0YWJsZSBoYW5kbGVyc1xuICAgIHZhciBhY3Rpb25zID0gdXNlTWVtbyhmdW5jdGlvbiAoKSB7IHJldHVybiAoe1xuICAgICAgICBhYm9ydFJlbmFtaW5nSXRlbTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdHJlZS5zZXRSZW5hbWluZ0l0ZW0obnVsbCk7XG4gICAgICAgIH0sXG4gICAgICAgIGFib3J0U2VhcmNoOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0cmVlLnNldFNlYXJjaChudWxsKTtcbiAgICAgICAgfSxcbiAgICAgICAgY29sbGFwc2VJdGVtOiBmdW5jdGlvbiAoaXRlbUlkKSB7XG4gICAgICAgICAgICBlbnZBY3Rpb25zLmNvbGxhcHNlSXRlbShpdGVtSWQsIHRyZWUudHJlZUlkKTtcbiAgICAgICAgfSxcbiAgICAgICAgY29tcGxldGVSZW5hbWluZ0l0ZW06IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIFRPRE9cbiAgICAgICAgfSxcbiAgICAgICAgZXhwYW5kSXRlbTogZnVuY3Rpb24gKGl0ZW1JZCkge1xuICAgICAgICAgICAgZW52QWN0aW9ucy5leHBhbmRJdGVtKGl0ZW1JZCwgdHJlZS50cmVlSWQpO1xuICAgICAgICB9LFxuICAgICAgICBmb2N1c0l0ZW06IGZ1bmN0aW9uIChpdGVtSWQsIHNldERvbUZvY3VzKSB7XG4gICAgICAgICAgICBpZiAoc2V0RG9tRm9jdXMgPT09IHZvaWQgMCkgeyBzZXREb21Gb2N1cyA9IHRydWU7IH1cbiAgICAgICAgICAgIGVudkFjdGlvbnMuZm9jdXNJdGVtKGl0ZW1JZCwgdHJlZS50cmVlSWQsIHNldERvbUZvY3VzKTtcbiAgICAgICAgfSxcbiAgICAgICAgZm9jdXNUcmVlOiBmdW5jdGlvbiAoYXV0b0ZvY3VzKSB7XG4gICAgICAgICAgICBpZiAoYXV0b0ZvY3VzID09PSB2b2lkIDApIHsgYXV0b0ZvY3VzID0gdHJ1ZTsgfVxuICAgICAgICAgICAgZW52QWN0aW9ucy5mb2N1c1RyZWUodHJlZS50cmVlSWQsIGF1dG9Gb2N1cyk7XG4gICAgICAgIH0sXG4gICAgICAgIGludm9rZVByaW1hcnlBY3Rpb246IGZ1bmN0aW9uIChpdGVtSWQpIHtcbiAgICAgICAgICAgIGVudkFjdGlvbnMuaW52b2tlUHJpbWFyeUFjdGlvbihpdGVtSWQsIHRyZWUudHJlZUlkKTtcbiAgICAgICAgfSxcbiAgICAgICAgbW92ZUZvY3VzRG93bjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZW52QWN0aW9ucy5tb3ZlRm9jdXNEb3duKHRyZWUudHJlZUlkKTtcbiAgICAgICAgfSxcbiAgICAgICAgbW92ZUZvY3VzVXA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGVudkFjdGlvbnMubW92ZUZvY3VzVXAodHJlZS50cmVlSWQpO1xuICAgICAgICB9LFxuICAgICAgICByZW5hbWVJdGVtOiBmdW5jdGlvbiAoaXRlbUlkLCBuYW1lKSB7XG4gICAgICAgICAgICBlbnZBY3Rpb25zLnJlbmFtZUl0ZW0oaXRlbUlkLCBuYW1lLCB0cmVlLnRyZWVJZCk7XG4gICAgICAgIH0sXG4gICAgICAgIHNlbGVjdEl0ZW1zOiBmdW5jdGlvbiAoaXRlbXNJZHMpIHtcbiAgICAgICAgICAgIGVudkFjdGlvbnMuc2VsZWN0SXRlbXMoaXRlbXNJZHMsIHRyZWUudHJlZUlkKTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0U2VhcmNoOiBmdW5jdGlvbiAoc2VhcmNoKSB7XG4gICAgICAgICAgICB0cmVlLnNldFNlYXJjaChzZWFyY2gpO1xuICAgICAgICB9LFxuICAgICAgICBzdGFydFJlbmFtaW5nSXRlbTogZnVuY3Rpb24gKGl0ZW1JZCkge1xuICAgICAgICAgICAgdHJlZS5zZXRSZW5hbWluZ0l0ZW0oaXRlbUlkKTtcbiAgICAgICAgfSxcbiAgICAgICAgc3RvcFJlbmFtaW5nSXRlbTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdHJlZS5zZXRSZW5hbWluZ0l0ZW0obnVsbCk7XG4gICAgICAgIH0sXG4gICAgICAgIHRvZ2dsZUl0ZW1FeHBhbmRlZFN0YXRlOiBmdW5jdGlvbiAoaXRlbUlkKSB7XG4gICAgICAgICAgICBlbnZBY3Rpb25zLnRvZ2dsZUl0ZW1FeHBhbmRlZFN0YXRlKGl0ZW1JZCwgdHJlZS50cmVlSWQpO1xuICAgICAgICB9LFxuICAgICAgICB0b2dnbGVJdGVtU2VsZWN0U3RhdHVzOiBmdW5jdGlvbiAoaXRlbUlkKSB7XG4gICAgICAgICAgICBlbnZBY3Rpb25zLnRvZ2dsZUl0ZW1TZWxlY3RTdGF0dXMoaXRlbUlkLCB0cmVlLnRyZWVJZCk7XG4gICAgICAgIH0sXG4gICAgICAgIGV4cGFuZEFsbDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZW52QWN0aW9ucy5leHBhbmRBbGwodHJlZS50cmVlSWQpO1xuICAgICAgICB9LFxuICAgICAgICBjb2xsYXBzZUFsbDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZW52QWN0aW9ucy5jb2xsYXBzZUFsbCh0cmVlLnRyZWVJZCk7XG4gICAgICAgIH0sXG4gICAgICAgIGV4cGFuZFN1YnNlcXVlbnRseTogZnVuY3Rpb24gKGl0ZW1JZHMpIHtcbiAgICAgICAgICAgIHJldHVybiBlbnZBY3Rpb25zLmV4cGFuZFN1YnNlcXVlbnRseSh0cmVlLnRyZWVJZCwgaXRlbUlkcyk7XG4gICAgICAgIH0sXG4gICAgfSk7IH0sIFtlbnZBY3Rpb25zLCB0cmVlXSk7XG4gICAgdXNlQ3JlYXRlZFRyZWVSZWYocmVmLCBhY3Rpb25zKTtcbiAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoRW52aXJvbm1lbnRBY3Rpb25zQ29udGV4dC5Qcm92aWRlciwgeyB2YWx1ZTogYWN0aW9ucyB9LCBwcm9wcy5jaGlsZHJlbikpO1xufSk7XG4iLCJ2YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxuICAgICAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0O1xuICAgIH07XG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlQ29udGV4dCwgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZVRyZWVFbnZpcm9ubWVudCB9IGZyb20gJy4uL2NvbnRyb2xsZWRFbnZpcm9ubWVudC9Db250cm9sbGVkVHJlZUVudmlyb25tZW50JztcbmltcG9ydCB7IFRyZWVNYW5hZ2VyIH0gZnJvbSAnLi9UcmVlTWFuYWdlcic7XG5pbXBvcnQgeyB1c2VDcmVhdGVkVHJlZUluZm9ybWF0aW9uIH0gZnJvbSAnLi91c2VDcmVhdGVkVHJlZUluZm9ybWF0aW9uJztcbmltcG9ydCB7IGdldEl0ZW1zTGluZWFybHkgfSBmcm9tICcuL2dldEl0ZW1zTGluZWFybHknO1xuaW1wb3J0IHsgVHJlZUFjdGlvbnNQcm92aWRlciB9IGZyb20gJy4uL3RyZWVBY3Rpb25zL1RyZWVBY3Rpb25zUHJvdmlkZXInO1xudmFyIFRyZWVDb250ZXh0ID0gUmVhY3QuY3JlYXRlQ29udGV4dChudWxsKTsgLy8gVE9ETyBkZWZhdWx0IHZhbHVlXG5leHBvcnQgdmFyIHVzZVRyZWUgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB1c2VDb250ZXh0KFRyZWVDb250ZXh0KTsgfTtcbmV4cG9ydCB2YXIgVHJlZSA9IFJlYWN0LmZvcndhcmRSZWYoZnVuY3Rpb24gKHByb3BzLCByZWYpIHtcbiAgICB2YXIgX2E7XG4gICAgdmFyIGVudmlyb25tZW50ID0gdXNlVHJlZUVudmlyb25tZW50KCk7XG4gICAgdmFyIHJlbmRlcmVycyA9IHVzZU1lbW8oZnVuY3Rpb24gKCkgeyByZXR1cm4gKF9fYXNzaWduKF9fYXNzaWduKHt9LCBlbnZpcm9ubWVudCksIHByb3BzKSk7IH0sIFtwcm9wcywgZW52aXJvbm1lbnRdKTtcbiAgICB2YXIgX2IgPSB1c2VTdGF0ZShudWxsKSwgc2VhcmNoID0gX2JbMF0sIHNldFNlYXJjaCA9IF9iWzFdO1xuICAgIHZhciBfYyA9IHVzZVN0YXRlKG51bGwpLCByZW5hbWluZ0l0ZW0gPSBfY1swXSwgc2V0UmVuYW1pbmdJdGVtID0gX2NbMV07XG4gICAgdmFyIHJvb3RJdGVtID0gZW52aXJvbm1lbnQuaXRlbXNbcHJvcHMucm9vdEl0ZW1dO1xuICAgIHZhciB2aWV3U3RhdGUgPSBlbnZpcm9ubWVudC52aWV3U3RhdGVbcHJvcHMudHJlZUlkXTtcbiAgICB1c2VFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgICAgICBlbnZpcm9ubWVudC5yZWdpc3RlclRyZWUoe1xuICAgICAgICAgICAgdHJlZUlkOiBwcm9wcy50cmVlSWQsXG4gICAgICAgICAgICByb290SXRlbTogcHJvcHMucm9vdEl0ZW0sXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkgeyByZXR1cm4gZW52aXJvbm1lbnQudW5yZWdpc3RlclRyZWUocHJvcHMudHJlZUlkKTsgfTtcbiAgICAgICAgLy8gVE9ETyBzaG91bGQgYmUgYWJsZSB0byByZW1vdmUgc29vbiwgYW5kIGFkZCBlbnZpcm9ubWVudC5yZWdpc3RlclRyZWUsIGVudmlyb25tZW50LnVucmVnaXN0ZXJUcmVlIGFzIGRlcHNcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0LWhvb2tzL2V4aGF1c3RpdmUtZGVwc1xuICAgIH0sIFtwcm9wcy50cmVlSWQsIHByb3BzLnJvb3RJdGVtXSk7XG4gICAgdmFyIHRyZWVJbmZvcm1hdGlvbiA9IHVzZUNyZWF0ZWRUcmVlSW5mb3JtYXRpb24ocHJvcHMsIHJlbmFtaW5nSXRlbSwgc2VhcmNoKTtcbiAgICB2YXIgdHJlZUNvbnRleHRQcm9wcyA9IHVzZU1lbW8oZnVuY3Rpb24gKCkgeyByZXR1cm4gKHtcbiAgICAgICAgdHJlZUlkOiBwcm9wcy50cmVlSWQsXG4gICAgICAgIHJvb3RJdGVtOiBwcm9wcy5yb290SXRlbSxcbiAgICAgICAgdHJlZUxhYmVsOiBwcm9wcy50cmVlTGFiZWwsXG4gICAgICAgIHRyZWVMYWJlbGxlZEJ5OiBwcm9wcy50cmVlTGFiZWxsZWRCeSxcbiAgICAgICAgZ2V0SXRlbXNMaW5lYXJseTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGdldEl0ZW1zTGluZWFybHkocHJvcHMucm9vdEl0ZW0sIHZpZXdTdGF0ZSAhPT0gbnVsbCAmJiB2aWV3U3RhdGUgIT09IHZvaWQgMCA/IHZpZXdTdGF0ZSA6IHt9LCBlbnZpcm9ubWVudC5pdGVtcyk7XG4gICAgICAgIH0sXG4gICAgICAgIHRyZWVJbmZvcm1hdGlvbjogdHJlZUluZm9ybWF0aW9uLFxuICAgICAgICBzZWFyY2g6IHNlYXJjaCxcbiAgICAgICAgc2V0U2VhcmNoOiBzZXRTZWFyY2gsXG4gICAgICAgIHJlbmFtaW5nSXRlbTogcmVuYW1pbmdJdGVtLFxuICAgICAgICBzZXRSZW5hbWluZ0l0ZW06IHNldFJlbmFtaW5nSXRlbSxcbiAgICAgICAgcmVuZGVyZXJzOiByZW5kZXJlcnMsXG4gICAgfSk7IH0sIFtcbiAgICAgICAgZW52aXJvbm1lbnQuaXRlbXMsXG4gICAgICAgIHByb3BzLnJvb3RJdGVtLFxuICAgICAgICBwcm9wcy50cmVlSWQsXG4gICAgICAgIHByb3BzLnRyZWVMYWJlbCxcbiAgICAgICAgcHJvcHMudHJlZUxhYmVsbGVkQnksXG4gICAgICAgIHJlbmFtaW5nSXRlbSxcbiAgICAgICAgcmVuZGVyZXJzLFxuICAgICAgICBzZWFyY2gsXG4gICAgICAgIHRyZWVJbmZvcm1hdGlvbixcbiAgICAgICAgdmlld1N0YXRlLFxuICAgIF0pO1xuICAgIGlmIChyb290SXRlbSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIChfYSA9IGVudmlyb25tZW50Lm9uTWlzc2luZ0l0ZW1zKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuY2FsbChlbnZpcm9ubWVudCwgW3Byb3BzLnJvb3RJdGVtXSk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoVHJlZUNvbnRleHQuUHJvdmlkZXIsIHsgdmFsdWU6IHRyZWVDb250ZXh0UHJvcHMgfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUcmVlQWN0aW9uc1Byb3ZpZGVyLCB7IHJlZjogcmVmIH0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRyZWVNYW5hZ2VyLCBudWxsKSkpKTtcbn0pO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IFRyZWVJdGVtRWxlbWVudCB9IGZyb20gJy4vVHJlZUl0ZW1FbGVtZW50JztcbmltcG9ydCB7IHVzZVRyZWUgfSBmcm9tICcuLi90cmVlL1RyZWUnO1xuZXhwb3J0IHZhciBUcmVlSXRlbUNoaWxkcmVuID0gZnVuY3Rpb24gKHByb3BzKSB7XG4gICAgdmFyIF9hID0gdXNlVHJlZSgpLCByZW5kZXJlcnMgPSBfYS5yZW5kZXJlcnMsIHRyZWVJbmZvcm1hdGlvbiA9IF9hLnRyZWVJbmZvcm1hdGlvbjtcbiAgICB2YXIgY2hpbGRFbGVtZW50cyA9IFtdO1xuICAgIGZvciAodmFyIF9pID0gMCwgX2IgPSBwcm9wcy5jaGlsZHJlbjsgX2kgPCBfYi5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgdmFyIGNoaWxkID0gX2JbX2ldO1xuICAgICAgICBjaGlsZEVsZW1lbnRzLnB1c2goUmVhY3QuY3JlYXRlRWxlbWVudChUcmVlSXRlbUVsZW1lbnQsIHsga2V5OiBjaGlsZCwgaXRlbUluZGV4OiBjaGlsZCwgZGVwdGg6IHByb3BzLmRlcHRoIH0pKTtcbiAgICB9XG4gICAgaWYgKGNoaWxkRWxlbWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICB2YXIgY29udGFpbmVyUHJvcHMgPSB7XG4gICAgICAgIHJvbGU6IHByb3BzLmRlcHRoICE9PSAwID8gJ2dyb3VwJyA6IHVuZGVmaW5lZCxcbiAgICB9O1xuICAgIHJldHVybiByZW5kZXJlcnMucmVuZGVySXRlbXNDb250YWluZXIoe1xuICAgICAgICBjaGlsZHJlbjogY2hpbGRFbGVtZW50cyxcbiAgICAgICAgaW5mbzogdHJlZUluZm9ybWF0aW9uLFxuICAgICAgICBjb250YWluZXJQcm9wczogY29udGFpbmVyUHJvcHMsXG4gICAgICAgIGRlcHRoOiBwcm9wcy5kZXB0aCxcbiAgICAgICAgcGFyZW50SWQ6IHByb3BzLnBhcmVudElkLFxuICAgIH0pO1xufTtcbiIsInZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IGZ1bmN0aW9uICgpIHtcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXG4gICAgICAgICAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG52YXIgX19zcHJlYWRBcnJheSA9ICh0aGlzICYmIHRoaXMuX19zcHJlYWRBcnJheSkgfHwgZnVuY3Rpb24gKHRvLCBmcm9tLCBwYWNrKSB7XG4gICAgaWYgKHBhY2sgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gMikgZm9yICh2YXIgaSA9IDAsIGwgPSBmcm9tLmxlbmd0aCwgYXI7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgaWYgKGFyIHx8ICEoaSBpbiBmcm9tKSkge1xuICAgICAgICAgICAgaWYgKCFhcikgYXIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tLCAwLCBpKTtcbiAgICAgICAgICAgIGFyW2ldID0gZnJvbVtpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdG8uY29uY2F0KGFyIHx8IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20pKTtcbn07XG5pbXBvcnQgeyB1c2VNZW1vIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgZGVmYXVsdE1hdGNoZXIgfSBmcm9tICcuLi9zZWFyY2gvZGVmYXVsdE1hdGNoZXInO1xuaW1wb3J0IHsgdXNlVHJlZSB9IGZyb20gJy4uL3RyZWUvVHJlZSc7XG5pbXBvcnQgeyB1c2VUcmVlRW52aXJvbm1lbnQgfSBmcm9tICcuLi9jb250cm9sbGVkRW52aXJvbm1lbnQvQ29udHJvbGxlZFRyZWVFbnZpcm9ubWVudCc7XG5pbXBvcnQgeyB1c2VJbnRlcmFjdGlvbk1hbmFnZXIgfSBmcm9tICcuLi9jb250cm9sbGVkRW52aXJvbm1lbnQvSW50ZXJhY3Rpb25NYW5hZ2VyUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlRHJhZ0FuZERyb3AgfSBmcm9tICcuLi9kcmFnL0RyYWdBbmREcm9wUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlU2VsZWN0VXBUbyB9IGZyb20gJy4uL3RyZWUvdXNlU2VsZWN0VXBUbyc7XG5pbXBvcnQgeyB1c2VHZXRPcmlnaW5hbEl0ZW1PcmRlciB9IGZyb20gJy4uL3VzZUdldE9yaWdpbmFsSXRlbU9yZGVyJztcbi8vIFRPRE8gcmVzdHJ1Y3R1cmUgZmlsZS4gRXZlcnl0aGluZyBpbnRvIG9uZSBob29rIGZpbGUgd2l0aG91dCBoZWxwZXIgbWV0aG9kcywgbGV0IGFsbCBwcm9wcyBiZSBnZW5lcmF0ZWQgb3V0c2lkZSAoSW50ZXJhY3Rpb25NYW5hZ2VyIGFuZCBBY2Nlc3NpYmlsaXR5UHJvcHNNYW5hZ2VyKSwgLi4uXG5leHBvcnQgdmFyIHVzZVRyZWVJdGVtUmVuZGVyQ29udGV4dCA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgdmFyIF9hLCBfYiwgX2MsIF9kO1xuICAgIHZhciBfZSA9IHVzZVRyZWUoKSwgdHJlZUlkID0gX2UudHJlZUlkLCBzZWFyY2ggPSBfZS5zZWFyY2gsIHJlbmFtaW5nSXRlbSA9IF9lLnJlbmFtaW5nSXRlbSwgc2V0UmVuYW1pbmdJdGVtID0gX2Uuc2V0UmVuYW1pbmdJdGVtO1xuICAgIHZhciBlbnZpcm9ubWVudCA9IHVzZVRyZWVFbnZpcm9ubWVudCgpO1xuICAgIHZhciBpbnRlcmFjdGlvbk1hbmFnZXIgPSB1c2VJbnRlcmFjdGlvbk1hbmFnZXIoKTtcbiAgICB2YXIgZG5kID0gdXNlRHJhZ0FuZERyb3AoKTtcbiAgICB2YXIgc2VsZWN0VXBUbyA9IHVzZVNlbGVjdFVwVG8oJ2xhc3QtZm9jdXMnKTtcbiAgICB2YXIgaXRlbVRpdGxlID0gaXRlbSAmJiBlbnZpcm9ubWVudC5nZXRJdGVtVGl0bGUoaXRlbSk7XG4gICAgdmFyIGdldE9yaWdpbmFsSXRlbU9yZGVyID0gdXNlR2V0T3JpZ2luYWxJdGVtT3JkZXIoKTtcbiAgICB2YXIgaXNTZWFyY2hNYXRjaGluZyA9IHVzZU1lbW8oZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHJldHVybiBzZWFyY2ggPT09IG51bGwgfHwgc2VhcmNoLmxlbmd0aCA9PT0gMCB8fCAhaXRlbSB8fCAhaXRlbVRpdGxlXG4gICAgICAgICAgICA/IGZhbHNlXG4gICAgICAgICAgICA6ICgoX2EgPSBlbnZpcm9ubWVudC5kb2VzU2VhcmNoTWF0Y2hJdGVtKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBkZWZhdWx0TWF0Y2hlcikoc2VhcmNoLCBpdGVtLCBpdGVtVGl0bGUpO1xuICAgIH0sIFtzZWFyY2gsIGl0ZW0sIGl0ZW1UaXRsZSwgZW52aXJvbm1lbnQuZG9lc1NlYXJjaE1hdGNoSXRlbV0pO1xuICAgIHZhciBpc1NlbGVjdGVkID0gaXRlbSAmJiAoKF9iID0gKF9hID0gZW52aXJvbm1lbnQudmlld1N0YXRlW3RyZWVJZF0pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5zZWxlY3RlZEl0ZW1zKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuaW5jbHVkZXMoaXRlbS5pbmRleCkpO1xuICAgIHZhciBpc0V4cGFuZGVkID0gaXRlbSAmJiAoKF9kID0gKF9jID0gZW52aXJvbm1lbnQudmlld1N0YXRlW3RyZWVJZF0pID09PSBudWxsIHx8IF9jID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYy5leHBhbmRlZEl0ZW1zKSA9PT0gbnVsbCB8fCBfZCA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2QuaW5jbHVkZXMoaXRlbS5pbmRleCkpO1xuICAgIHZhciBpc1JlbmFtaW5nID0gaXRlbSAmJiByZW5hbWluZ0l0ZW0gPT09IGl0ZW0uaW5kZXg7XG4gICAgcmV0dXJuIHVzZU1lbW8oZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX2EsIF9iLCBfYywgX2QsIF9lLCBfZiwgX2csIF9oLCBfajtcbiAgICAgICAgaWYgKCFpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIHZhciB2aWV3U3RhdGUgPSBlbnZpcm9ubWVudC52aWV3U3RhdGVbdHJlZUlkXTtcbiAgICAgICAgdmFyIGN1cnJlbnRseVNlbGVjdGVkSXRlbXMgPSAoKF9iID0gKF9hID0gdmlld1N0YXRlID09PSBudWxsIHx8IHZpZXdTdGF0ZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogdmlld1N0YXRlLnNlbGVjdGVkSXRlbXMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5tYXAoZnVuY3Rpb24gKGl0ZW0pIHsgcmV0dXJuIGVudmlyb25tZW50Lml0ZW1zW2l0ZW1dOyB9KSkgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogKCh2aWV3U3RhdGUgPT09IG51bGwgfHwgdmlld1N0YXRlID09PSB2b2lkIDAgPyB2b2lkIDAgOiB2aWV3U3RhdGUuZm9jdXNlZEl0ZW0pXG4gICAgICAgICAgICA/IFtlbnZpcm9ubWVudC5pdGVtc1t2aWV3U3RhdGUgPT09IG51bGwgfHwgdmlld1N0YXRlID09PSB2b2lkIDAgPyB2b2lkIDAgOiB2aWV3U3RhdGUuZm9jdXNlZEl0ZW1dXVxuICAgICAgICAgICAgOiBbXSkpLmZpbHRlcihmdW5jdGlvbiAoaXRlbSkgeyByZXR1cm4gISFpdGVtOyB9KTtcbiAgICAgICAgdmFyIGlzSXRlbVBhcnRPZlNlbGVjdGVkSXRlbXMgPSAhIWN1cnJlbnRseVNlbGVjdGVkSXRlbXMuZmluZChmdW5jdGlvbiAoc2VsZWN0ZWRJdGVtKSB7IHJldHVybiBzZWxlY3RlZEl0ZW0uaW5kZXggPT09IGl0ZW0uaW5kZXg7IH0pO1xuICAgICAgICB2YXIgY2FuRHJhZ0N1cnJlbnRseVNlbGVjdGVkSXRlbXMgPSBjdXJyZW50bHlTZWxlY3RlZEl0ZW1zICYmXG4gICAgICAgICAgICAoKF9kID0gKF9jID0gZW52aXJvbm1lbnQuY2FuRHJhZykgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLmNhbGwoZW52aXJvbm1lbnQsIGN1cnJlbnRseVNlbGVjdGVkSXRlbXMpKSAhPT0gbnVsbCAmJiBfZCAhPT0gdm9pZCAwID8gX2QgOiB0cnVlKSAmJlxuICAgICAgICAgICAgY3VycmVudGx5U2VsZWN0ZWRJdGVtc1xuICAgICAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKGl0ZW0pIHsgdmFyIF9hOyByZXR1cm4gKF9hID0gaXRlbS5jYW5Nb3ZlKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiB0cnVlOyB9KVxuICAgICAgICAgICAgICAgIC5yZWR1Y2UoZnVuY3Rpb24gKGEsIGIpIHsgcmV0dXJuIGEgJiYgYjsgfSwgdHJ1ZSk7XG4gICAgICAgIHZhciBjYW5EcmFnVGhpc0l0ZW0gPSAoKF9mID0gKF9lID0gZW52aXJvbm1lbnQuY2FuRHJhZykgPT09IG51bGwgfHwgX2UgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9lLmNhbGwoZW52aXJvbm1lbnQsIFtpdGVtXSkpICE9PSBudWxsICYmIF9mICE9PSB2b2lkIDAgPyBfZiA6IHRydWUpICYmICgoX2cgPSBpdGVtLmNhbk1vdmUpICE9PSBudWxsICYmIF9nICE9PSB2b2lkIDAgPyBfZyA6IHRydWUpO1xuICAgICAgICB2YXIgY2FuRHJhZyA9IGVudmlyb25tZW50LmNhbkRyYWdBbmREcm9wICYmXG4gICAgICAgICAgICAoKGlzSXRlbVBhcnRPZlNlbGVjdGVkSXRlbXMgJiYgY2FuRHJhZ0N1cnJlbnRseVNlbGVjdGVkSXRlbXMpIHx8XG4gICAgICAgICAgICAgICAgKCFpc0l0ZW1QYXJ0T2ZTZWxlY3RlZEl0ZW1zICYmIGNhbkRyYWdUaGlzSXRlbSkpO1xuICAgICAgICB2YXIgY2FuRHJvcE9uID0gZW52aXJvbm1lbnQuY2FuRHJhZ0FuZERyb3AgJiZcbiAgICAgICAgICAgICEhKChfaiA9IChfaCA9IGRuZC52aWFibGVEcmFnUG9zaXRpb25zKSA9PT0gbnVsbCB8fCBfaCA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2hbdHJlZUlkXSkgPT09IG51bGwgfHwgX2ogPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9qLmZpbmQoZnVuY3Rpb24gKHBvc2l0aW9uKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBvc2l0aW9uLnRhcmdldFR5cGUgPT09ICdpdGVtJyAmJiBwb3NpdGlvbi50YXJnZXRJdGVtID09PSBpdGVtLmluZGV4O1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICB2YXIgYWN0aW9ucyA9IHtcbiAgICAgICAgICAgIC8vIFRPRE8gZGlzYWJsZSBtb3N0IGFjdGlvbnMgZHVyaW5nIHJlbmFtZVxuICAgICAgICAgICAgcHJpbWFyeUFjdGlvbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgICAgICAoX2EgPSBlbnZpcm9ubWVudC5vblByaW1hcnlBY3Rpb24pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5jYWxsKGVudmlyb25tZW50LCBlbnZpcm9ubWVudC5pdGVtc1tpdGVtLmluZGV4XSwgdHJlZUlkKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb2xsYXBzZUl0ZW06IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICAgICAgKF9hID0gZW52aXJvbm1lbnQub25Db2xsYXBzZUl0ZW0pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5jYWxsKGVudmlyb25tZW50LCBpdGVtLCB0cmVlSWQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGV4cGFuZEl0ZW06IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICAgICAgKF9hID0gZW52aXJvbm1lbnQub25FeHBhbmRJdGVtKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuY2FsbChlbnZpcm9ubWVudCwgaXRlbSwgdHJlZUlkKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b2dnbGVFeHBhbmRlZFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgICAgICAgICBpZiAoaXNFeHBhbmRlZCkge1xuICAgICAgICAgICAgICAgICAgICAoX2EgPSBlbnZpcm9ubWVudC5vbkNvbGxhcHNlSXRlbSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmNhbGwoZW52aXJvbm1lbnQsIGl0ZW0sIHRyZWVJZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAoX2IgPSBlbnZpcm9ubWVudC5vbkV4cGFuZEl0ZW0pID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5jYWxsKGVudmlyb25tZW50LCBpdGVtLCB0cmVlSWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZWxlY3RJdGVtOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgICAgIChfYSA9IGVudmlyb25tZW50Lm9uU2VsZWN0SXRlbXMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5jYWxsKGVudmlyb25tZW50LCBbaXRlbS5pbmRleF0sIHRyZWVJZCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYWRkVG9TZWxlY3RlZEl0ZW1zOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgICAgICAgICAoX2EgPSBlbnZpcm9ubWVudC5vblNlbGVjdEl0ZW1zKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuY2FsbChlbnZpcm9ubWVudCwgX19zcHJlYWRBcnJheShfX3NwcmVhZEFycmF5KFtdLCAoKF9iID0gdmlld1N0YXRlID09PSBudWxsIHx8IHZpZXdTdGF0ZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogdmlld1N0YXRlLnNlbGVjdGVkSXRlbXMpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IFtdKSwgdHJ1ZSksIFtpdGVtLmluZGV4XSwgZmFsc2UpLCB0cmVlSWQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHVuc2VsZWN0SXRlbTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBfYSwgX2IsIF9jO1xuICAgICAgICAgICAgICAgIChfYSA9IGVudmlyb25tZW50Lm9uU2VsZWN0SXRlbXMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5jYWxsKGVudmlyb25tZW50LCAoX2MgPSAoX2IgPSB2aWV3U3RhdGUgPT09IG51bGwgfHwgdmlld1N0YXRlID09PSB2b2lkIDAgPyB2b2lkIDAgOiB2aWV3U3RhdGUuc2VsZWN0ZWRJdGVtcykgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmZpbHRlcihmdW5jdGlvbiAoaWQpIHsgcmV0dXJuIGlkICE9PSBpdGVtLmluZGV4OyB9KSkgIT09IG51bGwgJiYgX2MgIT09IHZvaWQgMCA/IF9jIDogW10sIHRyZWVJZCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2VsZWN0VXBUbzogZnVuY3Rpb24gKG92ZXJyaWRlT2xkU2VsZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0VXBUbyhpdGVtLCBvdmVycmlkZU9sZFNlbGVjdGlvbik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3RhcnRSZW5hbWluZ0l0ZW06IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZXRSZW5hbWluZ0l0ZW0oaXRlbS5pbmRleCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3RvcFJlbmFtaW5nSXRlbTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNldFJlbmFtaW5nSXRlbShudWxsKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmb2N1c0l0ZW06IGZ1bmN0aW9uIChzZXREb21Gb2N1cykge1xuICAgICAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgICAgICBpZiAoc2V0RG9tRm9jdXMgPT09IHZvaWQgMCkgeyBzZXREb21Gb2N1cyA9IHRydWU7IH1cbiAgICAgICAgICAgICAgICAoX2EgPSBlbnZpcm9ubWVudC5vbkZvY3VzSXRlbSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmNhbGwoZW52aXJvbm1lbnQsIGl0ZW0sIHRyZWVJZCwgc2V0RG9tRm9jdXMpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN0YXJ0RHJhZ2dpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICAgICAgICAgIHZhciBzZWxlY3RlZEl0ZW1zID0gKF9hID0gdmlld1N0YXRlID09PSBudWxsIHx8IHZpZXdTdGF0ZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogdmlld1N0YXRlLnNlbGVjdGVkSXRlbXMpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IFtdO1xuICAgICAgICAgICAgICAgIGlmICghc2VsZWN0ZWRJdGVtcy5pbmNsdWRlcyhpdGVtLmluZGV4KSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZEl0ZW1zID0gW2l0ZW0uaW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICAoX2IgPSBlbnZpcm9ubWVudC5vblNlbGVjdEl0ZW1zKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuY2FsbChlbnZpcm9ubWVudCwgc2VsZWN0ZWRJdGVtcywgdHJlZUlkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGNhbkRyYWcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9yZGVyZWRJdGVtcyA9IGdldE9yaWdpbmFsSXRlbU9yZGVyKHRyZWVJZCwgc2VsZWN0ZWRJdGVtcy5tYXAoZnVuY3Rpb24gKGlkKSB7IHJldHVybiBlbnZpcm9ubWVudC5pdGVtc1tpZF07IH0pKTtcbiAgICAgICAgICAgICAgICAgICAgZG5kLm9uU3RhcnREcmFnZ2luZ0l0ZW1zKG9yZGVyZWRJdGVtcywgdHJlZUlkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgICB2YXIgcmVuZGVyRmxhZ3MgPSB7XG4gICAgICAgICAgICBpc1NlbGVjdGVkOiBpc1NlbGVjdGVkLFxuICAgICAgICAgICAgaXNFeHBhbmRlZDogaXNFeHBhbmRlZCxcbiAgICAgICAgICAgIGlzRm9jdXNlZDogKHZpZXdTdGF0ZSA9PT0gbnVsbCB8fCB2aWV3U3RhdGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHZpZXdTdGF0ZS5mb2N1c2VkSXRlbSkgPT09IGl0ZW0uaW5kZXgsXG4gICAgICAgICAgICBpc1JlbmFtaW5nOiBpc1JlbmFtaW5nLFxuICAgICAgICAgICAgaXNEcmFnZ2luZ092ZXI6IGRuZC5kcmFnZ2luZ1Bvc2l0aW9uICYmXG4gICAgICAgICAgICAgICAgZG5kLmRyYWdnaW5nUG9zaXRpb24udGFyZ2V0VHlwZSA9PT0gJ2l0ZW0nICYmXG4gICAgICAgICAgICAgICAgZG5kLmRyYWdnaW5nUG9zaXRpb24udGFyZ2V0SXRlbSA9PT0gaXRlbS5pbmRleCAmJlxuICAgICAgICAgICAgICAgIGRuZC5kcmFnZ2luZ1Bvc2l0aW9uLnRyZWVJZCA9PT0gdHJlZUlkLFxuICAgICAgICAgICAgaXNEcmFnZ2luZ092ZXJQYXJlbnQ6IGZhbHNlLFxuICAgICAgICAgICAgaXNTZWFyY2hNYXRjaGluZzogaXNTZWFyY2hNYXRjaGluZyxcbiAgICAgICAgICAgIGNhbkRyYWc6IGNhbkRyYWcsXG4gICAgICAgICAgICBjYW5Ecm9wT246IGNhbkRyb3BPbixcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGludGVyYWN0aXZlRWxlbWVudFByb3BzID0gX19hc3NpZ24oX19hc3NpZ24oe30sIGludGVyYWN0aW9uTWFuYWdlci5jcmVhdGVJbnRlcmFjdGl2ZUVsZW1lbnRQcm9wcyhpdGVtLCB0cmVlSWQsIGFjdGlvbnMsIHJlbmRlckZsYWdzLCB2aWV3U3RhdGUpKSwge1xuICAgICAgICAgICAgJ2RhdGEtcmN0LWl0ZW0taW50ZXJhY3RpdmUnOiB0cnVlLFxuICAgICAgICAgICAgJ2RhdGEtcmN0LWl0ZW0tZm9jdXMnOiByZW5kZXJGbGFncy5pc0ZvY3VzZWQgPyAndHJ1ZScgOiAnZmFsc2UnLFxuICAgICAgICAgICAgJ2RhdGEtcmN0LWl0ZW0taWQnOiBpdGVtLmluZGV4LFxuICAgICAgICB9KTtcbiAgICAgICAgdmFyIGl0ZW1Db250YWluZXJXaXRob3V0Q2hpbGRyZW5Qcm9wcyA9IF9fYXNzaWduKHt9LCB7XG4gICAgICAgICAgICAnZGF0YS1yY3QtaXRlbS1jb250YWluZXInOiAndHJ1ZScsXG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgaXRlbUNvbnRhaW5lcldpdGhDaGlsZHJlblByb3BzID0ge1xuICAgICAgICAgICAgcm9sZTogJ3RyZWVpdGVtJyxcbiAgICAgICAgICAgICdhcmlhLXNlbGVjdGVkJzogcmVuZGVyRmxhZ3MuaXNTZWxlY3RlZCxcbiAgICAgICAgICAgICdhcmlhLWV4cGFuZGVkJzogaXRlbS5pc0ZvbGRlclxuICAgICAgICAgICAgICAgID8gcmVuZGVyRmxhZ3MuaXNFeHBhbmRlZFxuICAgICAgICAgICAgICAgICAgICA/ICd0cnVlJ1xuICAgICAgICAgICAgICAgICAgICA6ICdmYWxzZSdcbiAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGFycm93UHJvcHMgPSB7XG4gICAgICAgICAgICBvbkNsaWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uaXNGb2xkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9ucy50b2dnbGVFeHBhbmRlZFN0YXRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFjdGlvbnMuc2VsZWN0SXRlbSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uRm9jdXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBhY3Rpb25zLmZvY3VzSXRlbSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uRHJhZ092ZXI6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpOyAvLyBBbGxvdyBkcm9wXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ2FyaWEtaGlkZGVuJzogdHJ1ZSxcbiAgICAgICAgICAgIHRhYkluZGV4OiAtMSxcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIHZpZXdTdGF0ZUZsYWdzID0gIXZpZXdTdGF0ZVxuICAgICAgICAgICAgPyB7fVxuICAgICAgICAgICAgOiBPYmplY3QuZW50cmllcyh2aWV3U3RhdGUpLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBfYSkge1xuICAgICAgICAgICAgICAgIHZhciBrZXkgPSBfYVswXSwgdmFsdWUgPSBfYVsxXTtcbiAgICAgICAgICAgICAgICBhY2Nba2V5XSA9IEFycmF5LmlzQXJyYXkodmFsdWUpXG4gICAgICAgICAgICAgICAgICAgID8gdmFsdWUuaW5jbHVkZXMoaXRlbS5pbmRleClcbiAgICAgICAgICAgICAgICAgICAgOiB2YWx1ZSA9PT0gaXRlbS5pbmRleDtcbiAgICAgICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICAgICAgfSwge30pO1xuICAgICAgICByZXR1cm4gX19hc3NpZ24oX19hc3NpZ24oX19hc3NpZ24oe30sIGFjdGlvbnMpLCByZW5kZXJGbGFncyksIHsgaW50ZXJhY3RpdmVFbGVtZW50UHJvcHM6IGludGVyYWN0aXZlRWxlbWVudFByb3BzLCBpdGVtQ29udGFpbmVyV2l0aENoaWxkcmVuUHJvcHM6IGl0ZW1Db250YWluZXJXaXRoQ2hpbGRyZW5Qcm9wcywgaXRlbUNvbnRhaW5lcldpdGhvdXRDaGlsZHJlblByb3BzOiBpdGVtQ29udGFpbmVyV2l0aG91dENoaWxkcmVuUHJvcHMsIGFycm93UHJvcHM6IGFycm93UHJvcHMsIHZpZXdTdGF0ZUZsYWdzOiB2aWV3U3RhdGVGbGFncyB9KTtcbiAgICB9LCBbXG4gICAgICAgIGl0ZW0sXG4gICAgICAgIGVudmlyb25tZW50LFxuICAgICAgICB0cmVlSWQsXG4gICAgICAgIGRuZCxcbiAgICAgICAgaXNTZWxlY3RlZCxcbiAgICAgICAgaXNFeHBhbmRlZCxcbiAgICAgICAgaXNSZW5hbWluZyxcbiAgICAgICAgaXNTZWFyY2hNYXRjaGluZyxcbiAgICAgICAgaW50ZXJhY3Rpb25NYW5hZ2VyLFxuICAgICAgICBzZWxlY3RVcFRvLFxuICAgICAgICBzZXRSZW5hbWluZ0l0ZW0sXG4gICAgICAgIGdldE9yaWdpbmFsSXRlbU9yZGVyLFxuICAgIF0pO1xufTtcbiIsImltcG9ydCB7IHVzZVJlZiwgdXNlU3RhdGUsIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlVHJlZSB9IGZyb20gJy4uL3RyZWUvVHJlZSc7XG5pbXBvcnQgeyB1c2VUcmVlRW52aXJvbm1lbnQgfSBmcm9tICcuLi9jb250cm9sbGVkRW52aXJvbm1lbnQvQ29udHJvbGxlZFRyZWVFbnZpcm9ubWVudCc7XG5pbXBvcnQgeyB1c2VIb3RrZXkgfSBmcm9tICcuLi9ob3RrZXlzL3VzZUhvdGtleSc7XG5pbXBvcnQgeyB1c2VTaWRlRWZmZWN0IH0gZnJvbSAnLi4vdXNlU2lkZUVmZmVjdCc7XG5pbXBvcnQgeyB1c2VDYWxsU29vbiB9IGZyb20gJy4uL3VzZUNhbGxTb29uJztcbmV4cG9ydCB2YXIgVHJlZUl0ZW1SZW5hbWluZ0lucHV0ID0gZnVuY3Rpb24gKHByb3BzKSB7XG4gICAgdmFyIF9hID0gdXNlVHJlZSgpLCByZW5kZXJlcnMgPSBfYS5yZW5kZXJlcnMsIHRyZWVJbmZvcm1hdGlvbiA9IF9hLnRyZWVJbmZvcm1hdGlvbiwgc2V0UmVuYW1pbmdJdGVtID0gX2Euc2V0UmVuYW1pbmdJdGVtLCB0cmVlSWQgPSBfYS50cmVlSWQ7XG4gICAgdmFyIGVudmlyb25tZW50ID0gdXNlVHJlZUVudmlyb25tZW50KCk7XG4gICAgdmFyIGlucHV0UmVmID0gdXNlUmVmKG51bGwpO1xuICAgIHZhciBzdWJtaXRCdXR0b25SZWYgPSB1c2VSZWYobnVsbCk7XG4gICAgdmFyIGl0ZW0gPSBlbnZpcm9ubWVudC5pdGVtc1twcm9wcy5pdGVtSW5kZXhdO1xuICAgIHZhciBfYiA9IHVzZVN0YXRlKGVudmlyb25tZW50LmdldEl0ZW1UaXRsZShpdGVtKSksIHRpdGxlID0gX2JbMF0sIHNldFRpdGxlID0gX2JbMV07XG4gICAgdmFyIGNhbGxTb29uID0gdXNlQ2FsbFNvb24odHJ1ZSk7XG4gICAgdmFyIGFib3J0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIChfYSA9IGVudmlyb25tZW50Lm9uQWJvcnRSZW5hbWluZ0l0ZW0pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5jYWxsKGVudmlyb25tZW50LCBpdGVtLCB0cmVlSW5mb3JtYXRpb24udHJlZUlkKTtcbiAgICAgICAgc2V0UmVuYW1pbmdJdGVtKG51bGwpO1xuICAgICAgICBjYWxsU29vbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBlbnZpcm9ubWVudC5zZXRBY3RpdmVUcmVlKHRyZWVJZCk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgdmFyIGNvbmZpcm0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgKF9hID0gZW52aXJvbm1lbnQub25SZW5hbWVJdGVtKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuY2FsbChlbnZpcm9ubWVudCwgaXRlbSwgdGl0bGUsIHRyZWVJbmZvcm1hdGlvbi50cmVlSWQpO1xuICAgICAgICBzZXRSZW5hbWluZ0l0ZW0obnVsbCk7XG4gICAgICAgIGNhbGxTb29uKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGVudmlyb25tZW50LnNldEFjdGl2ZVRyZWUodHJlZUlkKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICB1c2VTaWRlRWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF9hLCBfYiwgX2MsIF9kO1xuICAgICAgICBlbnZpcm9ubWVudC5zZXRBY3RpdmVUcmVlKHRyZWVJZCk7XG4gICAgICAgIGlmICgoX2EgPSBlbnZpcm9ubWVudC5hdXRvRm9jdXMpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IHRydWUpIHtcbiAgICAgICAgICAgIChfYiA9IGlucHV0UmVmLmN1cnJlbnQpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5zZWxlY3QoKTtcbiAgICAgICAgICAgIChfZCA9IChfYyA9IGlucHV0UmVmLmN1cnJlbnQpID09PSBudWxsIHx8IF9jID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYy5mb2N1cykgPT09IG51bGwgfHwgX2QgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9kLmNhbGwoX2MpO1xuICAgICAgICB9XG4gICAgfSwgW2Vudmlyb25tZW50LCB0cmVlSWRdLCBbXSk7XG4gICAgdXNlSG90a2V5KCdhYm9ydFJlbmFtZUl0ZW0nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGFib3J0KCk7XG4gICAgfSwgdHJ1ZSwgdHJ1ZSk7XG4gICAgdmFyIGlucHV0UHJvcHMgPSB7XG4gICAgICAgIHZhbHVlOiB0aXRsZSxcbiAgICAgICAgb25DaGFuZ2U6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBzZXRUaXRsZShlLnRhcmdldC52YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uQmx1cjogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGlmICghZS5yZWxhdGVkVGFyZ2V0IHx8IGUucmVsYXRlZFRhcmdldCAhPT0gc3VibWl0QnV0dG9uUmVmLmN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgICBhYm9ydCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAnYXJpYS1sYWJlbCc6ICdOZXcgaXRlbSBuYW1lJyxcbiAgICAgICAgdGFiSW5kZXg6IDAsXG4gICAgfTtcbiAgICB2YXIgc3VibWl0QnV0dG9uUHJvcHMgPSB7XG4gICAgICAgIG9uQ2xpY2s6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgY29uZmlybSgpO1xuICAgICAgICB9LFxuICAgIH07XG4gICAgdmFyIGZvcm1Qcm9wcyA9IHtcbiAgICAgICAgb25TdWJtaXQ6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBjb25maXJtKCk7XG4gICAgICAgIH0sXG4gICAgfTtcbiAgICByZXR1cm4gcmVuZGVyZXJzLnJlbmRlclJlbmFtZUlucHV0KHtcbiAgICAgICAgaXRlbTogaXRlbSxcbiAgICAgICAgaW5wdXRSZWY6IGlucHV0UmVmLFxuICAgICAgICBzdWJtaXRCdXR0b25Qcm9wczogc3VibWl0QnV0dG9uUHJvcHMsXG4gICAgICAgIHN1Ym1pdEJ1dHRvblJlZjogc3VibWl0QnV0dG9uUmVmLFxuICAgICAgICBmb3JtUHJvcHM6IGZvcm1Qcm9wcyxcbiAgICAgICAgaW5wdXRQcm9wczogaW5wdXRQcm9wcyxcbiAgICB9KTtcbn07XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBUcmVlSXRlbUNoaWxkcmVuIH0gZnJvbSAnLi9UcmVlSXRlbUNoaWxkcmVuJztcbmltcG9ydCB7IHVzZVZpZXdTdGF0ZSB9IGZyb20gJy4uL3RyZWUvdXNlVmlld1N0YXRlJztcbmltcG9ydCB7IHVzZVRyZWUgfSBmcm9tICcuLi90cmVlL1RyZWUnO1xuaW1wb3J0IHsgdXNlVHJlZUVudmlyb25tZW50IH0gZnJvbSAnLi4vY29udHJvbGxlZEVudmlyb25tZW50L0NvbnRyb2xsZWRUcmVlRW52aXJvbm1lbnQnO1xuaW1wb3J0IHsgdXNlVHJlZUl0ZW1SZW5kZXJDb250ZXh0IH0gZnJvbSAnLi91c2VUcmVlSXRlbVJlbmRlckNvbnRleHQnO1xuaW1wb3J0IHsgVHJlZUl0ZW1SZW5hbWluZ0lucHV0IH0gZnJvbSAnLi9UcmVlSXRlbVJlbmFtaW5nSW5wdXQnO1xuZXhwb3J0IHZhciBUcmVlSXRlbUVsZW1lbnQgPSBmdW5jdGlvbiAocHJvcHMpIHtcbiAgICB2YXIgX2EsIF9iLCBfYywgX2Q7XG4gICAgdmFyIF9lID0gdXNlU3RhdGUoZmFsc2UpLCBoYXNCZWVuUmVxdWVzdGVkID0gX2VbMF0sIHNldEhhc0JlZW5SZXF1ZXN0ZWQgPSBfZVsxXTtcbiAgICB2YXIgX2YgPSB1c2VUcmVlKCksIHJlbmRlcmVycyA9IF9mLnJlbmRlcmVycywgdHJlZUluZm9ybWF0aW9uID0gX2YudHJlZUluZm9ybWF0aW9uLCByZW5hbWluZ0l0ZW0gPSBfZi5yZW5hbWluZ0l0ZW07XG4gICAgdmFyIGVudmlyb25tZW50ID0gdXNlVHJlZUVudmlyb25tZW50KCk7XG4gICAgdmFyIHZpZXdTdGF0ZSA9IHVzZVZpZXdTdGF0ZSgpO1xuICAgIHZhciBpdGVtID0gZW52aXJvbm1lbnQuaXRlbXNbcHJvcHMuaXRlbUluZGV4XTtcbiAgICB2YXIgaXNFeHBhbmRlZCA9IHVzZU1lbW8oZnVuY3Rpb24gKCkgeyB2YXIgX2E7IHJldHVybiAoX2EgPSB2aWV3U3RhdGUuZXhwYW5kZWRJdGVtcykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmluY2x1ZGVzKHByb3BzLml0ZW1JbmRleCk7IH0sIFtwcm9wcy5pdGVtSW5kZXgsIHZpZXdTdGF0ZS5leHBhbmRlZEl0ZW1zXSk7XG4gICAgdmFyIHJlbmRlckNvbnRleHQgPSB1c2VUcmVlSXRlbVJlbmRlckNvbnRleHQoaXRlbSk7XG4gICAgaWYgKGl0ZW0gPT09IHVuZGVmaW5lZCB8fCByZW5kZXJDb250ZXh0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKCFoYXNCZWVuUmVxdWVzdGVkKSB7XG4gICAgICAgICAgICBzZXRIYXNCZWVuUmVxdWVzdGVkKHRydWUpO1xuICAgICAgICAgICAgKF9hID0gZW52aXJvbm1lbnQub25NaXNzaW5nSXRlbXMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5jYWxsKGVudmlyb25tZW50LCBbcHJvcHMuaXRlbUluZGV4XSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHZhciBzaG91bGRSZW5kZXJDaGlsZHJlbiA9IChfYyA9IChfYiA9IGVudmlyb25tZW50LnNob3VsZFJlbmRlckNoaWxkcmVuKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuY2FsbChlbnZpcm9ubWVudCwgaXRlbSwgcmVuZGVyQ29udGV4dCkpICE9PSBudWxsICYmIF9jICE9PSB2b2lkIDAgPyBfYyA6IChpdGVtLmlzRm9sZGVyICYmIGlzRXhwYW5kZWQpO1xuICAgIHZhciBjaGlsZHJlbiA9IGl0ZW0uY2hpbGRyZW4gJiYgc2hvdWxkUmVuZGVyQ2hpbGRyZW4gJiYgKFJlYWN0LmNyZWF0ZUVsZW1lbnQoVHJlZUl0ZW1DaGlsZHJlbiwgeyBkZXB0aDogcHJvcHMuZGVwdGggKyAxLCBwYXJlbnRJZDogcHJvcHMuaXRlbUluZGV4IH0sIGl0ZW0uY2hpbGRyZW4pKTtcbiAgICB2YXIgdGl0bGUgPSBlbnZpcm9ubWVudC5nZXRJdGVtVGl0bGUoaXRlbSk7XG4gICAgdmFyIHRpdGxlQ29tcG9uZW50ID0gcmVuYW1pbmdJdGVtID09PSBwcm9wcy5pdGVtSW5kZXggPyAoUmVhY3QuY3JlYXRlRWxlbWVudChUcmVlSXRlbVJlbmFtaW5nSW5wdXQsIHsgaXRlbUluZGV4OiBwcm9wcy5pdGVtSW5kZXggfSkpIDogKHJlbmRlcmVycy5yZW5kZXJJdGVtVGl0bGUoe1xuICAgICAgICBpbmZvOiB0cmVlSW5mb3JtYXRpb24sXG4gICAgICAgIGNvbnRleHQ6IHJlbmRlckNvbnRleHQsXG4gICAgICAgIHRpdGxlOiB0aXRsZSxcbiAgICAgICAgaXRlbTogaXRlbSxcbiAgICB9KSk7XG4gICAgdmFyIGFycm93Q29tcG9uZW50ID0gcmVuZGVyZXJzLnJlbmRlckl0ZW1BcnJvdyh7XG4gICAgICAgIGluZm86IHRyZWVJbmZvcm1hdGlvbixcbiAgICAgICAgY29udGV4dDogcmVuZGVyQ29udGV4dCxcbiAgICAgICAgaXRlbTogZW52aXJvbm1lbnQuaXRlbXNbcHJvcHMuaXRlbUluZGV4XSxcbiAgICB9KTtcbiAgICByZXR1cm4gKChfZCA9IHJlbmRlcmVycy5yZW5kZXJJdGVtKHtcbiAgICAgICAgaXRlbTogZW52aXJvbm1lbnQuaXRlbXNbcHJvcHMuaXRlbUluZGV4XSxcbiAgICAgICAgZGVwdGg6IHByb3BzLmRlcHRoLFxuICAgICAgICB0aXRsZTogdGl0bGVDb21wb25lbnQsXG4gICAgICAgIGFycm93OiBhcnJvd0NvbXBvbmVudCxcbiAgICAgICAgY29udGV4dDogcmVuZGVyQ29udGV4dCxcbiAgICAgICAgaW5mbzogdHJlZUluZm9ybWF0aW9uLFxuICAgICAgICBjaGlsZHJlbjogY2hpbGRyZW4sXG4gICAgfSkpICE9PSBudWxsICYmIF9kICE9PSB2b2lkIDAgPyBfZCA6IG51bGwpOyAvLyBUeXBlIHRvIHVzZSBBbGxUcmVlUmVuZGVyUHJvcHNcbn07XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0cmVlRGF0YVJlZHVjZXIodHJlZURhdGEsIGFjdGlvbikge1xuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICAgICAgY2FzZSBcInJlbG9hZFwiOiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIC4uLnRyZWVEYXRhLFxuICAgICAgICAgICAgICAgIGRhdGE6IGFjdGlvbi5kYXRhXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgICAgICAgICAgIC4uLnRyZWVEYXRhXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmVzdWx0LmRhdGEgPSB7XG4gICAgICAgICAgICAgICAgLi4ucmVzdWx0LmRhdGEsXG4gICAgICAgICAgICAgICAgLi4uYWN0aW9uLmRhdGFcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAoYWN0aW9uLmRlbGV0ZWROb2RlSURzKSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBkZWxldGVkTm9kZUlEIG9mIGFjdGlvbi5kZWxldGVkTm9kZUlEcy5zcGxpdChcIixcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHJlc3VsdC5kYXRhW2RlbGV0ZWROb2RlSURdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSBcInNldERhdGFDaGFuZ2VkRGF0ZVwiOiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIC4uLnRyZWVEYXRhLFxuICAgICAgICAgICAgICAgIGRhdGFDaGFuZ2VkRGF0ZTogYWN0aW9uLmRhdGFDaGFuZ2VkRGF0ZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcIlVua25vd24gYWN0aW9uOiBcIiArIGFjdGlvbi50eXBlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXRyYWlsaW5nLXNwYWNlcyAqL1xuLyogZXNsaW50LWRpc2FibGUgY29tbWEtc3BhY2luZyAqL1xuLyogZXNsaW50LWRpc2FibGUgcHJldHRpZXIvcHJldHRpZXIgKi9cbmltcG9ydCB7IENvbnRyb2xsZWRUcmVlRW52aXJvbm1lbnQsIFRyZWUgfSBmcm9tIFwicmVhY3QtY29tcGxleC10cmVlXCI7XG5pbXBvcnQgeyBjcmVhdGVFbGVtZW50LCB1c2VDYWxsYmFjaywgdXNlRWZmZWN0LCB1c2VSZWR1Y2VyLCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgSWNvbiB9IGZyb20gXCJtZW5kaXgvY29tcG9uZW50cy93ZWIvSWNvblwiO1xuaW1wb3J0IHRyZWVEYXRhUmVkdWNlciBmcm9tIFwiLi4vdXRpbHMvdHJlZURhdGFSZWR1Y2VyXCI7XG5pbXBvcnQgRmlsZUxpc3RWaWV3IGZyb20gXCIuL0ZpbGVMaXN0Vmlld1wiO1xuXG5cbi8vIO2PtOuNlCDrsI8g7YyM7J28IOyVhOydtOy9mCDsu7Ttj6zrhIztirgg7LaU6rCAXG5jb25zdCBGb2xkZXJJY29uID0gKHsgaXNPcGVuIH0pID0+IChcbiAgICA8c3BhbiBjbGFzc05hbWU9XCJmb2xkZXItaWNvblwiPlxuICAgICAgICB7aXNPcGVuID8gKFxuICAgICAgICAgICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjE2XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiPlxuICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMjIgMTlhMiAyIDAgMCAxLTIgMkg0YTIgMiAwIDAgMS0yLTJWNWEyIDIgMCAwIDEgMi0yaDVsMiAzaDlhMiAyIDAgMCAxIDIgMnYxMXpcIj48L3BhdGg+XG4gICAgICAgICAgICAgICAgPGxpbmUgeDE9XCI5XCIgeTE9XCIxNFwiIHgyPVwiMTVcIiB5Mj1cIjE0XCI+PC9saW5lPlxuICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjE2XCIgaGVpZ2h0PVwiMTZcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCI+XG4gICAgICAgICAgICAgICAgPHBhdGggZD1cIk0yMiAxOWEyIDIgMCAwIDEtMiAySDRhMiAyIDAgMCAxLTItMlY1YTIgMiAwIDAgMSAyLTJoNWwyIDNoOWEyIDIgMCAwIDEgMiAydjExelwiPjwvcGF0aD5cbiAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICApfVxuICAgIDwvc3Bhbj5cbik7XG5cbmNvbnN0IEZpbGVJY29uID0gKHsgZmlsZVR5cGUgfSkgPT4ge1xuICAgIC8vIO2MjOydvCDtg4DsnoXsl5Ag65Sw6528IOuLpOuluCDslYTsnbTsvZgg7ZGc7IucXG4gICAgY29uc3QgZ2V0RmlsZUljb24gPSAoKSA9PiB7XG4gICAgICAgIHN3aXRjaCAoZmlsZVR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3BwdHgnOlxuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMTZcIiBoZWlnaHQ9XCIxNlwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cIiNGRjU3MzNcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTE0IDJINmEyIDIgMCAwIDAtMiAydjE2YTIgMiAwIDAgMCAyIDJoMTJhMiAyIDAgMCAwIDItMlY4elwiPjwvcGF0aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5bGluZSBwb2ludHM9XCIxNCAyIDE0IDggMjAgOFwiPjwvcG9seWxpbmU+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PVwiOFwiIHk9XCIxOVwiIGZvbnRTaXplPVwiOFwiIGZpbGw9XCIjRkY1NzMzXCI+UFBUPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgY2FzZSAneGxzeCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjE2XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiIzJFN0QzMlwiIHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMTQgMkg2YTIgMiAwIDAgMC0yIDJ2MTZhMiAyIDAgMCAwIDIgMmgxMmEyIDIgMCAwIDAgMi0yVjh6XCI+PC9wYXRoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlsaW5lIHBvaW50cz1cIjE0IDIgMTQgOCAyMCA4XCI+PC9wb2x5bGluZT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9XCI5XCIgeT1cIjE5XCIgZm9udFNpemU9XCI4XCIgZmlsbD1cIiMyRTdEMzJcIj5YTDwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNhc2UgJ2RvY3gnOlxuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMTZcIiBoZWlnaHQ9XCIxNlwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cIiMyMTk2RjNcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTE0IDJINmEyIDIgMCAwIDAtMiAydjE2YTIgMiAwIDAgMCAyIDJoMTJhMiAyIDAgMCAwIDItMlY4elwiPjwvcGF0aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5bGluZSBwb2ludHM9XCIxNCAyIDE0IDggMjAgOFwiPjwvcG9seWxpbmU+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PVwiOVwiIHk9XCIxOVwiIGZvbnRTaXplPVwiOFwiIGZpbGw9XCIjMjE5NkYzXCI+RE9DPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgY2FzZSAncGRmJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjE2XCIgaGVpZ2h0PVwiMTZcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCIjRjQ0MzM2XCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0xNCAySDZhMiAyIDAgMCAwLTIgMnYxNmEyIDIgMCAwIDAgMiAyaDEyYTIgMiAwIDAgMCAyLTJWOHpcIj48L3BhdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cG9seWxpbmUgcG9pbnRzPVwiMTQgMiAxNCA4IDIwIDhcIj48L3BvbHlsaW5lPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD1cIjhcIiB5PVwiMTlcIiBmb250U2l6ZT1cIjhcIiBmaWxsPVwiI0Y0NDMzNlwiPlBERjwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjE2XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0xNCAySDZhMiAyIDAgMCAwLTIgMnYxNmEyIDIgMCAwIDAgMiAyaDEyYTIgMiAwIDAgMCAyLTJWOHpcIj48L3BhdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cG9seWxpbmUgcG9pbnRzPVwiMTQgMiAxNCA4IDIwIDhcIj48L3BvbHlsaW5lPlxuICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiA8c3BhbiBjbGFzc05hbWU9XCJmaWxlLWljb25cIj57Z2V0RmlsZUljb24oKX08L3NwYW4+O1xufTtcblxuXG5cblxuXG5cblxuXG5leHBvcnQgZnVuY3Rpb24gVHJlZUNvbnRhaW5lcih7XG4gICAgZGF0YUNoYW5nZWREYXRlLFxuICAgIHNlcnZpY2VVcmwsXG4gICAgd2lkZ2V0TmFtZSxcbiAgICB3aWRnZXRDbGFzc05hbWUsXG4gICAgdG9nZ2xlRXhwYW5kZWRJY29uT25seSxcbiAgICBhbGxvd05vZGVSZW5hbWUsXG4gICAgYWxsb3dEcmFnUmVvcmRlcmluZyxcbiAgICBhbGxvd0RyYWdNb3ZlLFxuICAgIGNvbGxhcHNlQWxsQnV0dG9uSWNvbixcbiAgICBjb2xsYXBzZUFsbEJ1dHRvbkNhcHRpb24sXG4gICAgY29sbGFwc2VBbGxCdXR0b25DbGFzcyxcbiAgICBzaG93RXhwYW5kQWxsQnV0dG9uLFxuICAgIGV4cGFuZEFsbEJ1dHRvbkljb24sXG4gICAgZXhwYW5kQWxsQnV0dG9uQ2FwdGlvbixcbiAgICBleHBhbmRBbGxCdXR0b25DbGFzcyxcbiAgICBvblNlbGVjdGlvbkNoYW5nZWQsXG4gICAgb25NaXNzaW5nTm9kZXMsXG4gICAgb25Ob2RlUmVuYW1lZCxcbiAgICBvbkRyb3AsXG4gICAgbG9nTWVzc2FnZVRvQ29uc29sZSxcbiAgICBsb2dUb0NvbnNvbGUsXG4gICAgZHVtcFNlcnZpY2VSZXNwb25zZUluQ29uc29sZVxufSkge1xuICAgIGNvbnN0IFt0cmVlRGF0YSwgZGlzcGF0Y2hdID0gdXNlUmVkdWNlcih0cmVlRGF0YVJlZHVjZXIsIG51bGwpO1xuICAgIGNvbnN0IFtmb2N1c2VkSXRlbSwgc2V0Rm9jdXNlZEl0ZW1dID0gdXNlU3RhdGUoKTtcbiAgICBjb25zdCBbZXhwYW5kZWRJdGVtcywgc2V0RXhwYW5kZWRJdGVtc10gPSB1c2VTdGF0ZShbXSk7XG4gICAgY29uc3QgW3NlbGVjdGVkSXRlbXMsIHNldFNlbGVjdGVkSXRlbXNdID0gdXNlU3RhdGUoW10pO1xuXG5cbiAvLyDsl6zquLDsl5AgcmVuZGVySXRlbVRpdGxlIO2VqOyImOulvCDstpTqsIBcbiBjb25zdCByZW5kZXJJdGVtVGl0bGUgPSBpdGVtID0+IHtcbiAgICBjb25zdCBmaWxlRXh0ZW5zaW9uID0gaXRlbS5kYXRhLm5hbWUgPyBpdGVtLmRhdGEubmFtZS5zcGxpdCgnLicpLnBvcCgpLnRvTG93ZXJDYXNlKCkgOiAnJztcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRyZWUtaXRlbS1jb250ZW50XCI+XG4gICAgICAgICAgICB7aXRlbS5pc0ZvbGRlciA/IChcbiAgICAgICAgICAgICAgICA8Rm9sZGVySWNvbiBpc09wZW49e2V4cGFuZGVkSXRlbXMuaW5jbHVkZXMoaXRlbS5pbmRleCl9IC8+XG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgIDxGaWxlSWNvbiBmaWxlVHlwZT17ZmlsZUV4dGVuc2lvbn0gLz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpdGVtLXRleHRcIj57aXRlbS5kYXRhLm5hbWV9PC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufTtcblxuXG5cblxuICAgIGNvbnNvbGUubG9nKFwidHJlZURhdGFcIiwgdHJlZURhdGEpXG4gICAgY29uc29sZS5kaXIoXCJ0cmVlRGF0YVwiLHRyZWVEYXRhKVxuICAgIGNvbnN0IG9uU2VsZWN0aW9uQ2hhbmdlZEhhbmRsZXIgPSB1c2VDYWxsYmFjayhcbiAgICAgICAgaXRlbXMgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWRJRHMgPSBpdGVtcy5qb2luKFwiLFwiKTtcbiAgICAgICAgICAgIGlmIChsb2dUb0NvbnNvbGUpIHtcbiAgICAgICAgICAgICAgICBsb2dNZXNzYWdlVG9Db25zb2xlKFwib25TZWxlY3Rpb25DaGFuZ2VkSGFuZGxlciBjYWxsZWQgZm9yIGl0ZW1zIFwiICsgc2VsZWN0ZWRJRHMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBTZXQgdGhlIG5ldyBzZWxlY3Rpb24gb24gdGhlIHN0YXRlXG4gICAgICAgICAgICBzZXRTZWxlY3RlZEl0ZW1zKGl0ZW1zKTtcblxuICAgICAgICAgICAgLy8gQ2FsbCBoYW5kbGVyIHdpdGggaXRlbSBJRHMgam9pbmVkIGludG8gb25lIHN0cmluZ1xuICAgICAgICAgICAgb25TZWxlY3Rpb25DaGFuZ2VkKHNlbGVjdGVkSURzKTtcbiAgICAgICAgfSxcbiAgICAgICAgW2xvZ01lc3NhZ2VUb0NvbnNvbGUsIGxvZ1RvQ29uc29sZSwgb25TZWxlY3Rpb25DaGFuZ2VkXVxuICAgICk7XG5cbiAgICAvLyDtmZXsnqUg7JWE7J207YWcIOyVhOydtOy9mCDtlbjrk6Trn6xcbiAgICBjb25zdCBvbkV4cGFuZEl0ZW1IYW5kbGVyID0gdXNlQ2FsbGJhY2soXG4gICAgICAgIGl0ZW0gPT4ge1xuICAgICAgICAgICAgaWYgKGxvZ1RvQ29uc29sZSkge1xuICAgICAgICAgICAgICAgIGxvZ01lc3NhZ2VUb0NvbnNvbGUoXCJvbkV4cGFuZEl0ZW1IYW5kbGVyOiBjYWxsZWQgZm9yIGl0ZW0gXCIgKyBpdGVtLmluZGV4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEZpcnN0IHNldCB0aGUgc3RhdGUgc28gdGhlIHRyZWUgcmVuZGVycyB0aGUgZXhwYW5kZWQgaXRlbVxuICAgICAgICAgICAgc2V0RXhwYW5kZWRJdGVtcyhbLi4uZXhwYW5kZWRJdGVtcywgaXRlbS5pbmRleF0pO1xuXG4gICAgICAgICAgICAvLyBUaGUgbGlicmFyeSBoYXMgYSBtaXNzaW5nIGNoaWxkIGl0ZW0gY2FsbGJhY2sgYnV0IGl0IGRvZXMgbm90IHdvcmsgdmVyeSB3ZWxsLlxuICAgICAgICAgICAgLy8gSXRlbSBpbmRlZWQgaGFzIGNoaWxkcmVuXG4gICAgICAgICAgICBpZiAoaXRlbS5jaGlsZHJlbiAmJiBpdGVtLmNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpcnN0Q2hpbGRJRCA9IGl0ZW0uY2hpbGRyZW5bMF07XG4gICAgICAgICAgICAgICAgLy8gUmVxdWVzdCBjaGlsZCBub2RlcyBpZiBub3QgYWxyZWFkeSBhdmFpbGFibGVcbiAgICAgICAgICAgICAgICBpZiAoIXRyZWVEYXRhLmRhdGFbZmlyc3RDaGlsZElEXSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBDYWxsIGhhbmRsZXIgd2l0aCBleHBhbmRlZCBpdGVtIElEIGFuZCBpdHMgY2hpbGQgSURzXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlcXVlc3RlZElEcyA9IGl0ZW0uaW5kZXggKyBcIixcIiArIGl0ZW0uY2hpbGRyZW4uam9pbihcIixcIik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2dUb0NvbnNvbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ01lc3NhZ2VUb0NvbnNvbGUoXCJvbkV4cGFuZEl0ZW1IYW5kbGVyOiByZXF1ZXN0IGl0ZW1zIFwiICsgcmVxdWVzdGVkSURzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBvbk1pc3NpbmdOb2RlcyhyZXF1ZXN0ZWRJRHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgW2V4cGFuZGVkSXRlbXMsIGxvZ01lc3NhZ2VUb0NvbnNvbGUsIGxvZ1RvQ29uc29sZSwgb25NaXNzaW5nTm9kZXMsIHRyZWVEYXRhPy5kYXRhXVxuICAgICk7XG5cbiAgICAvLyDstpXshowg7KeE7ZaJXG4gICAgY29uc3Qgb25Db2xsYXBzZUFsbEJ1dHRvbkNsaWNrID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgICAgICBzZXRFeHBhbmRlZEl0ZW1zKFtdKTsgLy8g7LaV7IaMIOyLnO2CpOuLiOq5kCDtmZXsnqXrkJjripTqsbQg7JeG7Jy864uIIOu5iCDrsLDsl7TsnZgg6rCS7Jy866GcIOyEpOygleyglVxuICAgIH0sIFtdKTtcblxuICAgIC8vIO2ZleyepSDsp4TtlolcbiAgICBjb25zdCBvbkV4cGFuZEFsbEJ1dHRvbkNsaWNrID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgICAgICBjb25zdCBleHBhbmRhYmxlSXRlbUlEcyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGl0ZW1JRCBpbiB0cmVlRGF0YS5kYXRhKSB7XG5cbiAgICAgICAgICAgIGlmICh0cmVlRGF0YS5kYXRhW2l0ZW1JRF0uY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICBleHBhbmRhYmxlSXRlbUlEcy5wdXNoKGl0ZW1JRCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc2V0RXhwYW5kZWRJdGVtcyhleHBhbmRhYmxlSXRlbUlEcyk7XG4gICAgfSwgW3RyZWVEYXRhPy5kYXRhXSk7XG5cbiAgICAvLyB0cmVl7IaN7ISx64K0IG5vZGXsnZgg7J2066aEIOyEpOyglVxuICAgIGNvbnN0IG9uUmVuYW1lTm9kZUhhbmRsZXIgPSB1c2VDYWxsYmFjayhcbiAgICAgICAgKGl0ZW0sIG5ld05hbWUpID0+IHtcbiAgICAgICAgICAgIG9uTm9kZVJlbmFtZWQoaXRlbS5pbmRleCwgbmV3TmFtZSk7XG4gICAgICAgIH0sXG4gICAgICAgIFtvbk5vZGVSZW5hbWVkXVxuICAgICk7XG5cbiAgICAvLyDrp4jsmrDsiqQg65Oc656N7J2067Kk7Yq4XG4gICAgY29uc3Qgb25Ecm9wSGFuZGxlciA9IHVzZUNhbGxiYWNrKFxuICAgICAgICAoaXRlbXMsIHRhcmdldCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZHJhZ2dlZEl0ZW1JRHMgPSBpdGVtcy5yZWR1Y2UoKGFjY3VtdWxhdG9yLCBpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGFjY3VtdWxhdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhY2N1bXVsYXRvciArIFwiLFwiICsgaXRlbS5pbmRleDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS5pbmRleDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBudWxsKTtcbiAgICAgICAgICAgIGlmIChsb2dUb0NvbnNvbGUpIHtcbiAgICAgICAgICAgICAgICBsb2dNZXNzYWdlVG9Db25zb2xlKFxuICAgICAgICAgICAgICAgICAgICBcIm9uRHJvcEhhbmRsZXI6IGl0ZW1zIFwiICsgZHJhZ2dlZEl0ZW1JRHMgKyBcIiBkcmFnZ2VkLCBkcm9wIGluZm86IFwiICsgSlNPTi5zdHJpbmdpZnkodGFyZ2V0KVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvbkRyb3AoZHJhZ2dlZEl0ZW1JRHMsIHRhcmdldCk7XG4gICAgICAgIH0sXG4gICAgICAgIFtsb2dNZXNzYWdlVG9Db25zb2xlLCBsb2dUb0NvbnNvbGUsIG9uRHJvcF1cbiAgICApO1xuXG4gICAgLy8g66eI7Jqw7IqkIOuTnOuemOq3uCDsnbTrsqTtirggKHJlc3VsdCA6IHRydWUgfHwgZmFsc2UpXG4gICAgY29uc3QgY2FuRHJhZ0hhbmRsZXIgPSB1c2VDYWxsYmFjayhpdGVtcyA9PiB7XG4gICAgICAgIGlmICghaXRlbXMgfHwgaXRlbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpdGVtcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtc1swXS5jYW5Nb3ZlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZmlyc3RQYXJlbnRJRCA9IGl0ZW1zWzBdLmRhdGEucGFyZW50SUQ7XG4gICAgICAgIHJldHVybiBpdGVtcy5ldmVyeShpdGVtID0+IGl0ZW0uZGF0YS5wYXJlbnRJRCA9PT0gZmlyc3RQYXJlbnRJRCAmJiBpdGVtLmNhbk1vdmUpO1xuICAgIH0sIFtdKTtcblxuICAgIGNvbnN0IGNhbkRyb3BBdEhhbmRsZXIgPSB1c2VDYWxsYmFjayhcbiAgICAgICAgKGl0ZW1zLCB0YXJnZXQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldE5vZGVJRCA9IHRhcmdldC50YXJnZXRUeXBlID09PSBcImJldHdlZW4taXRlbXNcIiA/IHRhcmdldC5wYXJlbnRJdGVtIDogdGFyZ2V0LnRhcmdldEl0ZW07XG4gICAgICAgICAgICBjb25zdCB0YXJnZXROb2RlID0gdHJlZURhdGEuZGF0YVt0YXJnZXROb2RlSURdO1xuXG4gICAgICAgICAgICAvLyBUYXJnZXQgZG9lcyBub3Qgc3BlY2lmeSBhY2NlcHRlZCBkcmFnIHR5cGVzIHNvIGFueXRoaW5nIGlzIGFsbG93ZWRcbiAgICAgICAgICAgIGlmICghdGFyZ2V0Tm9kZS5kYXRhLmFjY2VwdERyYWdUeXBlcykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJdGVtIGNhbiBiZSBkcm9wcGVkIGF0IHRoZSB0YXJnZXQgaWYgaXQgaGFzIGEgZHJhZyB0eXBlIGFuZCB0aGUgdGFyZ2V0IGFjY2VwdHMgaXQuXG4gICAgICAgICAgICAvLyBOb3RlIHRoYXQgdGhlIGluY2x1ZGVzIGZ1bmN0aW9uIGlzIGNhc2Ugc2Vuc2l0aXZlIVxuICAgICAgICAgICAgLy8gRm9yIHBlcmZvcm1hbmNlLCBubyBjYXNlIGNvbnZlcnNpb24gaXMgZG9uZSwgdGhpcyBpcyB1cCB0byB0aGUgZGV2ZWxvcGVyIHRoYXQgdXNlcyB0aGlzIHdpZGdldC5cbiAgICAgICAgICAgIHJldHVybiBpdGVtcy5ldmVyeShcbiAgICAgICAgICAgICAgICBpdGVtID0+ICEhaXRlbS5kYXRhLmRyYWdUeXBlICYmIHRhcmdldE5vZGUuZGF0YS5hY2NlcHREcmFnVHlwZXMuaW5jbHVkZXMoaXRlbS5kYXRhLmRyYWdUeXBlKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSxcbiAgICAgICAgW3RyZWVEYXRhPy5kYXRhXVxuICAgICk7XG5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcIuydtOqxsCDthrXqs7ztlanri4jquYw/XCIpXG4gICAgICAgIGNvbnN0IHByb2Nlc3NEYXRhRnJvbVNlcnZpY2UgPSBkYXRhID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi7JW8IOydtOqxsCDrjbDsnbTthLDrg5A/ZGF0YVwiLCBkYXRhKVxuICAgICAgICAgICAgY29uc29sZS5kaXIoXCLslbwg7J206rGwIOuNsOydtO2EsOuDkD9kYXRhXCIsIGRhdGEpXG4gICAgICAgICAgICAvL1Jlc3BvbnNlTm9kZXPrpbwgbm9kZXProZwg66ek7ZWRIFxuICAgICAgICAgXG4gICAgICAgICAgICBpZiAoZGF0YS5SZXNwb25zZU5vZGVzKSB7XG4gICAgICAgICAgICAgICAgZGF0YS5ub2RlcyA9IEFycmF5LmlzQXJyYXkoZGF0YS5SZXNwb25zZU5vZGVzKSA/IGRhdGEuUmVzcG9uc2VOb2RlcyA6IFxuICAgICAgICAgICAgICAgICh0eXBlb2YgZGF0YS5SZXNwb25zZU5vZGVzID09PSAnb2JqZWN0JyA/IE9iamVjdC52YWx1ZXMoZGF0YS5SZXNwb25zZU5vZGVzKSA6IFtdKTtcbiAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8g66ek7ZWRIO2bhCDtmZXsnbhcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi66ek7ZWRIO2bhCBub2RlczpcIiwgZGF0YS5ub2Rlcyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5vZGVz64qUIOuwsOyXtD9cIiwgQXJyYXkuaXNBcnJheShkYXRhLm5vZGVzKSk7XG4gICAgICAgICAgICBjb25zdCBjcmVhdGVUcmVlRGF0YU9iamVjdCA9ICgpID0+IHtcblxuICAgICAgICAgICAgICAgIGlmICghZGF0YSB8fCAhZGF0YS5ub2RlcyB8fCAhQXJyYXkuaXNBcnJheShkYXRhLm5vZGVzKSl7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJkYXRhLm5vZGVz6rCAIOuwsOyXtOydtCDslYTri5nri4jri6QuIFwiLGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge307XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3VHJlZURhdGEgPSB7fTtcblxuICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgbm9kZSBvZiBkYXRhLm5vZGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibm9kZXNcIixub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kaXIoXCJub2RlXCIsbm9kZSlcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5vZGVEYXRhID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXg6IG5vZGUuaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0ZvbGRlcjogISFub2RlLmNoaWxkcmVuLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FuTW92ZTogbm9kZS5jYW5Nb3ZlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FuUmVuYW1lOiBub2RlLmNhblJlbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBub2RlLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50SUQ6IG5vZGUucGFyZW50SURcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ29udmVydCBjaGlsZHJlbiBmcm9tIGNvbW1hIHNlcGFyYXRlZCB2YWx1ZSBpbnRvIGFycmF5XG4gICAgICAgICAgICAgICAgICAgIGlmIChub2RlLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlRGF0YS5jaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW4uc3BsaXQoXCIsXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIE9ubHkgaW5jbHVkZSB0aGUgZHJhZy9kcm9wIHNldHRpbmdzIGlmIHRoZXkgYXJlIHNldC4gS2VlcHMgbm9kZSBkYXRhIG9iamVjdCBhcyBzbWFsbCBhcyBwb3NzaWJsZVxuICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5kcmFnVHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZURhdGEuZGF0YS5kcmFnVHlwZSA9IG5vZGUuZHJhZ1R5cGU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUuYWNjZXB0RHJhZ1R5cGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlRGF0YS5kYXRhLmFjY2VwdERyYWdUeXBlcyA9IG5vZGUuYWNjZXB0RHJhZ1R5cGVzO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG5ld1RyZWVEYXRhW25vZGUuaW5kZXhdID0gbm9kZURhdGE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi7JW8IOydtOqxsCDsg4jroZzsmrQg7Yq466as64OQP1wiLG5ld1RyZWVEYXRhKVxuICAgICAgICAgICAgICAgIHJldHVybiBuZXdUcmVlRGF0YTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IHJlbG9hZFRyZWUgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3VHJlZURhdGEgPSBjcmVhdGVUcmVlRGF0YU9iamVjdCgpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi7JW8IOuCmOyZgOudvCBuZXdUcmVlRGF0YVwiLG5ld1RyZWVEYXRhKVxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJyZWxvYWRcIixcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogbmV3VHJlZURhdGFcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IHVwZGF0ZVRyZWUgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3VHJlZURhdGEgPSBjcmVhdGVUcmVlRGF0YU9iamVjdCgpO1xuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJ1cGRhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogbmV3VHJlZURhdGEsXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZWROb2RlSURzOiBkYXRhLmRlbGV0ZWROb2RlSURzXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAobG9nVG9Db25zb2xlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEubm9kZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nTWVzc2FnZVRvQ29uc29sZShcIlJlY2VpdmVkIFwiICsgZGF0YS5ub2Rlcy5sZW5ndGggKyBcIiBub2RlcywgYWN0aW9uOiBcIiArIGRhdGEuYWN0aW9uKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsb2dNZXNzYWdlVG9Db25zb2xlKFwiUmVjZWl2ZWQgbm8gbm9kZXMsIGFjdGlvbjogXCIgKyBkYXRhLmFjdGlvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChkdW1wU2VydmljZVJlc3BvbnNlSW5Db25zb2xlKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvZ01lc3NhZ2VUb0NvbnNvbGUoXCJSZWNlaXZlZCBzZXJ2aWNlIHJlc3BvbnNlOlwiKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5pbmZvKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzd2l0Y2ggKGRhdGEuYWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcInJlbG9hZFwiOlxuICAgICAgICAgICAgICAgICAgICByZWxvYWRUcmVlKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgXCJ1cGRhdGVcIjpcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlVHJlZShkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIFwiZm9jdXNcIjpcbiAgICAgICAgICAgICAgICAgICAgLy8gTm8gc3BlY2lmaWMgbG9naWMsIGZvY3VzIGlzIGhhbmRsZWQgd2hlbmV2ZXIgdGhlIGZvY3VzTm9kZUlEIGlzIHJldHVybmVkLiBGb2N1cyBhY3Rpb24gaXMgYWRkZWQgdG8gYWxsb3cgc2V0dGluZyBmb2N1cyBvbmx5LlxuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgXCJub25lXCI6XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiIFJlYWN0IGNvbXBsZXggdHJlZSB1bmtub3duIGFjdGlvbjogXCIgKyBkYXRhLmFjdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gRm9jdXMgYW5kIHNlbGVjdCBpdGVtIGlmIHJlcXVlc3RlZC5cbiAgICAgICAgICAgIGlmIChkYXRhLmZvY3VzTm9kZUlEKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxvZ1RvQ29uc29sZSkge1xuICAgICAgICAgICAgICAgICAgICBsb2dNZXNzYWdlVG9Db25zb2xlKFwiU2V0IGZvY3VzIHRvIFwiICsgZGF0YS5mb2N1c05vZGVJRCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNldEZvY3VzZWRJdGVtKGRhdGEuZm9jdXNOb2RlSUQpO1xuICAgICAgICAgICAgICAgIHNldFNlbGVjdGVkSXRlbXMoW2RhdGEuZm9jdXNOb2RlSURdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRXhwYW5kIGl0ZW1zIGlmIHJlcXVlc3RlZC5cbiAgICAgICAgICAgIGlmIChkYXRhLmV4cGFuZEl0ZW1JRHMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBleHBhbmRJdGVtSURBcnJheSA9IGRhdGEuZXhwYW5kSXRlbUlEcy5zcGxpdChcIixcIik7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEucmVzZXRFeHBhbmRlZEl0ZW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIE9ubHkgZXhwYW5kIHRoZSByZXF1ZXN0ZWQgaXRlbXNcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvZ1RvQ29uc29sZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nTWVzc2FnZVRvQ29uc29sZShcIkV4cGFuZCBvbmx5IGl0ZW1zIFwiICsgZGF0YS5leHBhbmRJdGVtSURzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzZXRFeHBhbmRlZEl0ZW1zKGV4cGFuZEl0ZW1JREFycmF5KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBFeHBhbmQgdGhlIHJlcXVlc3RlZCBpdGVtcyBpbiBhZGRpdGlvbiB0byBhbnkgYWxyZWFkeSBleHBhbmRlZCBpdGVtc1xuICAgICAgICAgICAgICAgICAgICBpZiAobG9nVG9Db25zb2xlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dNZXNzYWdlVG9Db25zb2xlKFwiRXhwYW5kIGl0ZW1zIFwiICsgZGF0YS5leHBhbmRJdGVtSURzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzZXRFeHBhbmRlZEl0ZW1zKFsuLi5leHBhbmRlZEl0ZW1zLCAuLi5leHBhbmRJdGVtSURBcnJheV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEucmVzZXRFeHBhbmRlZEl0ZW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIENsZWFyIGV4cGFuZGVkIHN0YXRlLCBjYXVzaW5nIGFsbCBub2RlcyB0byBiZSBjb2xsYXBzZWRcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvZ1RvQ29uc29sZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nTWVzc2FnZVRvQ29uc29sZShcIlJlc2V0IGV4cGFuZGVkIHN0YXRlLCBjb2xsYXBzZSBhbGwgbm9kZXNcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc2V0RXhwYW5kZWRJdGVtcyhbXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChkYXRhQ2hhbmdlZERhdGUpIHtcbiAgICAgICAgICAgIGlmIChsb2dUb0NvbnNvbGUpIHtcbiAgICAgICAgICAgICAgICBsb2dNZXNzYWdlVG9Db25zb2xlKFwiRGF0YSBjaGFuZ2VkIGRhdGU6IFwiICsgZGF0YUNoYW5nZWREYXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChsb2dUb0NvbnNvbGUpIHtcbiAgICAgICAgICAgICAgICBsb2dNZXNzYWdlVG9Db25zb2xlKFwiRGF0YSBjaGFuZ2VkIGRhdGUgbm90IHNldFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEV2ZW4gdGhvdWdoIHRoZSBkZXBlbmRlbmNpZXMgZGlkIG5vdCBjaGFuZ2UsIHRoZSBlZmZlY3QgZ290IGNhbGxlZCB3YXkgdG9vIG9mdGVuLlxuICAgICAgICAvLyBEb3VibGUgY2hlY2tlZCBieSBsb2dnaW5nIHRoZSBkZXBlbmRlbmNpZXMgYW5kIGNvbXBhcmluZyB0aGVtIGFzIG1lbnRpb25lZCBpbiB0aGUgUmVhY3QgdXNlRWZmZWN0IGRvY3VtZW50YXRpb24uXG4gICAgICAgIC8vIEtlZXAgdHJhY2sgb2YgZGF0YUNoYW5nZWREYXRlIGluIHRoZSByZWR1Y2VyIGFuZCBvbmx5IGNhbGwgdGhlIHNlcnZpY2UgaWYgdGhlIGRhdGUgcmVhbGx5IGlzIGRpZmZlcmVudC5cbiAgICAgICAgaWYgKGRhdGFDaGFuZ2VkRGF0ZS5nZXRUaW1lKCkgPT09IHRyZWVEYXRhPy5kYXRhQ2hhbmdlZERhdGUuZ2V0VGltZSgpKSB7XG4gICAgICAgICAgICBpZiAobG9nVG9Db25zb2xlKSB7XG4gICAgICAgICAgICAgICAgbG9nTWVzc2FnZVRvQ29uc29sZShcIkRhdGEgY2hhbmdlZCBkYXRlIHN0aWxsIHRoZSBzYW1lXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsb2dUb0NvbnNvbGUpIHtcbiAgICAgICAgICAgIGxvZ01lc3NhZ2VUb0NvbnNvbGUoXCJEYXRhIGNoYW5nZWQgZGF0ZSBjaGFuZ2VkXCIpO1xuICAgICAgICB9XG4gICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICAgIHR5cGU6IFwic2V0RGF0YUNoYW5nZWREYXRlXCIsXG4gICAgICAgICAgICBkYXRhQ2hhbmdlZERhdGU6IGRhdGFDaGFuZ2VkRGF0ZVxuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgc2VydmljZVVybExvY2FsID0gc2VydmljZVVybDtcbiAgICAgICAgaWYgKHNlcnZpY2VVcmxMb2NhbCkge1xuICAgICAgICAgICAgaWYgKCF0cmVlRGF0YT8uZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgaWYgKGxvZ1RvQ29uc29sZSkge1xuICAgICAgICAgICAgICAgICAgICBsb2dNZXNzYWdlVG9Db25zb2xlKFwiTm8gdHJlZSBkYXRhLCByZXF1ZXN0IGZ1bGwgcmVsb2FkXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoc2VydmljZVVybExvY2FsLmluY2x1ZGVzKFwiP1wiKSkge1xuICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlVXJsTG9jYWwgKz0gXCImXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2VydmljZVVybExvY2FsICs9IFwiP1wiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZXJ2aWNlVXJsTG9jYWwgKz0gXCJmdWxscmVsb2FkPXRydWVcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChsb2dUb0NvbnNvbGUpIHtcbiAgICAgICAgICAgICAgICBsb2dNZXNzYWdlVG9Db25zb2xlKFwiQ2FsbCBzZXJ2aWNlIHVzaW5nIFVSTDogXCIgKyBzZXJ2aWNlVXJsTG9jYWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGxvZ1RvQ29uc29sZSkge1xuICAgICAgICAgICAgICAgIGxvZ01lc3NhZ2VUb0NvbnNvbGUoXCJTZXJ2aWNlIFVSTCBoYXMgbm8gdmFsdWVcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coXCLslbwg66+47Lmc7J246rCE7JWEIOydtOugh+qyjCDsgrTqsbDslbw/XCIsIHdpbmRvdy5teC5zZXNzaW9uKVxuICAgICAgICBjb25zdCB0b2tlbiA9IHdpbmRvdy5teC5zZXNzaW9uLmdldENvbmZpZyhcImNzcmZ0b2tlblwiKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJ0b2tlblwiLCB0b2tlbilcbiAgICAgICAgd2luZG93XG4gICAgICAgICAgICAuZmV0Y2goc2VydmljZVVybExvY2FsLCB7XG4gICAgICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwiaW5jbHVkZVwiLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJYLUNzcmYtVG9rZW5cIjogdG9rZW4sXG4gICAgICAgICAgICAgICAgICAgIEFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVzcG9uc2Ug7J206rGwIO2ZleyduO2VnOuLpCDsobDsi6ztlbTrnbxcIilcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UuanNvbigpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIuydtOqxsCDthrXqs7ztlanri4jquYw/IHJlc3BvbnNl64OQXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9jZXNzRGF0YUZyb21TZXJ2aWNlKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJjcmVhdGVUcmVlRGF0YU9iamVjdOyXkCDsoITri6zrkJwg642w7J207YSwOlwiLCBKU09OLnN0cmluZ2lmeShkYXRhLCBudWxsLCAyKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImRhdGFcIiwgZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiQ2FsbCB0byBVUkwgXCIgKyBzZXJ2aWNlVXJsTG9jYWwgKyBcIiBmYWlsZWQ6IFwiICsgcmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgfSwgW1xuICAgICAgICBkYXRhQ2hhbmdlZERhdGUsXG4gICAgICAgIHNlcnZpY2VVcmwsXG4gICAgICAgIGxvZ01lc3NhZ2VUb0NvbnNvbGUsXG4gICAgICAgIGxvZ1RvQ29uc29sZSxcbiAgICAgICAgZHVtcFNlcnZpY2VSZXNwb25zZUluQ29uc29sZSxcbiAgICAgICAgdHJlZURhdGEsXG4gICAgICAgIGV4cGFuZGVkSXRlbXNcbiAgICBdKTtcblxuICAgIGNvbnN0IGNsYXNzTmFtZSA9IFwicmVhY3QtY29tcGxleC10cmVlLXdpZGdldCBcIiArIHdpZGdldENsYXNzTmFtZTtcblxuICAgIGlmICghdHJlZURhdGE/LmRhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCLtirjrpqzrjbDsnbTthLAg7Ya16rO87Jes67aAIO2ZleyduOykkeyeheuLiOuLpFwiKVxuICAgICAgICBpZiAobG9nVG9Db25zb2xlKSB7XG4gICAgICAgICAgICBsb2dNZXNzYWdlVG9Db25zb2xlKFwiTm8gdHJlZSBkYXRhXCIpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKFwiY2xhc3NOYW1lXCIsY2xhc3NOYW1lKTtcbiAgICAgICAgY29uc29sZS5sb2coXCIhdHJlZURhdGE/LmRhdGFcIiwhdHJlZURhdGE/LmRhdGEpO1xuICAgICAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9e2NsYXNzTmFtZSArIFwiIG5vZGF0YVwifT48L2Rpdj47XG4gICAgfVxuXG4gICAgY29uc3QgdHJlZU5hbWUgPSBcInRyZWUtXCIgKyB3aWRnZXROYW1lO1xuICAgIGNvbnN0IGludGVyYWN0aW9uTW9kZSA9IHRvZ2dsZUV4cGFuZGVkSWNvbk9ubHkgPyBcImNsaWNrLWFycm93LXRvLWV4cGFuZFwiIDogXCJjbGljay1pdGVtLXRvLWV4cGFuZFwiO1xuXG4gICAgY29uc29sZS5sb2coXCLtirjrpqwg642w7J207YSwIENISUxEIOydtOumhFwiLCB0cmVlTmFtZSlcbiAgICBjb25zb2xlLmxvZyhcIu2KuOumrCDrjbDsnbTthLAgQ0hJTEQg6rCSXCIsIHRyZWVEYXRhPy5kYXRhKVxuICAgIFxuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc05hbWV9PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0cmVlLXdpZGdldC1idXR0b24tY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImJ1dHRvbkNvbGxhcHNlQWxsXCIgY2xhc3NOYW1lPXtjb2xsYXBzZUFsbEJ1dHRvbkNsYXNzfSBvbkNsaWNrPXtvbkNvbGxhcHNlQWxsQnV0dG9uQ2xpY2t9PlxuICAgICAgICAgICAgICAgICAgICB7Y29sbGFwc2VBbGxCdXR0b25JY29uICYmIDxJY29uIGljb249e2NvbGxhcHNlQWxsQnV0dG9uSWNvbn0gLz59XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuPntjb2xsYXBzZUFsbEJ1dHRvbkNhcHRpb24gPyBjb2xsYXBzZUFsbEJ1dHRvbkNhcHRpb24gOiBcIlwifTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICB7c2hvd0V4cGFuZEFsbEJ1dHRvbiAmJiAoXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJidXR0b25FeHBhbmRBbGxcIiBjbGFzc05hbWU9e2V4cGFuZEFsbEJ1dHRvbkNsYXNzfSBvbkNsaWNrPXtvbkV4cGFuZEFsbEJ1dHRvbkNsaWNrfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtleHBhbmRBbGxCdXR0b25JY29uICYmIDxJY29uIGljb249e2V4cGFuZEFsbEJ1dHRvbkljb259IC8+fVxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+e2V4cGFuZEFsbEJ1dHRvbkNhcHRpb24gPyBleHBhbmRBbGxCdXR0b25DYXB0aW9uIDogXCJcIn08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxDb250cm9sbGVkVHJlZUVudmlyb25tZW50XG4gICAgICAgICAgICAgICAgaXRlbXM9e3RyZWVEYXRhLmRhdGF9XG4gICAgICAgICAgICAgICAgZ2V0SXRlbVRpdGxlPXtyZW5kZXJJdGVtVGl0bGV9XG4gICAgICAgICAgICAgICAgLy8ge2l0ZW0gPT4gaXRlbS5kYXRhLm5hbWV9XG4gICAgICAgICAgICAgICAgdmlld1N0YXRlPXt7XG4gICAgICAgICAgICAgICAgICAgIFt0cmVlTmFtZV06IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvY3VzZWRJdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXhwYW5kZWRJdGVtcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkSXRlbXNcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgZGVmYXVsdEludGVyYWN0aW9uTW9kZT17aW50ZXJhY3Rpb25Nb2RlfVxuICAgICAgICAgICAgICAgIGNhblJlbmFtZT17YWxsb3dOb2RlUmVuYW1lfVxuICAgICAgICAgICAgICAgIGNhbkRyYWdBbmREcm9wPXthbGxvd0RyYWdSZW9yZGVyaW5nIHx8IGFsbG93RHJhZ01vdmV9XG4gICAgICAgICAgICAgICAgY2FuUmVvcmRlckl0ZW1zPXthbGxvd0RyYWdSZW9yZGVyaW5nfVxuICAgICAgICAgICAgICAgIGNhbkRyb3BPbkZvbGRlcj17YWxsb3dEcmFnTW92ZX1cbiAgICAgICAgICAgICAgICBjYW5Ecm9wT25Ob25Gb2xkZXI9e2FsbG93RHJhZ01vdmV9XG4gICAgICAgICAgICAgICAgb25Gb2N1c0l0ZW09e2l0ZW0gPT4gc2V0Rm9jdXNlZEl0ZW0oaXRlbS5pbmRleCl9XG4gICAgICAgICAgICAgICAgb25FeHBhbmRJdGVtPXtvbkV4cGFuZEl0ZW1IYW5kbGVyfVxuICAgICAgICAgICAgICAgIG9uQ29sbGFwc2VJdGVtPXtpdGVtID0+XG4gICAgICAgICAgICAgICAgICAgIHNldEV4cGFuZGVkSXRlbXMoZXhwYW5kZWRJdGVtcy5maWx0ZXIoZXhwYW5kZWRJdGVtSW5kZXggPT4gZXhwYW5kZWRJdGVtSW5kZXggIT09IGl0ZW0uaW5kZXgpKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvblNlbGVjdEl0ZW1zPXtvblNlbGVjdGlvbkNoYW5nZWRIYW5kbGVyfVxuICAgICAgICAgICAgICAgIG9uUmVuYW1lSXRlbT17b25SZW5hbWVOb2RlSGFuZGxlcn1cbiAgICAgICAgICAgICAgICBjYW5EcmFnPXtjYW5EcmFnSGFuZGxlcn1cbiAgICAgICAgICAgICAgICBjYW5Ecm9wQXQ9e2NhbkRyb3BBdEhhbmRsZXJ9XG4gICAgICAgICAgICAgICAgb25Ecm9wPXtvbkRyb3BIYW5kbGVyfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxUcmVlIHRyZWVJZD17dHJlZU5hbWV9IHJvb3RJdGVtPVwicm9vdFwiIC8+XG4gICAgICAgICAgICA8L0NvbnRyb2xsZWRUcmVlRW52aXJvbm1lbnQ+XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby10cmFpbGluZy1zcGFjZXMgKi9cbi8qIGVzbGludC1kaXNhYmxlIHByZXR0aWVyL3ByZXR0aWVyICovXG5pbXBvcnQgeyBjcmVhdGVFbGVtZW50LCB1c2VDYWxsYmFjayB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgVHJlZUNvbnRhaW5lciB9IGZyb20gXCIuL2NvbXBvbmVudHMvVHJlZUNvbnRhaW5lclwiO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgc29ydC1pbXBvcnRzXG5pbXBvcnQgXCJyZWFjdC1jb21wbGV4LXRyZWUvbGliL3N0eWxlLW1vZGVybi5jc3NcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWN0Q29tcGxleFRyZWVXaWRnZXQocHJvcHMpIHtcbiAgICBjb25zdCBsb2dNZXNzYWdlVG9Db25zb2xlID0gdXNlQ2FsbGJhY2soXG4gICAgICAgIG1lc3NhZ2UgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKHByb3BzLm5hbWUgKyBcIiBcIiArIG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSArIFwiIFwiICsgbWVzc2FnZSk7XG4gICAgICAgIH0sXG4gICAgICAgIFtwcm9wcy5uYW1lXVxuICAgICk7XG5cbiAgICBjb25zdCB7IG9uU2VsZWN0aW9uQ2hhbmdlZEFjdGlvbiwgc2VsZWN0ZWROb2RlSURzQXR0ciB9ID0gcHJvcHM7XG5cbiAgICBjb25zdCBvblNlbGVjdGlvbkNoYW5nZWRIYW5kbGVyID0gdXNlQ2FsbGJhY2soXG4gICAgICAgIHNlbGVjdGVkSXRlbUlEcyA9PiB7XG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWROb2RlSURzQXR0ciAmJiBzZWxlY3RlZE5vZGVJRHNBdHRyLnN0YXR1cyA9PT0gXCJhdmFpbGFibGVcIikge1xuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZE5vZGVJRHNBdHRyLnJlYWRPbmx5KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIlJlYWN0Q29tcGxleFRyZWVXaWRnZXQ6IFNlbGVjdGVkIG5vZGUgSURzIGF0dHJpYnV0ZSBpcyByZWFkb25seVwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZE5vZGVJRHNBdHRyLnNldFZhbHVlKHNlbGVjdGVkSXRlbUlEcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIG9uU2VsZWN0aW9uQ2hhbmdlZEFjdGlvbiAmJlxuICAgICAgICAgICAgICAgIG9uU2VsZWN0aW9uQ2hhbmdlZEFjdGlvbi5jYW5FeGVjdXRlICYmXG4gICAgICAgICAgICAgICAgIW9uU2VsZWN0aW9uQ2hhbmdlZEFjdGlvbi5pc0V4ZWN1dGluZ1xuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgb25TZWxlY3Rpb25DaGFuZ2VkQWN0aW9uLmV4ZWN1dGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgW29uU2VsZWN0aW9uQ2hhbmdlZEFjdGlvbiwgc2VsZWN0ZWROb2RlSURzQXR0cl1cbiAgICApO1xuXG4gICAgY29uc3QgeyBvbk1pc3NpbmdOb2Rlc0FjdGlvbiwgbWlzc2luZ05vZGVJRHNBdHRyIH0gPSBwcm9wcztcblxuICAgIGNvbnN0IG9uTWlzc2luZ05vZGVzSGFuZGxlciA9IHVzZUNhbGxiYWNrKFxuICAgICAgICBtaXNzaW5nSXRlbUlEcyA9PiB7XG4gICAgICAgICAgICBpZiAobWlzc2luZ05vZGVJRHNBdHRyICYmIG1pc3NpbmdOb2RlSURzQXR0ci5zdGF0dXMgPT09IFwiYXZhaWxhYmxlXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAobWlzc2luZ05vZGVJRHNBdHRyLnJlYWRPbmx5KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIlJlYWN0Q29tcGxleFRyZWVXaWRnZXQ6IE1pc3Npbmcgbm9kZSBJRHMgYXR0cmlidXRlIGlzIHJlYWRvbmx5XCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG1pc3NpbmdOb2RlSURzQXR0ci5zZXRWYWx1ZShtaXNzaW5nSXRlbUlEcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9uTWlzc2luZ05vZGVzQWN0aW9uICYmIG9uTWlzc2luZ05vZGVzQWN0aW9uLmNhbkV4ZWN1dGUgJiYgIW9uTWlzc2luZ05vZGVzQWN0aW9uLmlzRXhlY3V0aW5nKSB7XG4gICAgICAgICAgICAgICAgb25NaXNzaW5nTm9kZXNBY3Rpb24uZXhlY3V0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBbbWlzc2luZ05vZGVJRHNBdHRyLCBvbk1pc3NpbmdOb2Rlc0FjdGlvbl1cbiAgICApO1xuXG4gICAgY29uc3QgeyBvbk5vZGVSZW5hbWVkQWN0aW9uLCByZW5hbWVkTm9kZUlEQXR0ciwgbmV3Tm9kZU5hbWVBdHRyIH0gPSBwcm9wcztcblxuICAgIGNvbnN0IG9uTm9kZVJlbmFtZWRIYW5kbGVyID0gdXNlQ2FsbGJhY2soXG4gICAgICAgIChub2RlSUQsIG5ld05hbWUpID0+IHtcbiAgICAgICAgICAgIGlmIChyZW5hbWVkTm9kZUlEQXR0ciAmJiByZW5hbWVkTm9kZUlEQXR0ci5zdGF0dXMgPT09IFwiYXZhaWxhYmxlXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVuYW1lZE5vZGVJREF0dHIucmVhZE9ubHkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiUmVhY3RDb21wbGV4VHJlZVdpZGdldDogRXZlbnQgbm9kZSBJRCBhdHRyaWJ1dGUgaXMgcmVhZG9ubHlcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVuYW1lZE5vZGVJREF0dHIuc2V0VmFsdWUobm9kZUlEKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobmV3Tm9kZU5hbWVBdHRyICYmIG5ld05vZGVOYW1lQXR0ci5zdGF0dXMgPT09IFwiYXZhaWxhYmxlXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAobmV3Tm9kZU5hbWVBdHRyLnJlYWRPbmx5KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIlJlYWN0Q29tcGxleFRyZWVXaWRnZXQ6IEV2ZW50IG5vZGUgSUQgYXR0cmlidXRlIGlzIHJlYWRvbmx5XCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld05vZGVOYW1lQXR0ci5zZXRWYWx1ZShuZXdOYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChvbk5vZGVSZW5hbWVkQWN0aW9uICYmIG9uTm9kZVJlbmFtZWRBY3Rpb24uY2FuRXhlY3V0ZSAmJiAhb25Ob2RlUmVuYW1lZEFjdGlvbi5pc0V4ZWN1dGluZykge1xuICAgICAgICAgICAgICAgIG9uTm9kZVJlbmFtZWRBY3Rpb24uZXhlY3V0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBbcmVuYW1lZE5vZGVJREF0dHIsIG5ld05vZGVOYW1lQXR0ciwgb25Ob2RlUmVuYW1lZEFjdGlvbl1cbiAgICApO1xuICAgIC8vIOuTnOuemOq3uCDslaQg65Oc656NXG4gICAgY29uc3QgeyBvbkRyb3BBY3Rpb24sIGRyYWdnZWROb2RlSURzQXR0ciwgZHJvcFRhcmdldEF0dHIgfSA9IHByb3BzO1xuXG4gICAgY29uc3Qgb25Ecm9wSGFuZGxlciA9IHVzZUNhbGxiYWNrKFxuICAgICAgICAoZHJvcHBlZE5vZGVJRHMsIHRhcmdldCkgPT4ge1xuICAgICAgICAgICAgaWYgKGRyYWdnZWROb2RlSURzQXR0ciAmJiBkcmFnZ2VkTm9kZUlEc0F0dHIuc3RhdHVzID09PSBcImF2YWlsYWJsZVwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRyYWdnZWROb2RlSURzQXR0ci5yZWFkT25seSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJSZWFjdENvbXBsZXhUcmVlV2lkZ2V0OiBEcmFnZ2VkIG5vZGUgSURzIGF0dHJpYnV0ZSBpcyByZWFkb25seVwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkcmFnZ2VkTm9kZUlEc0F0dHIuc2V0VmFsdWUoZHJvcHBlZE5vZGVJRHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkcm9wVGFyZ2V0QXR0ciAmJiBkcm9wVGFyZ2V0QXR0ci5zdGF0dXMgPT09IFwiYXZhaWxhYmxlXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoZHJvcFRhcmdldEF0dHIucmVhZE9ubHkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiUmVhY3RDb21wbGV4VHJlZVdpZGdldDogRHJvcCB0YXJnZXQgSUQgYXR0cmlidXRlIGlzIHJlYWRvbmx5XCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGRyb3BUYXJnZXRBdHRyLnNldFZhbHVlKEpTT04uc3RyaW5naWZ5KHRhcmdldCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvbkRyb3BBY3Rpb24gJiYgb25Ecm9wQWN0aW9uLmNhbkV4ZWN1dGUgJiYgIW9uRHJvcEFjdGlvbi5pc0V4ZWN1dGluZykge1xuICAgICAgICAgICAgICAgIG9uRHJvcEFjdGlvbi5leGVjdXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFtkcmFnZ2VkTm9kZUlEc0F0dHIsIGRyb3BUYXJnZXRBdHRyLCBvbkRyb3BBY3Rpb25dXG4gICAgKTtcbiAgXG4gICAgY29uc29sZS5sb2coXCLsnbTqsbQg7YWM7Iqk7Yq4IOyeheuLiOuLpC4g7Jqw65GQ66i466asXCIsIHByb3BzKVxuICAgIGNvbnNvbGUubG9nKFwi7J206rG0IO2FjOyKpO2KuCDsnoXri4jri6QuIOydtOumhFwiLCBwcm9wcy5uYW1lKVxuICAgIGNvbnNvbGUubG9nKFwi7J206rG0IO2FjOyKpO2KuCDsnoXri4jri6QuIOuzgOqyveuQmOuKlCDrjbDsnbTthLBcIiwgcHJvcHMuZGF0YUNoYW5nZURhdGVBdHRyKVxuICAgIGNvbnNvbGUubG9nKFwi7J206rG0IO2FjOyKpO2KuCDsnoXri4jri6QuIOuTnOuemOq3uCDsm4Dsp4HsnoRcIiwgcHJvcHMuYWxsb3dEcmFnTW92ZSlcbiAgICBjb25zb2xlLmxvZyhcIuydtOqxtCDthYzsiqTtirgg7J6F64uI64ukLiDslYTsnbTsvZgg7Yag6riAIO2BtOumreumrVwiLCBwcm9wcy50b2dnbGVFeHBhbmRlZEljb25Pbmx5KVxuICAgIFxuICAgIHJldHVybiAoXG4gICAgICAgIDxUcmVlQ29udGFpbmVyXG4gICAgICAgICAgICBkYXRhQ2hhbmdlZERhdGU9e3Byb3BzLmRhdGFDaGFuZ2VEYXRlQXR0ci52YWx1ZX1cbiAgICAgICAgICAgIHNlcnZpY2VVcmw9e3Byb3BzLnNlcnZpY2VVcmwudmFsdWV9XG4gICAgICAgICAgICB3aWRnZXROYW1lPXtwcm9wcy5uYW1lfVxuICAgICAgICAgICAgd2lkZ2V0Q2xhc3NOYW1lPXtwcm9wcy5jbGFzc31cbiAgICAgICAgICAgIHRvZ2dsZUV4cGFuZGVkSWNvbk9ubHk9e3Byb3BzLnRvZ2dsZUV4cGFuZGVkSWNvbk9ubHl9XG4gICAgICAgICAgICBhbGxvd05vZGVSZW5hbWU9e3Byb3BzLmFsbG93Tm9kZVJlbmFtZX1cbiAgICAgICAgICAgIGFsbG93RHJhZ1Jlb3JkZXJpbmc9e3Byb3BzLmFsbG93RHJhZ1Jlb3JkZXJpbmd9XG4gICAgICAgICAgICBhbGxvd0RyYWdNb3ZlPXtwcm9wcy5hbGxvd0RyYWdNb3ZlfVxuICAgICAgICAgICAgY29sbGFwc2VBbGxCdXR0b25JY29uPXtwcm9wcy5jb2xsYXBzZUFsbEJ1dHRvbkljb24/LnZhbHVlfVxuICAgICAgICAgICAgY29sbGFwc2VBbGxCdXR0b25DYXB0aW9uPXtwcm9wcy5jb2xsYXBzZUFsbEJ1dHRvbkNhcHRpb24/LnZhbHVlfVxuICAgICAgICAgICAgY29sbGFwc2VBbGxCdXR0b25DbGFzcz17cHJvcHMuY29sbGFwc2VBbGxCdXR0b25DbGFzc31cbiAgICAgICAgICAgIHNob3dFeHBhbmRBbGxCdXR0b249eyEhcHJvcHMuc2hvd0V4cGFuZEFsbEJ1dHRvbj8udmFsdWV9XG4gICAgICAgICAgICBleHBhbmRBbGxCdXR0b25JY29uPXtwcm9wcy5leHBhbmRBbGxCdXR0b25JY29uPy52YWx1ZX1cbiAgICAgICAgICAgIGV4cGFuZEFsbEJ1dHRvbkNhcHRpb249e3Byb3BzLmV4cGFuZEFsbEJ1dHRvbkNhcHRpb24/LnZhbHVlfVxuICAgICAgICAgICAgZXhwYW5kQWxsQnV0dG9uQ2xhc3M9e3Byb3BzLmV4cGFuZEFsbEJ1dHRvbkNsYXNzfVxuICAgICAgICAgICAgb25TZWxlY3Rpb25DaGFuZ2VkPXtvblNlbGVjdGlvbkNoYW5nZWRIYW5kbGVyfVxuICAgICAgICAgICAgb25NaXNzaW5nTm9kZXM9e29uTWlzc2luZ05vZGVzSGFuZGxlcn1cbiAgICAgICAgICAgIG9uTm9kZVJlbmFtZWQ9e29uTm9kZVJlbmFtZWRIYW5kbGVyfVxuICAgICAgICAgICAgb25Ecm9wPXtvbkRyb3BIYW5kbGVyfVxuICAgICAgICAgICAgbG9nTWVzc2FnZVRvQ29uc29sZT17bG9nTWVzc2FnZVRvQ29uc29sZX1cbiAgICAgICAgICAgIGxvZ1RvQ29uc29sZT17cHJvcHMubG9nVG9Db25zb2xlfVxuICAgICAgICAgICAgZHVtcFNlcnZpY2VSZXNwb25zZUluQ29uc29sZT17cHJvcHMuZHVtcFNlcnZpY2VSZXNwb25zZUluQ29uc29sZX1cbiAgICAgICAgLz5cbiAgICApO1xufVxuIl0sIm5hbWVzIjpbIkludGVyYWN0aW9uTW9kZSIsIl9fYXNzaWduIiwidGhpcyIsIk9iamVjdCIsImFzc2lnbiIsInQiLCJzIiwiaSIsIm4iLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJwIiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwiYXBwbHkiLCJtZXJnZUludGVyYWN0aW9uTWFuYWdlcnMiLCJtYWluIiwiZmFsbGJhY2siLCJtb2RlIiwiY3JlYXRlSW50ZXJhY3RpdmVFbGVtZW50UHJvcHMiLCJpdGVtIiwidHJlZUlkIiwiYWN0aW9ucyIsInJlbmRlckZsYWdzIiwiaXNDb250cm9sS2V5IiwiZSIsImN0cmxLZXkiLCJuYXZpZ2F0b3IiLCJwbGF0Zm9ybSIsInRvVXBwZXJDYXNlIiwiaW5kZXhPZiIsIm1ldGFLZXkiLCJEb3VibGVDbGlja0l0ZW1Ub0V4cGFuZEludGVyYWN0aW9uTWFuYWdlciIsImVudmlyb25tZW50IiwiRG91YmxlQ2xpY2tJdGVtVG9FeHBhbmQiLCJfdGhpcyIsIm9uQ2xpY2siLCJmb2N1c0l0ZW0iLCJzaGlmdEtleSIsInNlbGVjdFVwVG8iLCJpc1NlbGVjdGVkIiwidW5zZWxlY3RJdGVtIiwiYWRkVG9TZWxlY3RlZEl0ZW1zIiwic2VsZWN0SXRlbSIsIm9uRG91YmxlQ2xpY2siLCJpc0ZvbGRlciIsInRvZ2dsZUV4cGFuZGVkU3RhdGUiLCJjYW5JbnZva2VQcmltYXJ5QWN0aW9uT25JdGVtQ29udGFpbmVyIiwicHJpbWFyeUFjdGlvbiIsIm9uRm9jdXMiLCJvbkRyYWdTdGFydCIsImRhdGFUcmFuc2ZlciIsImRyb3BFZmZlY3QiLCJzdGFydERyYWdnaW5nIiwib25EcmFnT3ZlciIsInByZXZlbnREZWZhdWx0IiwiZHJhZ2dhYmxlIiwiY2FuRHJhZyIsImlzUmVuYW1pbmciLCJ0YWJJbmRleCIsImlzRm9jdXNlZCIsInVuZGVmaW5lZCIsIkNsaWNrSXRlbVRvRXhwYW5kSW50ZXJhY3Rpb25NYW5hZ2VyIiwiQ2xpY2tJdGVtVG9FeHBhbmQiLCJDbGlja0Fycm93VG9FeHBhbmRJbnRlcmFjdGlvbk1hbmFnZXIiLCJidWlsZEludGVyYWN0aW9uTW9kZSIsIkNsaWNrQXJyb3dUb0V4cGFuZCIsIkVycm9yIiwiY29uY2F0IiwiSW50ZXJhY3Rpb25NYW5hZ2VyQ29udGV4dCIsIlJlYWN0IiwiY3JlYXRlQ29udGV4dCIsInVzZUludGVyYWN0aW9uTWFuYWdlciIsInVzZUNvbnRleHQiLCJJbnRlcmFjdGlvbk1hbmFnZXJQcm92aWRlciIsIl9hIiwiY2hpbGRyZW4iLCJ1c2VUcmVlRW52aXJvbm1lbnQiLCJkZWZhdWx0SW50ZXJhY3Rpb25Nb2RlIiwiaW50ZXJhY3Rpb25NYW5hZ2VyIiwidXNlTWVtbyIsImV4dGVuZHMiLCJjcmVhdGVFbGVtZW50IiwiUHJvdmlkZXIiLCJ2YWx1ZSIsInVzZUNhbkRyb3BBdCIsInVzZUNhbGxiYWNrIiwiZHJhZ2dpbmdQb3NpdGlvbiIsImRyYWdnaW5nSXRlbXMiLCJ0YXJnZXRUeXBlIiwiY2FuUmVvcmRlckl0ZW1zIiwiY2FuRHJvcE9uRm9sZGVyIiwicmVzb2x2ZWRJdGVtIiwiaXRlbXMiLCJ0YXJnZXRJdGVtIiwiY2FuRHJvcE9uTm9uRm9sZGVyIiwic29tZSIsImRyYWdnaW5nSXRlbSIsImluZGV4IiwiY2FuRHJvcEF0IiwidXNlR2V0R2V0UGFyZW50T2ZMaW5lYXJJdGVtIiwiaXRlbUxpbmVhckluZGV4IiwibGluZWFySXRlbXMiLCJkZXB0aCIsInBhcmVudExpbmVhckluZGV4IiwicGFyZW50IiwidHJlZXMiLCJyb290SXRlbSIsInVzZUdldFZpYWJsZURyYWdQb3NpdGlvbnMiLCJnZXRQYXJlbnRPZkxpbmVhckl0ZW0iLCJpc0Rlc2NlbmRhbnQiLCJwb3RlbnRpYWxQYXJlbnRzIiwiX2IiLCJ0YXJnZXRzIiwic2tpcFVudGlsRGVwdGhJc0xvd2VyVGhhbiIsImxpbmVhckluZGV4IiwiX2MiLCJwYXJlbnRfMSIsImNoaWxkSW5kZXgiLCJpdGVtUG9zaXRpb24iLCJwYXJlbnRJdGVtIiwidG9wUG9zaXRpb24iLCJsaW5lUG9zaXRpb24iLCJib3R0b21Qb3NpdGlvbiIsInNraXBUb3BQb3NpdGlvbiIsInB1c2giLCJfX3NwcmVhZEFycmF5IiwidG8iLCJmcm9tIiwicGFjayIsImwiLCJhciIsIkFycmF5Iiwic2xpY2UiLCJ1c2VTaWRlRWZmZWN0IiwiZWZmZWN0IiwiZGVwcyIsImNoYW5nZU9uIiwicHJldmlvdXNSZWYiLCJ1c2VSZWYiLCJ1c2VFZmZlY3QiLCJjdXJyZW50IiwiY2hhbmdlZCIsInYiLCJidWlsZE1hcEZvclRyZWVzIiwidHJlZUlkcyIsImJ1aWxkIiwibWFwIiwiaWQiLCJyZWR1Y2UiLCJhIiwib2JqIiwiZ2V0RG9jdW1lbnQiLCJkb2N1bWVudCIsInVzZUNhbGxTb29uIiwiZG9udENsZWFuIiwiaGFuZGxlUmVmIiwiaGFuZGxlcyIsImZvckVhY2giLCJoYW5kbGUiLCJjYW5jZWxBbmltYXRpb25GcmFtZSIsImNhbGxiYWNrIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwic3BsaWNlIiwidXNlUmVmQ29weSIsInJlZiIsInVzZVN0YWJsZUhhbmRsZXIiLCJoYW5kbGVyIiwiaGFuZGxlclJlZiIsImFyZ3MiLCJfaSIsInVzZUdldE9yaWdpbmFsSXRlbU9yZGVyIiwiZW52IiwiZmluZEluZGV4IiwibGluZWFySXRlbSIsInNvcnQiLCJhUG9zIiwiYlBvcyIsImNvbXB1dGVJdGVtSGVpZ2h0IiwiZmlyc3RJdGVtIiwicXVlcnlTZWxlY3RvciIsInN0eWxlIiwiZ2V0Q29tcHV0ZWRTdHlsZSIsIm9mZnNldEhlaWdodCIsIk1hdGgiLCJtYXgiLCJwYXJzZUZsb2F0IiwibWFyZ2luVG9wIiwibWFyZ2luQm90dG9tIiwiaXNPdXRzaWRlT2ZDb250YWluZXIiLCJ0cmVlQmIiLCJjbGllbnRYIiwibGVmdCIsInJpZ2h0IiwiY2xpZW50WSIsInRvcCIsImJvdHRvbSIsIkRyYWdnaW5nUG9zaXRpb25FdmFsdWF0aW9uIiwiaG92ZXJpbmdQb3NpdGlvbiIsIm9mZnNldCIsImluZGVudGF0aW9uIiwiZ2V0RW1wdHlUcmVlRHJhZ1Bvc2l0aW9uIiwibWF5YmVSZWRpcmVjdFRvUGFyZW50IiwicmVkaXJlY3RUYXJnZXRUb1BhcmVudCIsIm1heWJlUmVwYXJlbnRVcHdhcmRzIiwidHJlZUxpbmVhckl0ZW1zIiwiZGVlcGVzdERlcHRoIiwibGVnYWxEcm9wRGVwdGhDb3VudCIsImNhblJlcGFyZW50VXB3YXJkcyIsImRyb3BwaW5nSW5kZW50IiwibmV3UGFyZW50IiwiaW5zZXJ0aW9uSXRlbUFib3ZlIiwicmVwYXJlbnRlZENoaWxkSW5kZXgiLCJtYXliZVJlZGlyZWN0SW5zaWRlT3BlbkZvbGRlciIsIm5leHRJdGVtIiwicmVkaXJlY3RJbnNpZGVPcGVuRm9sZGVyIiwiY2FuRHJvcEJlbG93T3BlbkZvbGRlcnMiLCJtYXliZU1hcFRvQm90dG9tT2Zmc2V0IiwicHJpb3JJdGVtIiwiZGVwdGhEaXN0YW5jZVRvUHJpb3IiLCJjYW5Ecm9wQXRDdXJyZW50VGFyZ2V0IiwidGFyZ2V0SXRlbURhdGEiLCJnZXREcmFnZ2luZ1Bvc2l0aW9uIiwicmVwYXJlbnRlZCIsImFyZURyYWdnaW5nSXRlbXNEZXNjZW5kYW50T2ZUYXJnZXQiLCJuZXdDaGlsZEluZGV4IiwidXNlRHJhZ2dpbmdQb3NpdGlvbiIsImRyYWdDb2RlIiwidXNlU3RhdGUiLCJzZXREcmFnZ2luZ0l0ZW1zIiwiaXRlbUhlaWdodCIsImlzTmV3RHJhZ1Bvc2l0aW9uIiwibmV3RHJhZ0NvZGUiLCJnZXRIb3ZlcmluZ1Bvc2l0aW9uIiwiY29udGFpbmVyUmVmIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwibWluIiwiZmxvb3IiLCJ0YXJnZXRMaW5lYXJJdGVtIiwicmVuZGVyRGVwdGhPZmZzZXQiLCJsaW5lVGhyZXNob2xkIiwiY2FuRHJhZ0FuZERyb3AiLCJpbml0aWF0ZURyYWdnaW5nUG9zaXRpb24iLCJyZXNldERyYWdnaW5nUG9zaXRpb24iLCJEcmFnQW5kRHJvcENvbnRleHQiLCJ1c2VEcmFnQW5kRHJvcCIsIkRyYWdBbmREcm9wUHJvdmlkZXIiLCJpc1Byb2dyYW1tYXRpY2FsbHlEcmFnZ2luZyIsInNldElzUHJvZ3JhbW1hdGljYWxseURyYWdnaW5nIiwidmlhYmxlRHJhZ1Bvc2l0aW9ucyIsInNldFZpYWJsZURyYWdQb3NpdGlvbnMiLCJfZCIsInByb2dyYW1tYXRpY0RyYWdJbmRleCIsInNldFByb2dyYW1tYXRpY0RyYWdJbmRleCIsIl9lIiwic2V0RHJhZ2dpbmdQb3NpdGlvbiIsImdldFZpYWJsZURyYWdQb3NpdGlvbnMiLCJjYWxsU29vbiIsImdldE9yaWdpbmFsSXRlbU9yZGVyIiwiX2YiLCJyZXNldFByb2dyYW1tYXRpY0RyYWdJbmRleEZvckN1cnJlbnRUcmVlIiwiYWN0aXZlVHJlZUlkIiwidmlld1N0YXRlIiwiZm9jdXNlZEl0ZW0iLCJmb2N1c0l0ZW1fMSIsInRyZWVEcmFnUG9zaXRpb25zIiwibmV3UG9zIiwicG9zIiwicmVzZXRTdGF0ZSIsInBlcmZvcm1EcmFnIiwic2V0QWN0aXZlVHJlZSIsIm9uU2VsZWN0SXRlbXMiLCJvbkRyYWdPdmVyVHJlZUhhbmRsZXIiLCJuZXdEcmFnZ2luZ1Bvc2l0aW9uIiwib25EcmFnTGVhdmVDb250YWluZXJIYW5kbGVyIiwib25Ecm9wSGFuZGxlciIsIm9uRHJvcCIsIm9uRm9jdXNJdGVtIiwib25TdGFydERyYWdnaW5nSXRlbXMiLCJ0cmVlVmlhYmxlRHJhZ1Bvc2l0aW9ucyIsInN0YXJ0UHJvZ3JhbW1hdGljRHJhZyIsImRyYWdnaW5nSXRlbXNfMSIsInNlbGVjdGVkSXRlbXMiLCJyZXNvbHZlZERyYWdnaW5nSXRlbXMiLCJzZXRUaW1lb3V0IiwiYWJvcnRQcm9ncmFtbWF0aWNEcmFnIiwiY29tcGxldGVQcm9ncmFtbWF0aWNEcmFnIiwicHJvZ3JhbW1hdGljRHJhZ1VwIiwib2xkSW5kZXgiLCJwcm9ncmFtbWF0aWNEcmFnRG93biIsImRuZCIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwidXNlQ3JlYXRlZEVudmlyb25tZW50UmVmIiwidXNlSW1wZXJhdGl2ZUhhbmRsZSIsInRyZWVFbnZpcm9ubWVudENvbnRleHQiLCJkcmFnQW5kRHJvcENvbnRleHQiLCJ3YWl0Rm9yIiwiY2hlY2siLCJpbnRlcnZhbE1zIiwidGltZW91dE1zIiwiUHJvbWlzZSIsInJlc29sdmUiLCJjb21wbGV0ZSIsImludGVydmFsIiwic2V0SW50ZXJ2YWwiLCJ0aW1lb3V0IiwiY2xlYXJJbnRlcnZhbCIsImNsZWFyVGltZW91dCIsIl9fYXdhaXRlciIsInRoaXNBcmciLCJfYXJndW1lbnRzIiwiUCIsImdlbmVyYXRvciIsImFkb3B0IiwicmVqZWN0IiwiZnVsZmlsbGVkIiwic3RlcCIsIm5leHQiLCJyZWplY3RlZCIsInJlc3VsdCIsImRvbmUiLCJ0aGVuIiwiX19nZW5lcmF0b3IiLCJib2R5IiwiXyIsImxhYmVsIiwic2VudCIsInRyeXMiLCJvcHMiLCJmIiwieSIsImciLCJ2ZXJiIiwiU3ltYm9sIiwiaXRlcmF0b3IiLCJvcCIsIlR5cGVFcnJvciIsInBvcCIsIkVudmlyb25tZW50QWN0aW9uc0NvbnRleHQiLCJ1c2VFbnZpcm9ubWVudEFjdGlvbnMiLCJyZWN1cnNpdmVFeHBhbmQiLCJpdGVtSWQiLCJvbkV4cGFuZCIsIl9sb29wXzEiLCJjaGlsZElkIiwiRW52aXJvbm1lbnRBY3Rpb25zUHJvdmlkZXIiLCJmb3J3YXJkUmVmIiwicHJvcHMiLCJvbkNvbGxhcHNlSXRlbSIsIm9uRXhwYW5kSXRlbSIsIm9uUmVuYW1lSXRlbSIsIm9uUHJpbWFyeUFjdGlvbiIsIml0ZW1zUmVmIiwiY29sbGFwc2VJdGVtIiwiZXhwYW5kSXRlbSIsInNldERvbUZvY3VzIiwiZm9jdXNUcmVlIiwiYXV0b0ZvY3VzIiwibW92ZUZvY3VzRG93biIsImN1cnJlbnRGb2N1c0luZGV4IiwibmV3SW5kZXgiLCJuZXdJdGVtIiwibW92ZUZvY3VzVXAiLCJyZW5hbWVJdGVtIiwibmFtZSIsInNlbGVjdEl0ZW1zIiwiaXRlbXNJZHMiLCJ0b2dnbGVJdGVtRXhwYW5kZWRTdGF0ZSIsImV4cGFuZGVkSXRlbXMiLCJpbmNsdWRlcyIsInRvZ2dsZUl0ZW1TZWxlY3RTdGF0dXMiLCJmaWx0ZXIiLCJpbnZva2VQcmltYXJ5QWN0aW9uIiwiZXhwYW5kU3Vic2VxdWVudGx5IiwiaXRlbUlkcyIsInJlc3QiLCJleHBhbmRBbGwiLCJjb2xsYXBzZUFsbCIsIm1vdmVQcm9ncmFtbWF0aWNEcmFnUG9zaXRpb25Eb3duIiwibW92ZVByb2dyYW1tYXRpY0RyYWdQb3NpdGlvblVwIiwic2Nyb2xsSW50b1ZpZXciLCJlbGVtZW50Iiwic2Nyb2xsSW50b1ZpZXdJZk5lZWRlZCIsImJvdW5kaW5nQm94IiwiaXNFbGVtZW50SW5WaWV3cG9ydCIsImlubmVySGVpZ2h0IiwiZG9jdW1lbnRFbGVtZW50IiwiY2xpZW50SGVpZ2h0IiwiaW5uZXJXaWR0aCIsImNsaWVudFdpZHRoIiwiY3giLCJjbGFzc05hbWVzIiwiY24iLCJqb2luIiwiY3JlYXRlRGVmYXVsdFJlbmRlcmVycyIsInJ0bCIsInJlbmRlckl0ZW1UaXRsZSIsInRpdGxlIiwiY29udGV4dCIsImluZm8iLCJpc1NlYXJjaGluZyIsImlzU2VhcmNoTWF0Y2hpbmciLCJzdGFydEluZGV4IiwidG9Mb3dlckNhc2UiLCJzZWFyY2giLCJGcmFnbWVudCIsImNsYXNzTmFtZSIsInJlbmRlckl0ZW1BcnJvdyIsImlzRXhwYW5kZWQiLCJhcnJvd1Byb3BzIiwidmVyc2lvbiIsInhtbG5zIiwieG1sbnNYbGluayIsIngiLCJ2aWV3Qm94IiwiZW5hYmxlQmFja2dyb3VuZCIsInhtbFNwYWNlIiwiZmlsbFJ1bGUiLCJjbGlwUnVsZSIsImQiLCJyZW5kZXJJdGVtIiwiYXJyb3ciLCJJbnRlcmFjdGl2ZUNvbXBvbmVudCIsInR5cGUiLCJpdGVtQ29udGFpbmVyV2l0aENoaWxkcmVuUHJvcHMiLCJpc0RyYWdnaW5nT3ZlciIsIml0ZW1Db250YWluZXJXaXRob3V0Q2hpbGRyZW5Qcm9wcyIsImludGVyYWN0aXZlRWxlbWVudFByb3BzIiwicmVuZGVyUmVuYW1lSW5wdXQiLCJpbnB1dFByb3BzIiwiaW5wdXRSZWYiLCJzdWJtaXRCdXR0b25Qcm9wcyIsInN1Ym1pdEJ1dHRvblJlZiIsImZvcm1Qcm9wcyIsInJlbmRlclRyZWVDb250YWluZXIiLCJjb250YWluZXJQcm9wcyIsImFyZUl0ZW1zU2VsZWN0ZWQiLCJtaW5IZWlnaHQiLCJyZW5kZXJJdGVtc0NvbnRhaW5lciIsInJlbmRlckRyYWdCZXR3ZWVuTGluZSIsImxpbmVQcm9wcyIsInJlbmRlclNlYXJjaElucHV0IiwicmVuZGVyTGl2ZURlc2NyaXB0b3JDb250YWluZXIiLCJ0cmVlIiwiY2xpcCIsImNsaXBQYXRoIiwiaGVpZ2h0Iiwib3ZlcmZsb3ciLCJwb3NpdGlvbiIsIndoaXRlU3BhY2UiLCJ3aWR0aCIsInVzZVJlbmRlcmVycyIsImRlZmF1bHRSZW5kZXJlcnMiLCJjdXN0b21SZW5kZXJlcnMiLCJyZW5kZXJlcnMiLCJlbnRyaWVzIiwiYWNjIiwia2V5Iiwia2V5TWFwcGVkIiwiZGlzcGxheU5hbWUiLCJnZXRJdGVtc0xpbmVhcmx5IiwiX19yZXN0IiwiZ2V0T3duUHJvcGVydHlTeW1ib2xzIiwicHJvcGVydHlJc0VudW1lcmFibGUiLCJ1c2VDb250cm9sbGVkVHJlZUVudmlyb25tZW50UHJvcHMiLCJvbkV4cGFuZEl0ZW1Qcm9wIiwib25Db2xsYXBzZVByb3AiLCJvbkRyb3BQcm9wIiwic2V0VHJlZXMiLCJzZXRBY3RpdmVUcmVlSWQiLCJrZXlzIiwib25SZWdpc3RlclRyZWUiLCJvblVucmVnaXN0ZXJUcmVlIiwib25Gb2N1c0l0ZW1SZWYiLCJ2aWV3U3RhdGVSZWYiLCJvbkZvY3VzSXRlbUhhbmRsZXIiLCJfZyIsIl9oIiwiX2oiLCJhY3RpdmVFbGVtZW50IiwiYXR0cmlidXRlcyIsImdldE5hbWVkSXRlbSIsImZvY3VzIiwicmVnaXN0ZXJUcmVlIiwidW5yZWdpc3RlclRyZWUiLCJ0YXJnZXQiLCJ0cmVlSWRPclNldFN0YXRlRnVuY3Rpb24iLCJhdXRvRm9jdXNUcmVlIiwibWF5YmVGb2N1c1RyZWUiLCJjb250YWlucyIsIm9sZFZhbHVlIiwiVHJlZUVudmlyb25tZW50Q29udGV4dCIsIkNvbnRyb2xsZWRUcmVlRW52aXJvbm1lbnQiLCJlbnZpcm9ubWVudENvbnRleHRQcm9wcyIsIkRyYWdCZXR3ZWVuTGluZSIsInVzZVRyZWUiLCJzaG91bGREaXNwbGF5IiwidXNlSHRtbEVsZW1lbnRFdmVudExpc3RlbmVyIiwibGlzdGVuZXIiLCJzdGFibGVMaXN0ZW5lciIsInVzZUZvY3VzV2l0aGluIiwib25Gb2N1c0luIiwib25Gb2N1c091dCIsImZvY3VzV2l0aGluIiwic2V0Rm9jdXNXaXRoaW4iLCJpc0xvb3NpbmdGb2N1c0ZsYWciLCJ1c2VLZXkiLCJvbkhpdCIsImFjdGl2ZSIsImRlZmF1bHRLZXlib2FyZEJpbmRpbmdzIiwiZXhwYW5kU2libGluZ3MiLCJtb3ZlRm9jdXNUb0ZpcnN0SXRlbSIsIm1vdmVGb2N1c1RvTGFzdEl0ZW0iLCJhYm9ydFJlbmFtZUl0ZW0iLCJ0b2dnbGVTZWxlY3RJdGVtIiwiYWJvcnRTZWFyY2giLCJzdGFydFNlYXJjaCIsInNlbGVjdEFsbCIsInN0YXJ0UHJvZ3JhbW1hdGljRG5kIiwiY29tcGxldGVQcm9ncmFtbWF0aWNEbmQiLCJhYm9ydFByb2dyYW1tYXRpY0RuZCIsInVzZUtleWJvYXJkQmluZGluZ3MiLCJrZXlib2FyZEJpbmRpbmdzIiwiZWxlbWVudHNUaGF0Q2FuVGFrZVRleHQiLCJ1c2VIb3RrZXkiLCJjb21iaW5hdGlvbk5hbWUiLCJhY3RpdmF0YWJsZVdoaWxlRm9jdXNpbmdJbnB1dCIsInByZXNzZWRLZXlzIiwicG9zc2libGVDb21iaW5hdGlvbnMiLCJjb21iaW5hdGlvbiIsInNwbGl0IiwidGFnTmFtZSIsImlzQ29udGVudEVkaXRhYmxlIiwicHJlc3NlZEtleXNMb3dlcmNhc2VfMSIsInBhcnRpYWxNYXRjaCIsImIiLCJ0ZXN0IiwicHJlc3NlZEtleXNMb3dlcmNhc2UiLCJtYXRjaCIsInVzZVZpZXdTdGF0ZSIsInVzZUxpbmVhckl0ZW1zIiwidXNlTW92ZUZvY3VzVG9JbmRleCIsImNvbXB1dGVOZXdJbmRleCIsImN1cnJlbnRJbmRleCIsIm5ld0luZGV4Qm91bmRlZCIsIm5ld0ZvY3VzSXRlbSIsInVzZVByZXZpb3VzIiwicHJldmlvdXMiLCJ1c2VTZWxlY3RVcFRvIiwic3RhcnRpbmdBdCIsImZvY3VzZWRJdGVtUHJldmlvdXMiLCJvdmVycmlkZU9sZFNlbGVjdGlvbiIsIml0ZW1JbmRleCIsInNlbGVjdE1lcmdlZEl0ZW1zIiwib2xkU2VsZWN0aW9uIiwibmV3U2VsZWN0aW9uIiwibWVyZ2VkIiwibGFzdEZvY3VzXzEiLCJzZWxlY3Rpb25TdGFydCIsInNlbGVjdGlvbkVuZCIsInNlbGVjdGlvbiIsInVzZVRyZWVLZXlib2FyZEJpbmRpbmdzIiwic2V0UmVuYW1pbmdJdGVtIiwic2V0U2VhcmNoIiwicmVuYW1pbmdJdGVtIiwibW92ZUZvY3VzVG9JbmRleCIsImlzQWN0aXZlVHJlZSIsImRpc2FibGVBcnJvd0tleXMiLCJlbmFibGVBcnJvd0tleXMiLCJpdGVtRGVwdGgiLCJwYXJlbnRJbmRleCIsImNhblJlbmFtZSIsIm9uU3RhcnRSZW5hbWluZ0l0ZW0iLCJkZWZhdWx0TWF0Y2hlciIsIml0ZW1UaXRsZSIsInVzZVNlYXJjaE1hdGNoRm9jdXMiLCJkb2VzU2VhcmNoTWF0Y2hJdGVtIiwiZ2V0SXRlbVRpdGxlIiwiZmluZCIsIlNlYXJjaElucHV0IiwiY2xlYXJTZWFyY2giLCJ1bmljb2RlIiwiY2hhckNvZGVBdCIsImNhblNlYXJjaCIsImNhblNlYXJjaEJ5U3RhcnRpbmdUeXBpbmciLCJhbHRLZXkiLCJvbkNoYW5nZSIsIm9uQmx1ciIsImVsIiwiZGVmYXVsdExpdmVEZXNjcmlwdG9ycyIsImludHJvZHVjdGlvbiIsInNlYXJjaGluZyIsInByb2dyYW1tYXRpY2FsbHlEcmFnZ2luZyIsInByb2dyYW1tYXRpY2FsbHlEcmFnZ2luZ1RhcmdldCIsInJlc29sdmVMaXZlRGVzY3JpcHRvciIsImRlc2NyaXB0b3IiLCJyZXBsYWNlIiwidmFyaWFibGVOYW1lV2l0aEJyYWNrZXRzIiwidmFyaWFibGVOYW1lIiwidHJlZUxhYmVsIiwicGFyZW50VGl0bGUiLCJzdGFydHNXaXRoIiwiTGl2ZVdyYXBwZXIiLCJsaXZlIiwiZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwiLCJfX2h0bWwiLCJMaXZlRGVzY3JpcHRpb24iLCJkZXNjcmlwdG9ycyIsImxpdmVEZXNjcmlwdG9ycyIsIk1haW5XcmFwcGVyIiwidHJlZUluZm9ybWF0aW9uIiwiTWF5YmVMaXZlRGVzY3JpcHRpb24iLCJzaG93TGl2ZURlc2NyaXB0aW9uIiwiVHJlZU1hbmFnZXIiLCJvbGRUcmVlSWQiLCJyb290Q2hpbGRyZW4iLCJ0cmVlQ2hpbGRyZW4iLCJUcmVlSXRlbUNoaWxkcmVuIiwicGFyZW50SWQiLCJvbkRyYWdMZWF2ZSIsIm9uTW91c2VEb3duIiwicm9sZSIsInRyZWVMYWJlbGxlZEJ5IiwidXNlQ3JlYXRlZFRyZWVJbmZvcm1hdGlvbiIsInVzZUNyZWF0ZWRUcmVlUmVmIiwidHJlZUNvbnRleHQiLCJUcmVlQWN0aW9uc1Byb3ZpZGVyIiwiZW52QWN0aW9ucyIsImFib3J0UmVuYW1pbmdJdGVtIiwiY29tcGxldGVSZW5hbWluZ0l0ZW0iLCJzdGFydFJlbmFtaW5nSXRlbSIsInN0b3BSZW5hbWluZ0l0ZW0iLCJUcmVlQ29udGV4dCIsIlRyZWUiLCJ0cmVlQ29udGV4dFByb3BzIiwib25NaXNzaW5nSXRlbXMiLCJjaGlsZEVsZW1lbnRzIiwiY2hpbGQiLCJUcmVlSXRlbUVsZW1lbnQiLCJ1c2VUcmVlSXRlbVJlbmRlckNvbnRleHQiLCJjdXJyZW50bHlTZWxlY3RlZEl0ZW1zIiwiaXNJdGVtUGFydE9mU2VsZWN0ZWRJdGVtcyIsInNlbGVjdGVkSXRlbSIsImNhbkRyYWdDdXJyZW50bHlTZWxlY3RlZEl0ZW1zIiwiY2FuTW92ZSIsImNhbkRyYWdUaGlzSXRlbSIsImNhbkRyb3BPbiIsIm9yZGVyZWRJdGVtcyIsImlzRHJhZ2dpbmdPdmVyUGFyZW50Iiwidmlld1N0YXRlRmxhZ3MiLCJpc0FycmF5IiwiVHJlZUl0ZW1SZW5hbWluZ0lucHV0Iiwic2V0VGl0bGUiLCJhYm9ydCIsIm9uQWJvcnRSZW5hbWluZ0l0ZW0iLCJjb25maXJtIiwic2VsZWN0IiwicmVsYXRlZFRhcmdldCIsInN0b3BQcm9wYWdhdGlvbiIsIm9uU3VibWl0IiwiaGFzQmVlblJlcXVlc3RlZCIsInNldEhhc0JlZW5SZXF1ZXN0ZWQiLCJyZW5kZXJDb250ZXh0Iiwic2hvdWxkUmVuZGVyQ2hpbGRyZW4iLCJ0aXRsZUNvbXBvbmVudCIsImFycm93Q29tcG9uZW50IiwidHJlZURhdGFSZWR1Y2VyIiwidHJlZURhdGEiLCJhY3Rpb24iLCJkYXRhIiwiZGVsZXRlZE5vZGVJRHMiLCJkZWxldGVkTm9kZUlEIiwiZGF0YUNoYW5nZWREYXRlIiwiRm9sZGVySWNvbiIsImlzT3BlbiIsImZpbGwiLCJzdHJva2UiLCJzdHJva2VXaWR0aCIsInN0cm9rZUxpbmVjYXAiLCJzdHJva2VMaW5lam9pbiIsIngxIiwieTEiLCJ4MiIsInkyIiwiRmlsZUljb24iLCJmaWxlVHlwZSIsImdldEZpbGVJY29uIiwicG9pbnRzIiwiZm9udFNpemUiLCJUcmVlQ29udGFpbmVyIiwic2VydmljZVVybCIsIndpZGdldE5hbWUiLCJ3aWRnZXRDbGFzc05hbWUiLCJ0b2dnbGVFeHBhbmRlZEljb25Pbmx5IiwiYWxsb3dOb2RlUmVuYW1lIiwiYWxsb3dEcmFnUmVvcmRlcmluZyIsImFsbG93RHJhZ01vdmUiLCJjb2xsYXBzZUFsbEJ1dHRvbkljb24iLCJjb2xsYXBzZUFsbEJ1dHRvbkNhcHRpb24iLCJjb2xsYXBzZUFsbEJ1dHRvbkNsYXNzIiwic2hvd0V4cGFuZEFsbEJ1dHRvbiIsImV4cGFuZEFsbEJ1dHRvbkljb24iLCJleHBhbmRBbGxCdXR0b25DYXB0aW9uIiwiZXhwYW5kQWxsQnV0dG9uQ2xhc3MiLCJvblNlbGVjdGlvbkNoYW5nZWQiLCJvbk1pc3NpbmdOb2RlcyIsIm9uTm9kZVJlbmFtZWQiLCJsb2dNZXNzYWdlVG9Db25zb2xlIiwibG9nVG9Db25zb2xlIiwiZHVtcFNlcnZpY2VSZXNwb25zZUluQ29uc29sZSIsImRpc3BhdGNoIiwidXNlUmVkdWNlciIsInNldEZvY3VzZWRJdGVtIiwic2V0RXhwYW5kZWRJdGVtcyIsInNldFNlbGVjdGVkSXRlbXMiLCJmaWxlRXh0ZW5zaW9uIiwiY29uc29sZSIsImxvZyIsImRpciIsIm9uU2VsZWN0aW9uQ2hhbmdlZEhhbmRsZXIiLCJzZWxlY3RlZElEcyIsIm9uRXhwYW5kSXRlbUhhbmRsZXIiLCJmaXJzdENoaWxkSUQiLCJyZXF1ZXN0ZWRJRHMiLCJvbkNvbGxhcHNlQWxsQnV0dG9uQ2xpY2siLCJvbkV4cGFuZEFsbEJ1dHRvbkNsaWNrIiwiZXhwYW5kYWJsZUl0ZW1JRHMiLCJpdGVtSUQiLCJvblJlbmFtZU5vZGVIYW5kbGVyIiwibmV3TmFtZSIsImRyYWdnZWRJdGVtSURzIiwiYWNjdW11bGF0b3IiLCJKU09OIiwic3RyaW5naWZ5IiwiY2FuRHJhZ0hhbmRsZXIiLCJmaXJzdFBhcmVudElEIiwicGFyZW50SUQiLCJldmVyeSIsImNhbkRyb3BBdEhhbmRsZXIiLCJ0YXJnZXROb2RlSUQiLCJ0YXJnZXROb2RlIiwiYWNjZXB0RHJhZ1R5cGVzIiwiZHJhZ1R5cGUiLCJwcm9jZXNzRGF0YUZyb21TZXJ2aWNlIiwiUmVzcG9uc2VOb2RlcyIsIm5vZGVzIiwidmFsdWVzIiwiY3JlYXRlVHJlZURhdGFPYmplY3QiLCJlcnJvciIsIm5ld1RyZWVEYXRhIiwibm9kZSIsIm5vZGVEYXRhIiwicmVsb2FkVHJlZSIsInVwZGF0ZVRyZWUiLCJ3YXJuIiwiZm9jdXNOb2RlSUQiLCJleHBhbmRJdGVtSURzIiwiZXhwYW5kSXRlbUlEQXJyYXkiLCJyZXNldEV4cGFuZGVkSXRlbXMiLCJnZXRUaW1lIiwic2VydmljZVVybExvY2FsIiwibXgiLCJzZXNzaW9uIiwidG9rZW4iLCJnZXRDb25maWciLCJmZXRjaCIsImNyZWRlbnRpYWxzIiwiaGVhZGVycyIsIkFjY2VwdCIsInJlc3BvbnNlIiwib2siLCJqc29uIiwic3RhdHVzVGV4dCIsInRyZWVOYW1lIiwiaW50ZXJhY3Rpb25Nb2RlIiwiSWNvbiIsImljb24iLCJleHBhbmRlZEl0ZW1JbmRleCIsIlJlYWN0Q29tcGxleFRyZWVXaWRnZXQiLCJtZXNzYWdlIiwiRGF0ZSIsInRvSVNPU3RyaW5nIiwib25TZWxlY3Rpb25DaGFuZ2VkQWN0aW9uIiwic2VsZWN0ZWROb2RlSURzQXR0ciIsInNlbGVjdGVkSXRlbUlEcyIsInN0YXR1cyIsInJlYWRPbmx5Iiwic2V0VmFsdWUiLCJjYW5FeGVjdXRlIiwiaXNFeGVjdXRpbmciLCJleGVjdXRlIiwib25NaXNzaW5nTm9kZXNBY3Rpb24iLCJtaXNzaW5nTm9kZUlEc0F0dHIiLCJvbk1pc3NpbmdOb2Rlc0hhbmRsZXIiLCJtaXNzaW5nSXRlbUlEcyIsIm9uTm9kZVJlbmFtZWRBY3Rpb24iLCJyZW5hbWVkTm9kZUlEQXR0ciIsIm5ld05vZGVOYW1lQXR0ciIsIm9uTm9kZVJlbmFtZWRIYW5kbGVyIiwibm9kZUlEIiwib25Ecm9wQWN0aW9uIiwiZHJhZ2dlZE5vZGVJRHNBdHRyIiwiZHJvcFRhcmdldEF0dHIiLCJkcm9wcGVkTm9kZUlEcyIsImRhdGFDaGFuZ2VEYXRlQXR0ciIsImNsYXNzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFBTyxJQUFJQSxlQUFlLENBQUE7SUFDMUIsQ0FBQyxVQUFVQSxlQUFlLEVBQUU7SUFDeEJBLEVBQUFBLGVBQWUsQ0FBQyx5QkFBeUIsQ0FBQyxHQUFHLDZCQUE2QixDQUFBO0lBQzFFQSxFQUFBQSxlQUFlLENBQUMsbUJBQW1CLENBQUMsR0FBRyxzQkFBc0IsQ0FBQTtJQUM3REEsRUFBQUEsZUFBZSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsdUJBQXVCLENBQUE7SUFDbkUsQ0FBQyxFQUFFQSxlQUFlLEtBQUtBLGVBQWUsR0FBRyxFQUFFLENBQUMsQ0FBQzs7SUNMN0MsSUFBSUMsVUFBUSxHQUFJQyxTQUFJLElBQUlBLFNBQUksQ0FBQ0QsUUFBUSxJQUFLLFlBQVk7SUFDbERBLEVBQUFBLFVBQVEsR0FBR0UsTUFBTSxDQUFDQyxNQUFNLElBQUksVUFBU0MsQ0FBQyxFQUFFO0lBQ3BDLElBQUEsS0FBSyxJQUFJQyxDQUFDLEVBQUVDLENBQUMsR0FBRyxDQUFDLEVBQUVDLENBQUMsR0FBR0MsU0FBUyxDQUFDQyxNQUFNLEVBQUVILENBQUMsR0FBR0MsQ0FBQyxFQUFFRCxDQUFDLEVBQUUsRUFBRTtJQUNqREQsTUFBQUEsQ0FBQyxHQUFHRyxTQUFTLENBQUNGLENBQUMsQ0FBQyxDQUFBO1VBQ2hCLEtBQUssSUFBSUksQ0FBQyxJQUFJTCxDQUFDLEVBQUUsSUFBSUgsTUFBTSxDQUFDUyxTQUFTLENBQUNDLGNBQWMsQ0FBQ0MsSUFBSSxDQUFDUixDQUFDLEVBQUVLLENBQUMsQ0FBQyxFQUMzRE4sQ0FBQyxDQUFDTSxDQUFDLENBQUMsR0FBR0wsQ0FBQyxDQUFDSyxDQUFDLENBQUMsQ0FBQTtJQUNuQixLQUFBO0lBQ0EsSUFBQSxPQUFPTixDQUFDLENBQUE7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LG1CQUFBLENBQUNpbUIsYUFBYSxFQUFBO0lBQ1ZqQixJQUFBQSxlQUFlLEVBQUVyVSxLQUFLLENBQUN5YyxrQkFBa0IsQ0FBQ2x0QixLQUFNO0lBQ2hEZ21CLElBQUFBLFVBQVUsRUFBRXZWLEtBQUssQ0FBQ3VWLFVBQVUsQ0FBQ2htQixLQUFNO1FBQ25DaW1CLFVBQVUsRUFBRXhWLEtBQUssQ0FBQ2lCLElBQUs7UUFDdkJ3VSxlQUFlLEVBQUV6VixLQUFLLENBQUMwYyxLQUFNO1FBQzdCaEgsc0JBQXNCLEVBQUUxVixLQUFLLENBQUMwVixzQkFBdUI7UUFDckRDLGVBQWUsRUFBRTNWLEtBQUssQ0FBQzJWLGVBQWdCO1FBQ3ZDQyxtQkFBbUIsRUFBRTVWLEtBQUssQ0FBQzRWLG1CQUFvQjtRQUMvQ0MsYUFBYSxFQUFFN1YsS0FBSyxDQUFDNlYsYUFBYztJQUNuQ0MsSUFBQUEscUJBQXFCLEVBQUU5VixLQUFLLENBQUM4VixxQkFBcUIsRUFBRXZtQixLQUFNO0lBQzFEd21CLElBQUFBLHdCQUF3QixFQUFFL1YsS0FBSyxDQUFDK1Ysd0JBQXdCLEVBQUV4bUIsS0FBTTtRQUNoRXltQixzQkFBc0IsRUFBRWhXLEtBQUssQ0FBQ2dXLHNCQUF1QjtJQUNyREMsSUFBQUEsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDalcsS0FBSyxDQUFDaVcsbUJBQW1CLEVBQUUxbUIsS0FBTTtJQUN4RDJtQixJQUFBQSxtQkFBbUIsRUFBRWxXLEtBQUssQ0FBQ2tXLG1CQUFtQixFQUFFM21CLEtBQU07SUFDdEQ0bUIsSUFBQUEsc0JBQXNCLEVBQUVuVyxLQUFLLENBQUNtVyxzQkFBc0IsRUFBRTVtQixLQUFNO1FBQzVENm1CLG9CQUFvQixFQUFFcFcsS0FBSyxDQUFDb1csb0JBQXFCO0lBQ2pEQyxJQUFBQSxrQkFBa0IsRUFBRWUseUJBQTBCO0lBQzlDZCxJQUFBQSxjQUFjLEVBQUV3RixxQkFBc0I7SUFDdEN2RixJQUFBQSxhQUFhLEVBQUU0RixvQkFBcUI7SUFDcEM1Z0IsSUFBQUEsTUFBTSxFQUFFRCxhQUFjO0lBQ3RCa2IsSUFBQUEsbUJBQW1CLEVBQUVBLG1CQUFvQjtRQUN6Q0MsWUFBWSxFQUFFelcsS0FBSyxDQUFDeVcsWUFBYTtRQUNqQ0MsNEJBQTRCLEVBQUUxVyxLQUFLLENBQUMwVyw0QkFBQUE7SUFBNkIsR0FDcEUsQ0FBQyxDQUFBO0lBRVY7Ozs7Ozs7OyIsInhfZ29vZ2xlX2lnbm9yZUxpc3QiOlswLDEsMiwzLDQsNSw2LDcsOCw5LDEwLDExLDEyLDEzLDE0LDE1LDE2LDE3LDE4LDE5LDIwLDIxLDIyLDIzLDI0LDI1LDI2LDI3LDI4LDI5LDMwLDMxLDMyLDMzLDM0LDM1LDM2LDM3LDM4LDM5LDQwLDQxLDQyLDQzLDQ0LDQ1LDQ2LDQ3LDQ4LDQ5LDUwLDUxLDUyLDUzLDU0LDU1LDU2LDU3XX0=
