import React, { useEffect, useState } from 'react';
import { useClient } from 'sanity';
import { CopyIcon } from '@sanity/icons';
import { Button, Dialog, Text, Stack, Card } from '@sanity/ui';
import { RecycleIcon } from 'lucide-react';
import { apiVersion, dataset, projectId, studioUrl } from "@/sanity/lib/api";

interface SharePreviewActionButtonProps {
  id: string;
  type: string;
  onClose: () => void;
}

const SharePreviewActionButton: React.FC<SharePreviewActionButtonProps> = ({ id, type, onClose }) => {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchShareUrl = async () => {
    setLoading(true);
    setError(null);
    setShareUrl(null);
    try {
      const res = await fetch('/api/generate-preview-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: id,
          secret: process.env.NEXT_PUBLIC_PREVIEW_TOKEN_SECRET,
        }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setShareUrl(`${window.location.origin}/${type}/preview/${data.token}`);
      } else {
        setError(data.error || 'Failed to generate link');
      }
    } catch (e) {
      setError('Error generating link');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShareUrl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dialog
      header="Shareable Preview Link"
      id="share-preview-dialog"
      width={1}
      onClose={onClose}
    >
      <Card padding={4}>
        <Stack space={3}>
          {loading && <Text>Generating link...</Text>}
          {!loading && shareUrl && <>
            <Text as="p">Copy and share this link:</Text>
            <Text as="code">{shareUrl}</Text>
            <Button
              text={copied ? 'Copied!' : 'Copy Link'}
              icon={CopyIcon}
              tone="primary"
              disabled={copied}
              onClick={async () => {
                if (shareUrl) {
                  await navigator.clipboard.writeText(shareUrl);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1000);
                }
              }}
              style={{ marginTop: 8 }}
            />
            <Button
              text="Regenerate"
              icon={RecycleIcon}
              tone="primary"
              onClick={async () => {
                await fetchShareUrl();
              }}
              style={{ marginTop: 8 }}
            />
          </>}
          {!loading && error && (
            <Card padding={3} tone="critical" border radius={2} style={{ marginTop: 8 }}>
              <Text>{error}</Text>
            </Card>
          )}
        </Stack>
      </Card>
    </Dialog>
  );
};

export default SharePreviewActionButton;