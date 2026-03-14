# Frame Configuration Preview Images

Place rendered preview images here. The FRAME wizard "Preview Image" tab
will look for images named:

```
frame_{lightSource}_{autofocus}_{fluorescence}.png
```

Where each key is the wizard state value lowercased with non-alphanumeric
characters stripped.

## Examples

| lightSource      | autofocus | hasFluorescence | Filename                            |
|------------------|-----------|-----------------|-------------------------------------|
| single-led       | none      | false           | frame_singleled_none_nofluo.png     |
| led-matrix       | hw-af     | true            | frame_ledmatrix_hwaf_fluo.png       |
| led-ring-koehler | sw-af     | false           | frame_ledringkoehler_swaf_nofluo.png|
| none             | none      | false           | frame_none_none_nofluo.png          |

Images should be approximately 800×600px PNG or JPEG.
