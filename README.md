# Image Uploader API Development

post a csv to /upload or /upload/worker

```csv
sku,Image 1,Image 2,Image 3,Image 4,Image 5
item1,https://cfn-catalog-prod.tradeling.com/up/65f2cf756aad860f7a264659/db6c3700092f7d71186c67213643e3fc.jpg,https://cfn-catalog-prod.tradeling.com/up/65f2cf756aad860f7a264659/fd61bd8156556772a7146c1c167c4fd4.jpg,,,
item2,https://example.com/image3.jpg,,,,
```

## on /upload

csv files is processed in batches of 10 rows
each row can have maximum of 5 images

concurreny downloads through promise.allSettled()
all done in same controller (main thread)

## on /upload/worker

the task is delegated to a Worker() and the main thread only receives chunks of status update and do res.write
(stream status to frontend)
