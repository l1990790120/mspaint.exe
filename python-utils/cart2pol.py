import os

import cv2
import numpy as np
from PIL import Image


def cart2pol(img_dir, out_dir, rot=90, radius=1):

    if not os.path.exists(out_dir):
        os.mkdir(out_dir)

    frames = os.listdir(img_dir)
    for frame in frames:
        src = cv2.imread(os.path.join(img_dir, frame), cv2.IMREAD_UNCHANGED)

        w, h, c = src.shape

        if rot % 90 != 0:
            raise ValueError("rot must be multiple or 90.")
        for rot_i in range(rot % 90 + 1):
            rot_src = np.rot90(src)

        polar_output = cv2.linearPolar(
            rot_src,
            (int(w / 2), int(h / 2)),
            w/radius,
            flags=(cv2.WARP_FILL_OUTLIERS + cv2.WARP_INVERSE_MAP),
        )

        rgb_img = cv2.cvtColor(polar_output, cv2.COLOR_BGR2RGB)
        img = Image.fromarray(rgb_img)
        img.save(os.path.join(out_dir, frame))
