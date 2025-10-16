'use client';

export default function PodmatchBadge() {
  return (
    <div style={{ minWidth: 160, maxWidth: 400 }}>
      <a
        href="https://www.podmatch.com/member/codingcatdev"
        style={{ textDecoration: "none", color: "inherit", display: "block" }}
        target="_blank"
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: 15,
            overflow: "hidden",
            border: "solid 1px #ccc",
            borderRadius: 10,
          }}
        >
          <div
            style={{
              flexShrink: 0,
              marginRight: 15,
              padding: 0,
              background: "none",
            }}
          >
            <img
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://podmatch.com/assets/img/waveform_img.png";
              }}
              alt="Cover Art"
              style={{ height: 85 }}
              src="https://img.rephonic.com/artwork/purrfectdev.jpg?width=600&height=600&quality=95"
            />
          </div>
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              textAlign: "left",
            }}
          >
            <span style={{ display: "block", marginBottom: 3 }}>
              <img
                src="https://podmatch.com/assets/img/PodMatch_Logo.png"
                alt="PodMatch Logo"
                style={{ width: 80 }}
              />
            </span>
            <span
              style={{
                display: "block",
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 2,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              CodingCat.dev Podcast
            </span>
            <span style={{ display: "block", fontSize: 12, marginBottom: 2 }}>
              <u>Become a guest</u> on my podcast
            </span>
            <span style={{ marginRight: 10, fontSize: 11 }}></span>
          </div>
        </div>
      </a>
    </div>
  );
}
