import cv2
import numpy as np
from PIL import Image


def cart2pol(img_dir, out_dir):
    frames = os.listdir(img_dir)
    for frame in range(frames):
        src = cv2.imread(frame)

        w, h, c = src.shape

        rot_src = np.rot90(src)
        polar_output = cv2.linearPolar(
            rot_src,
            (int( w / 2), int( h / 2)),
            w,
            flags=(cv2.WARP_FILL_OUTLIERS + cv2.WARP_INVERSE_MAP))

        img = Image.fromarray(polar_output)
        img.save(
            os.path.join(out_dir, frame)
        )