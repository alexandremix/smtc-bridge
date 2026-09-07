# SMTC Bridge (local widget fork)

Fork of [nuttylmao/smtc-bridge](https://github.com/nuttylmao/smtc-bridge) with a **fully local Now Playing widget** baked into the app — no dependency on `widgets.nutty.gg` for OBS.

SMTC Bridge is a lightweight system tray application that exposes Windows ***System Media Transport Controls (SMTC)*** as a clean REST API.

This is useful when OBS runs on a different PC than the music PC: public HTTPS widgets are blocked from talking to your LAN API, so this fork serves the nutty-style overlay locally over HTTP from the same process.

## Quick Start
1. Download / build the `.exe`, or run `launch.bat`.
2. Run the app — a tray icon will appear.
3. Right-click the tray icon:
   - **Open Local Widget** — preview the overlay in your browser
   - **Copy OBS Widget URL** — paste into OBS Browser Source on your stream PC
4. Default API: [http://127.0.0.1:5000/now-playing](http://127.0.0.1:5000/now-playing)

### OBS (two-PC setup)
On the music PC, keep SMTC Bridge running with LAN access enabled (`settings.ini`):

```ini
[SERVER]
host = 0.0.0.0
port = 5000
```

Allow Windows Firewall inbound TCP **5000**.

On the stream PC, Browser Source URL (example):

```text
http://MUSIC_PC_IP:5000/widget/index.html?theme=standard&fontSize=20&maxWidth=500&smtcBridgeAddress=MUSIC_PC_IP&smtcBridgePort=5000&showAlbumArt=true&showProgressBar=true&showAnimation=slide-in-from-bottom&hideAnimation=slide-out-bottom
```

Use **Copy OBS Widget URL** from the tray so the full query string is filled with your LAN IP.

### Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/now-playing` | Returns the current media state as JSON. |
| `GET` | `/sessions` | Returns a list of all active media sessions. |
| `GET` | `/widget/` | Local Now Playing overlay (OBS-friendly). |
| `GET` | `/widget/settings/` | Local design editor (themes, auto-hide, colors, etc.). |

### Schema
The `/now-playing` endpoint provides a real-time snapshot of your active media sessions:

```json
{
  "app_version": "string",
  "current_session_id": "string",
  "sessions": [
    {
      "source_app_id": "string",
      "media_properties": {
        "Title": "string",
        "Artist": "string",
        "AlbumTitle": "string",
        "AlbumArtist": "string",
        "Thumbnail": "string (base64)",
        "AlbumTrackCount": "integer",
        "TrackNumber": "integer",
        "Genres": "array of strings",
        "Subtitle": "string"
      },
      "playback_info": {
        "PlaybackStatus": "integer",
        "PlaybackType": "integer",
        "PlaybackRate": "number or null",
        "IsShuffleActive": "boolean",
        "AutoRepeatMode": "integer"
      },
      "timeline_properties": {
        "Position": "integer (ms)",
        "StartTime": "integer (ms)",
        "EndTime": "integer (ms)",
        "MinSeekTime": "integer (ms)",
        "MaxSeekTime": "integer (ms)",
        "LastUpdatedTime": "string (ISO 8601)"
      }
    }
  ]
}
```

### Enums

#### Playback Status
| Value | Status | Description |
| :--- | :--- | :--- |
| `0` | `CLOSED` | Engine uninitialized or empty |
| `1` | `OPENED` | Pipeline loaded but idling |
| `2` | `CHANGING` | Buffering, track skipping, or seeking |
| `3` | `STOPPED` | Track queued but fully stopped |
| `4` | `PLAYING` | Audio actively streaming |
| `5` | `PAUSED` | Audio frozen |

#### Playback Type
| Value | Type | Description |
| :--- | :--- | :--- |
| `0` | `UNKNOWN` | Generic audio wrapper |
| `1` | `MUSIC` | Pure audio pipeline (Spotify, iTunes, etc.) |
| `2` | `VIDEO` | Visual media feed (YouTube, Twitch, etc.) |
| `3` | `IMAGE` | Static slideshow presentation hook |

#### Auto Repeat Mode
| Value | Mode | Description |
| :--- | :--- | :--- |
| `0` | `NONE` | Plays queue through and terminates |
| `1` | `TRACK` | Single active song looping |
| `2` | `LIST` | Parent playlist/album looping |

## Build
Requires Python 3.12+ (with Visual C++ build tools if installing `winsdk` from source).

```bat
build.bat
```

Output: `dist\SMTC-Bridge.exe`

## Credits
Original project by **nutty**: [nutty.gg](https://nutty.gg/) / [nuttylmao/smtc-bridge](https://github.com/nuttylmao/smtc-bridge)

Local widget overlay assets are adapted from the public [nutty now-playing widget](https://widgets.nutty.gg/now-playing/settings/).
