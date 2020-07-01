# zingchart-constants

Just a repo with all of the method, event, and misc constants for ZingChart. Used for wrappers and integrations.

## Export Object

The default export object contains the following:

```
export default {
  EVENT_NAMES, 
  METHOD_NAMES,
  MARKER_NAMES,
  DEFAULT_WIDTH,
  DEFAULT_HEIGHT,
  DEFAULT_OUTPUT,
};
```

### EVENT_NAMES

A list of all event names available on ZingChart.

### METHOD_NAMES

A list of all method names available on ZingChart.

### MARKER_NAMES

A list of all marker types available on ZingChart. The term marker is synonmous with node, so these are the different node style render types.

### DEFAULT_WIDTH

The default width of the charts.

### DEFAULT_HEIGHT

The default width of the charts.

### DEFAULT_OUTPUT

The default output of render of the charts. Can either be `svg` or `canvas`.