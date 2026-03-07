import { useState } from 'react';
import { aiApi } from '../lib/api';
import { Card, CardHeader, CardContent } from '../components/Card';
import { Button } from '../components/Button';

export default function AIContent() {
  const [activeTab, setActiveTab] = useState<'generate' | 'ideas'>('generate');
  const [prompt, setPrompt] = useState('');
  const [contentType, setContentType] = useState<'post' | 'comment' | 'message'>('post');
  const [generatedContent, setGeneratedContent] = useState('');
  const [generating, setGenerating] = useState(false);
  const [topic, setTopic] = useState('');
  const [ideas, setIdeas] = useState<string[]>([]);
  const [generatingIdeas, setGeneratingIdeas] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const { data } = await aiApi.generate(prompt, contentType);
      setGeneratedContent(data.content);
    } catch (error) {
      console.error('Failed to generate content:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateIdeas = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneratingIdeas(true);
    try {
      const { data } = await aiApi.ideas(topic, 5);
      setIdeas(data.ideas);
    } catch (error) {
      console.error('Failed to generate ideas:', error);
    } finally {
      setGeneratingIdeas(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">AI Content Generator</h1>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('generate')}
          className={'px-4 py-2 rounded-lg font-medium transition-colors ' +
            (activeTab === 'generate' ? 'bg-linkedin-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
          }
        >
          Generate Content
        </button>
        <button
          onClick={() => setActiveTab('ideas')}
          className={'px-4 py-2 rounded-lg font-medium transition-colors ' +
            (activeTab === 'ideas' ? 'bg-linkedin-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
          }
        >
          Post Ideas
        </button>
      </div>

      {activeTab === 'generate' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Create Content</h2>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
                  <select
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-linkedin-500"
                  >
                    <option value="post">LinkedIn Post</option>
                    <option value="comment">Comment Reply</option>
                    <option value="message">Direct Message</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prompt / Topic</label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={4}
                    placeholder="Describe what you want to write about..."
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-linkedin-500"
                  />
                </div>
                <Button type="submit" loading={generating} className="w-full">Generate Content</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Generated Content</h2>
                {generatedContent && (
                  <Button variant="secondary" size="sm" onClick={() => copyToClipboard(generatedContent)}>Copy</Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {generatedContent ? (
                <div className="whitespace-pre-wrap text-gray-700 bg-gray-50 p-4 rounded-lg min-h-[200px]">
                  {generatedContent}
                </div>
              ) : (
                <div className="text-gray-400 text-center py-12">Generated content will appear here</div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Generate Post Ideas</h2>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenerateIdeas} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Topic or Industry</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., SaaS, Marketing, Leadership..."
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-linkedin-500"
                  />
                </div>
                <Button type="submit" loading={generatingIdeas} className="w-full">Generate 5 Ideas</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Post Ideas</h2>
            </CardHeader>
            <CardContent>
              {ideas.length > 0 ? (
                <ul className="space-y-3">
                  {ideas.map((idea, index) => (
                    <li key={index} className="p-3 bg-gray-50 rounded-lg flex justify-between items-start group">
                      <span className="text-gray-700">{idea}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setPrompt(idea); setActiveTab('generate'); }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Use
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-400 text-center py-12">Post ideas will appear here</div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
