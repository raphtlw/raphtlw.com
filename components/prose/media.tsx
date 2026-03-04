"use client";

import Image from "@/components/image";
import Video from "@/components/video";
import { useLazyVideo } from "@/lib/hooks/video";
import { MediaTheme } from "media-chrome/react/media-theme";

import "media-chrome/react";
import "media-chrome/react/menu";

type ImageMediaProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  blurDataURL?: string;
};

export const ImageMedia = ({ src, alt, ...props }: ImageMediaProps) => {
  return (
    <figure className="not-prose flex flex-col gap-4 font-sans -mx-4 md:mx-0">
      <Image src={src} alt={alt ?? ""} className="w-full" {...props} />
      {alt && (
        <figcaption className="px-4 text-sm text-stone-500 dark:text-stone-400">
          {alt}
        </figcaption>
      )}
    </figure>
  );
};

type VideoMediaProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
  alwaysPlay?: boolean;
};

export const VideoMedia = ({
  src,
  alt,
  alwaysPlay,
  ...props
}: VideoMediaProps) => {
  const [ref, loading] = useLazyVideo(src, alwaysPlay);

  return (
    <figure className="not-prose flex flex-col gap-4 font-sans -mx-4 md:mx-0">
      <template
        id="media-theme-instaplay"
        dangerouslySetInnerHTML={{
          __html: `
                <style>
                  :host {
                    --_primary-color: var(--media-primary-color, #fff);
                    --_secondary-color: var(--media-secondary-color, rgb(38 38 38 / 0.75));
                    --_accent-color: var(--media-accent-color, #fff);
                    --media-icon-color: var(--_primary-color);
                    --media-control-background: transparent;
                    --media-control-hover-background: transparent;
                    --media-range-thumb-opacity: 0;
                    --media-control-height: 1.2em;
                    --media-font-weight: bold;
                    --media-tooltip-display: none;
                    font-size: 16px;
                    color: var(--_primary-color);
                  }

                  @supports (color: color-mix(in srgb, red, blue)) {
                    :host {
                      --_secondary-color: color-mix(
                        in srgb,
                        var(--media-secondary-color, rgb(38 38 38)) 75%,
                        transparent
                      );
                      --_accent-color: color-mix(in srgb, var(--media-accent-color, #fff) 75%, transparent);
                    }
                  }

                  .spacer {
                    flex: 1;
                  }

                  media-controller {
                    display: block;
                    overflow: hidden;
                    container: media-theme-instaplay / inline-size;
                  }

                  media-control-bar {
                    margin: 0.4em 0.8em;
                  }

                  media-play-button,
                  media-mute-button {
                    padding: .3em;
                    border-radius: 50%;
                    --media-control-background: var(--_secondary-color);
                    --media-control-hover-background: var(--_secondary-color);
                  }

                  @supports (color: color-mix(in srgb, red, blue)) {
                    media-play-button,
                    media-mute-button {
                      --media-control-hover-background: color-mix(in srgb, var(--_secondary-color) 85%, transparent);
                    }
                  }

                  :host([data-loading]) media-play-button {
                    display: none !important;
                  }

                  media-play-button {
                    --media-button-icon-transform: translateX(.05em);
                    display: none;
                    padding: .7em;
                  }

                  media-play-button[mediapaused] {
                    display: block;
                    line-height: 1;
                  }

                  media-time-range {
                    --media-range-track-height: 4px;
                    --media-range-bar-color: var(--_accent-color);
                    --media-range-track-background: rgb(38 38 38 / 0.25);
                    --media-time-range-buffered-color: rgb(38 38 38 / 0.3);
                    --media-range-padding-left: 0;
                    --media-range-padding-right: 0;
                    --media-preview-time-background: var(--_secondary-color);
                    --media-preview-box-margin: 0 0 3px;
                    --media-preview-time-background: transparent;
                    --media-preview-thumbnail-border-radius: 4px;

                    width: 100%;
                    height: 8px;
                    bottom: -3px;
                  }

                  media-time-range::part(preview-box) {
                    /* Add more space so thumb doesn't hide preview. */
                    --media-preview-box-margin: 0 0 20px;
                    display: grid;
                  }

                  media-preview-thumbnail,
                  media-preview-time-display {
                    grid-area: 1 / 1;
                  }

                  media-preview-time-display {
                    place-self: end center;
                    position: relative;
                    line-height: 2;
                  }

                  @container (inline-size >=384px) {
                    [role='button'],
                    media-controller {
                      font-size: 17px;
                    }

                    media-time-range {
                      bottom: -2px;
                    }

                    media-time-range::part(preview-box) {
                      --media-preview-box-margin: 0 0 0.5em;
                    }
                  }
                </style>

                <media-controller
                  defaultsubtitles="{{defaultsubtitles}}"
                  defaultduration="{{defaultduration}}"
                  gesturesdisabled="{{disabled}}"
                  hotkeys="{{hotkeys}}"
                  nohotkeys="{{nohotkeys}}"
                  defaultstreamtype="on-demand"
                >
                  <slot name="media" slot="media"></slot>
                  <slot name="poster" slot="poster"></slot>
                  <media-error-dialog slot="dialog"></media-error-dialog>

                  <media-play-button slot="centered-chrome">
                    <svg slot="play" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
                      <path fill-rule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clip-rule="evenodd" />
                    </svg>
                  </media-play-button>

                  <media-control-bar noautohide>
                    <div class="spacer"></div>
                    <media-mute-button></media-mute-button>
                  </media-control-bar>

                  <media-time-range noautohide>
                    <media-preview-thumbnail slot="preview"></media-preview-thumbnail>
                    <media-preview-time-display slot="preview"></media-preview-time-display>
                  </media-time-range>

                  <slot></slot>
                </media-controller>`,
        }}
      />

      <MediaTheme
        template="media-theme-instaplay"
        style={{ width: "100%" }}
        className="relative"
        data-loading={loading ? "" : undefined}
      >
        <Video
          ref={ref}
          src={src}
          alt={alt}
          slot="media"
          loop
          autoPlay
          playsInline
          muted={false}
          {...props}
        />

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-8 h-8 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </MediaTheme>

      {alt && (
        <figcaption className="px-4 text-sm text-stone-500 dark:text-stone-400">
          {alt}
        </figcaption>
      )}
    </figure>
  );
};
