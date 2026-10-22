import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import KairouanLogo from '@/components/KairouanLogo';
import { Mail, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = await resetPassword(email);
    setLoading(false);
    if (ok) setSent(true);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#e8d9c0' }}>
      <Header />
      <div className="pt-32 pb-20 max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5">
            <KairouanLogo size={48} variant="gold" showText={false} />
          </div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Mot de passe oublié</h1>
          <p className="text-gray-500 mt-1 text-sm">Nous vous enverrons un lien de réinitialisation</p>
        </div>

        <div className="bg-white border border-black/10 p-8">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h2 className="font-bold text-gray-900 mb-2">Email envoyé !</h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                Un lien de réinitialisation a été envoyé à <strong>{email}</strong>.<br />
                Vérifiez aussi vos spams.
              </p>
              <Link to="/connexion"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Retour à la connexion
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Votre adresse email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    className="w-full pl-10 pr-4 py-3 bg-white border border-black/15 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20"
                    placeholder="votre@email.com" />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3.5 bg-black hover:bg-gray-800 text-white font-bold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    Envoyer le lien
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <div className="text-center pt-2">
                <Link to="/connexion"
                  className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-black transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Retour à la connexion
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
87

<system-reminder>
<total_tokens>14994654 tokens left</total_tokens>
</system-reminder>

<system-reminder>
Note: C:\Users\Hiji\Downloads\e-learning-secure-courses\src\pages\admin\AdminStudents.tsx was read before the last conversation was summarized, but the contents are too large to include. Use Read tool if you need to access it.
</system-reminder>

<system-reminder>
Called the Read tool with the following input: {"file_path":"C:\\Users\\Hiji\\Downloads\\e-learning-secure-courses\\src\\lib\\supabase.ts"}
</system-reminder>

<system-reminder>
Result of calling the Read tool:
import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://nvubddzcjjlcuwqhltsd.supabase.co';
const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52dWJkZHpjampsY3V3cWhsdHNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NTk3NzYsImV4cCI6MjA5NjIzNTc3Nn0.yjldyaHjWuM2LGvI-2RUVQrs87J0ZmwqmOEYBixp92U';

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };

</system-reminder>

<system-reminder>
Note: C:\Users\Hiji\Downloads\e-learning-secure-courses\src\pages\DashboardPage.tsx was read before the last conversation was summarized, but the contents are too large to include. Use Read tool if you need to access it.
</system-reminder>

<system-reminder>
Note: C:\Users\Hiji\Downloads\e-learning-secure-courses\src\pages\LessonPage.tsx was read before the last conversation was summarized, but the contents are too large to include. Use Read tool if you need to access it.
</system-reminder>

<system-reminder>
Note: C:\Users\Hiji\Downloads\e-learning-secure-courses\src\pages\CourseDetailPage.tsx was read before the last conversation was summarized, but the contents are too large to include. Use Read tool if you need to access it.
</system-reminder>

<system-reminder>
The following deferred tools are now available via ToolSearch. Their schemas are NOT loaded — calling them directly will fail with InputValidationError. Use ToolSearch with query "select:<name>[,<name>...]" to load tool schemas before calling them:
ArtifactComments
ArtifactData
CronCreate
CronDelete
CronList
DesignSync
EnterPlanMode
EnterWorktree
ExitPlanMode
ExitWorktree
ListPlugins
ListSkills
Monitor
NotebookEdit
PushNotification
RemoteTrigger
SearchPlugins
SearchSkills
SendMessage
SuggestPluginInstall
TaskCreate
TaskGet
TaskList
TaskStop
TaskUpdate
WebFetch
WebSearch
mcp__1a59c906-04da-521d-bda7-7f71b9f9e01c__batch
mcp__1a59c906-04da-521d-bda7-7f71b9f9e01c__create
mcp__1a59c906-04da-521d-bda7-7f71b9f9e01c__delete
mcp__1a59c906-04da-521d-bda7-7f71b9f9e01c__export
mcp__1a59c906-04da-521d-bda7-7f71b9f9e01c__guide
mcp__1a59c906-04da-521d-bda7-7f71b9f9e01c__query
mcp__1a59c906-04da-521d-bda7-7f71b9f9e01c__read
mcp__1a59c906-04da-521d-bda7-7f71b9f9e01c__update
mcp__6f616b42-0ed8-571e-823f-ee4aca6b7ce9__read_me
mcp__6f616b42-0ed8-571e-823f-ee4aca6b7ce9__show_widget
mcp__7edf9bcf-10b4-4e01-89e4-a095dfb2dcd3__copy_file
mcp__7edf9bcf-10b4-4e01-89e4-a095dfb2dcd3__create_file
mcp__7edf9bcf-10b4-4e01-89e4-a095dfb2dcd3__download_file_content
mcp__7edf9bcf-10b4-4e01-89e4-a095dfb2dcd3__get_file_metadata
mcp__7edf9bcf-10b4-4e01-89e4-a095dfb2dcd3__get_file_permissions
mcp__7edf9bcf-10b4-4e01-89e4-a095dfb2dcd3__list_recent_files
mcp__7edf9bcf-10b4-4e01-89e4-a095dfb2dcd3__read_file_content
mcp__7edf9bcf-10b4-4e01-89e4-a095dfb2dcd3__search_files
mcp__7edf9bcf-10b4-4e01-89e4-a095dfb2dcd3__share_file
mcp__7edf9bcf-10b4-4e01-89e4-a095dfb2dcd3__trash_file
mcp__7edf9bcf-10b4-4e01-89e4-a095dfb2dcd3__update_file
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_authorize_with_youtube
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_balance
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_channel_analytics
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_channel_performance_trends
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_channel_search
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_channel_stats
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_channel_videos
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_comment_insights
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_compose
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_earnings_calculate
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_edit_media
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_generate_broll
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_generate_clips
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_generate_comment_replies
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_generate_music
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_generate_script
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_generate_thumbnail
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_generate_titles
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_generate_video
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_get_channels_by_ids
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_get_videos_by_ids
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_ig_accounts_from_outliers
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_ig_profile
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_ig_profile_reels
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_instagram_connected_accounts
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_instagram_owner_insights
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_instagram_tiktok_outlier_search
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_job_poll
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_jobs_list
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_keyword_research
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_list_competitors
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_motion_graphics
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_outliers
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_refine_thumbnail
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_score_thumbnail
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_score_title
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_similar_channels
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_similar_thumbnails
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_similar_videos
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_submit_feedback
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_subscriber_insights
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_trend_categories
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_trending_videos
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_update_competitors
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_update_video
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_user_channels
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_user_videos
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_video_change_history
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_video_comments
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_video_earnings_estimate
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_video_stats
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_video_transcript
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_video_watch
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_voiceover_generate
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_voiceover_list_voices
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_watch_shortform_content
mcp__92c5e61f-bcf3-402a-b391-8b1c1d0fa55a__vidiq_youtube_search
mcp__9b00c64d-1ebd-4465-95c3-98fe6b978383__campaign_planner
mcp__9b00c64d-1ebd-4465-95c3-98fe6b978383__edit_campaign
mcp__9b00c64d-1ebd-4465-95c3-98fe6b978383__get_analytics
mcp__9b00c64d-1ebd-4465-95c3-98fe6b978383__get_analytics_widget_data
mcp__9b00c64d-1ebd-4465-95c3-98fe6b978383__get_campaign_content
mcp__9b00c64d-1ebd-4465-95c3-98fe6b978383__get_capabilities
mcp__9b00c64d-1ebd-4465-95c3-98fe6b978383__get_enrichment
mcp__9b00c64d-1ebd-4465-95c3-98fe6b978383__save_to_mailchimp
mcp__9b00c64d-1ebd-4465-95c3-98fe6b978383__set_active_campaign
mcp__ccd_connectors__reconnect_session_connector
mcp__ccd_connectors__session_connectors_status
mcp__ccd_connectors__set_session_connector_enabled
mcp__ccd_directory__change_directory
mcp__ccd_directory__request_directory
mcp__ccd_host__clean_up_worktrees
mcp__ccd_host__discard_kept_worktree
mcp__ccd_host__get_storage_usage
mcp__ccd_host__open_in_editor
mcp__ccd_host__request_keep_awake
mcp__ccd_host__reveal_path
mcp__ccd_host__sync_with_base_branch
mcp__ccd_pr__bind_pr
mcp__ccd_pr__get_status
mcp__ccd_pr__set_auto_merge
mcp__ccd_pr__set_monitor
mcp__ccd_pr__unbind_pr
mcp__ccd_session__move_to_cloud
mcp__ccd_session_mgmt__archive_session
mcp__ccd_session_mgmt__clear_session
mcp__ccd_session_mgmt__delete_session
mcp__ccd_session_mgmt__detach_session
mcp__ccd_session_mgmt__export_transcript
mcp__ccd_session_mgmt__get_session
mcp__ccd_session_mgmt__get_usage
mcp__ccd_session_mgmt__list_events
mcp__ccd_session_mgmt__list_sessions
mcp__ccd_session_mgmt__search_session_transcripts
mcp__ccd_session_mgmt__send_message
mcp__ccd_session_mgmt__set_remote_control
mcp__ccd_session_mgmt__set_session_effort
mcp__ccd_session_mgmt__set_session_fast_mode
mcp__ccd_session_mgmt__set_session_model
mcp__ccd_session_mgmt__set_session_output_style
mcp__ccd_session_mgmt__set_session_permission_mode
mcp__ccd_session_mgmt__set_session_title
mcp__ccd_session_mgmt__stop_session
mcp__ccd_session_mgmt__unarchive_session
mcp__ccd_settings__get_settings
mcp__ccd_settings__set_setting
mcp__ccd_sidebar__create_group
mcp__ccd_sidebar__create_section
mcp__ccd_sidebar__delete_group
mcp__ccd_sidebar__delete_section
mcp__ccd_sidebar__list_groups
mcp__ccd_sidebar__list_sections
mcp__ccd_sidebar__mark_completed
mcp__ccd_sidebar__move_sessions
mcp__ccd_sidebar__rename_group
mcp__ccd_sidebar__rename_section
mcp__ccd_sidebar__set_pinned
mcp__ccd_sidebar__set_unread
mcp__ccd_sidebar__set_view
mcp__ccd_view__close_pane
mcp__ccd_view__get_layout
mcp__ccd_view__set_transcript_view
mcp__ccd_view__show_pane
mcp__ccd_window__close_split
mcp__ccd_window__get_window_layout
mcp__ccd_window__open_session_in
mcp__ccd_window__set_sidebar_collapsed
mcp__claude-in-chrome__browser_batch
mcp__claude-in-chrome__computer
mcp__claude-in-chrome__file_upload
mcp__claude-in-chrome__find
mcp__claude-in-chrome__form_input
mcp__claude-in-chrome__get_page_text
mcp__claude-in-chrome__gif_creator
mcp__claude-in-chrome__javascript_tool
mcp__claude-in-chrome__list_connected_browsers
mcp__claude-in-chrome__navigate
mcp__claude-in-chrome__read_console_messages
mcp__claude-in-chrome__read_network_requests
mcp__claude-in-chrome__read_page
mcp__claude-in-chrome__resize_window
mcp__claude-in-chrome__select_browser
mcp__claude-in-chrome__shortcuts_execute
mcp__claude-in-chrome__shortcuts_list
mcp__claude-in-chrome__switch_browser
mcp__claude-in-chrome__tabs_close_mcp
mcp__claude-in-chrome__tabs_context_mcp
mcp__claude-in-chrome__tabs_create_mcp
mcp__claude-in-chrome__upload_image
mcp__computer-use__computer_batch
mcp__computer-use__cursor_position
mcp__computer-use__double_click
mcp__computer-use__hold_key
mcp__computer-use__key
mcp__computer-use__left_click
mcp__computer-use__left_click_drag
mcp__computer-use__left_mouse_down
mcp__computer-use__left_mouse_up
mcp__computer-use__list_granted_applications
mcp__computer-use__middle_click
mcp__computer-use__mouse_move
mcp__computer-use__open_application
mcp__computer-use__read_clipboard
mcp__computer-use__request_access
mcp__computer-use__request_teach_access
mcp__computer-use__right_click
mcp__computer-use__screenshot
mcp__computer-use__scroll
mcp__computer-use__switch_display
mcp__computer-use__teach_batch
mcp__computer-use__teach_step
mcp__computer-use__triple_click
mcp__computer-use__type
mcp__computer-use__wait
mcp__computer-use__write_clipboard
mcp__computer-use__zoom
mcp__df7444cf-bc2f-4b0a-8afc-815204656476__apply_sensitive_message_label
mcp__df7444cf-bc2f-4b0a-8afc-815204656476__apply_sensitive_thread_label
mcp__df7444cf-bc2f-4b0a-8afc-815204656476__create_draft
mcp__df7444cf-bc2f-4b0a-8afc-815204656476__create_label
mcp__df7444cf-bc2f-4b0a-8afc-815204656476__delete_label
mcp__df7444cf-bc2f-4b0a-8afc-815204656476__forward
mcp__df7444cf-bc2f-4b0a-8afc-815204656476__get_draft
mcp__df7444cf-bc2f-4b0a-8afc-815204656476__get_message
mcp__df7444cf-bc2f-4b0a-8afc-815204656476__get_thread
mcp__df7444cf-bc2f-4b0a-8afc-815204656476__label_message
mcp__df7444cf-bc2f-4b0a-8afc-815204656476__label_thread
mcp__df7444cf-bc2f-4b0a-8afc-815204656476__list_drafts
mcp__df7444cf-bc2f-4b0a-8afc-815204656476__list_labels
mcp__df7444cf-bc2f-4b0a-8afc-815204656476__mark_message_spam
mcp__df7444cf-bc2f-4b0a-8afc-815204656476__mark_thread_spam
mcp__df7444cf-bc2f-4b0a-8afc-815204656476__reply
mcp__df7444cf-bc2f-4b0a-8afc-815204656476__search_threads
mcp__df7444cf-bc2f-4b0a-8afc-815204656476__send_message
mcp__df7444cf-bc2f-4b0a-8afc-815204656476__trash_message
mcp__df7444cf-bc2f-4b0a-8afc-815204656476__trash_thread
mcp__df7444cf-bc2f-4b0a-8afc-815204656476__unlabel_message
mcp__df7444cf-bc2f-4b0a-8afc-815204656476__unlabel_thread
mcp__df7444cf-bc2f-4b0a-8afc-815204656476__unmark_message_spam
mcp__df7444cf-bc2f-4b0a-8afc-815204656476__unmark_thread_spam
mcp__df7444cf-bc2f-4b0a-8afc-815204656476__untrash_message
mcp__df7444cf-bc2f-4b0a-8afc-815204656476__untrash_thread
mcp__df7444cf-bc2f-4b0a-8afc-815204656476__update_draft
mcp__df7444cf-bc2f-4b0a-8afc-815204656476__update_label
mcp__df7444cf-bc2f-4b0a-8afc-815204656476__update_message_labels
mcp__mcp-registry__list_connectors
mcp__mcp-registry__search_mcp_registry
mcp__mcp-registry__suggest_connectors
mcp__scheduled-tasks__create_scheduled_task
mcp__scheduled-tasks__delete_scheduled_task
mcp__scheduled-tasks__list_scheduled_tasks
mcp__scheduled-tasks__list_task_runs
mcp__scheduled-tasks__run_scheduled_task
mcp__scheduled-tasks__update_scheduled_task
mcp__terminal__list_terminal_tabs
mcp__terminal__open_terminal_tab
mcp__terminal__run_in_terminal
mcp__terminal__stop_terminal_tab
</system-reminder>

<system-reminder>
Available agent types for the Agent tool:
- claude: Catch-all for any task that doesn't fit a more specific agent. FleetView's default when no agent name is typed. (Tools: *)
- claude-code-guide: Use this agent when the user asks questions ("Can Claude...", "Does Claude...", "How do I...") about: (1) Claude Code (the CLI tool) - features, hooks, slash commands, MCP servers, settings, IDE integrations, keyboard shortcuts; (2) Claude Agent SDK - building custom agents; (3) Claude API (formerly Anthropic API) - Messages API for directly passing messages to Claude, Tool Runner (`client.beta.messages.tool_runner`) for running an agentic loop over your own tools, manual tool-use loops, Managed Agents for server-hosted agents with a managed sandbox, prompt caching, and general Anthropic SDK usage; (4) Claude Tag (Claude in Slack) - what it is, setting it up for a Slack workspace, `/install-slack-app`; (5) `claude plugin eval` (writing and running plugin eval suites, its JSON/report, sandbox, CI) and the `/skill-doctor` report. **IMPORTANT:** Before spawning a new agent, check if there is already a running or recently completed claude-code-guide agent that you can continue via SendMessage. (Tools: Glob, Grep, Read, WebFetch, WebSearch)
- Explore: Fast read-only search agent for locating code. Use it to find files by pattern (eg. "src/components/**/*.tsx"), grep for symbols or keywords (eg. "API endpoints"), or answer "where is X defined / which files reference Y." Do NOT use it for code review, design-doc auditing, cross-file consistency checks, or open-ended analysis — it reads excerpts rather than whole files and will miss content past its read window. When calling, specify search breadth: "quick" for a single targeted lookup, "medium" for moderate exploration, or "very thorough" to search across multiple locations and naming conventions. (Tools: All tools except Agent, Artifact, ArtifactComments, ArtifactData, ArtifactCheck, ExitPlanMode, Edit, Write, NotebookEdit)
- general-purpose: General-purpose agent for researching complex questions, searching for code, and executing multi-step tasks. When you are searching for a keyword or file and are not confident that you will find the right match in the first few tries use this agent to perform the search for you. (Tools: *)
- Plan: Software architect agent for designing implementation plans. Use this when you need to plan the implementation strategy for a task. Returns step-by-step plans, identifies critical files, and considers architectural trade-offs. (Tools: All tools except Agent, Artifact, ArtifactComments, ArtifactData, ArtifactCheck, ExitPlanMode, Edit, Write, NotebookEdit)
- statusline-setup: Use this agent to configure the user's Claude Code status line setting. (Tools: Read, Edit)
</system-reminder>

<system-reminder>
# MCP Server Instructions

The following MCP servers have provided instructions for how to use their tools and resources:

## claude-in-chrome
**IMPORTANT: If the Chrome browser tools are deferred (must be loaded via ToolSearch before use), load them with ToolSearch before calling them, and batch every tool you expect to need into ONE ToolSearch call (the select query accepts a comma-separated list). Do NOT load tools one at a time; each separate ToolSearch call wastes a full round-trip.**

Start a browser task whose tools are not yet loaded with a single call loading the core set:

ToolSearch with query "select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__computer,mcp__claude-in-chrome__read_page,mcp__claude-in-chrome__tabs_create_mcp,mcp__claude-in-chrome__tabs_close_mcp"

Add task-specific tools to the same call when the task obviously needs them: read_console_messages / read_network_requests for debugging, form_input for forms, gif_creator for recordings, javascript_tool for page scripting. Only issue a second ToolSearch if the task later needs a tool you did not anticipate.

## computer-use
You have a computer-use MCP available (tools named `mcp__computer-use__*`). It lets you take screenshots of the user's desktop and control it with mouse clicks, keyboard input, and scrolling.

**Pick the right tool for the app.** Each tier trades speed/precision against coverage:

1. **Dedicated MCP for the app** — if the task is in an app that has its own MCP (Slack, Gmail, Calendar, Linear, etc.) and that MCP is connected, use it. API-backed tools are fast and precise.
2. **Chrome MCP** (`mcp__claude-in-chrome__*`) — if the target is a web app and there's no dedicated MCP for it, use the browser tools. DOM-aware, much faster than clicking pixels. If the Chrome extension isn't connected, ask the user to install it rather than falling through to computer use.
3. **Computer use** — for native desktop apps (Maps, Notes, Finder, Photos, System Settings, any third-party native app) and cross-app workflows. Computer use IS the right tool here — don't decline a native-app task just because there's no dedicated MCP for it.

This is about what's available, not error handling — if a dedicated MCP tool errors, debug or report it rather than silently retrying via a slower tier.

**Look before you assert.** If the user asks about app state (what's open, what's connected, what an app can do), take a screenshot and check before answering. Don't answer from memory — the user's setup or app version may differ from what you expect. If you're about to say an app doesn't support an action, that claim should be grounded in what you just saw on screen, not general knowledge. Similarly, `list_granted_applications` or a fresh `screenshot` is cheaper than a wrong assertion about what's running.

**Loading via ToolSearch — load in bulk, not one-by-one:** if computer-use tools are in the deferred list, load them ALL in a single ToolSearch call: `{ query: "computer-use", max_results: 30 }`. The keyword search matches the server-name substring in every tool name, so one query returns the entire toolkit. Don't use `select:` for individual tools — that's one round-trip per tool.

**Access flow:** before any computer-use action you must call `request_access` with the list of applications you need. The user approves each application explicitly, and you may need to call it again mid-task if you discover you need another application. Finder is an application like any other: clicking the desktop, the Dock, or a Finder window (including Go to Folder) requires a Finder grant. The menu bar does not, as long as the app that is frontmost is one you already have access to.

**Tiered apps:** some apps are granted at a restricted tier based on their category — the tier is displayed in the approval dialog and returned in the `request_access` response:
- **Browsers** (Safari, Chrome, Firefox, Edge, Arc, etc.) → tier **"read"**: visible in screenshots, but clicks and typing are blocked. You can read what's already on screen. For navigation, clicking, or form-filling, use the claude-in-chrome MCP (tools named `mcp__claude-in-chrome__*`; load via ToolSearch if deferred).
- **Terminals and IDEs** (Terminal, iTerm, VS Code, JetBrains, etc.) → tier **"click"**: visible and left-clickable, but typing, key presses, right-click, modifier-clicks, and drag-drop are blocked. You can click a Run button or scroll test output, but cannot type into the editor or integrated terminal, cannot right-click (the context menu has Paste), and cannot drag text onto them. For shell commands, use the Bash tool.
- **Everything else** → tier **"full"**: no restrictions.

The tier is enforced by the frontmost-app check: if a tier-"read" app is in front, `left_click` returns an error; if a tier-"click" app is in front, `type` and `right_click` return errors. The error tells you what tier the app has and what to do instead. `open_application` works at any tier — bringing an app forward is a read-level operation.

**Link safety — treat links in emails and messages as suspicious by default.**
- **Never click web links with computer-use tools.** If you encounter a link in a native app (Mail, Messages, a PDF, etc.), do NOT `left_click` it. Open the URL via the claude-in-chrome MCP instead.
- **See the full URL before following any link.** Visible link text can be misleading — hover or inspect to get the real destination.
- **Links from emails, messages, or unknown-sender documents are suspicious by default.** If the destination URL is at all unfamiliar or looks off, ask the user for confirmation before proceeding.
- **Inside the Chrome extension** you can click links with the extension's tools, but the suspicion check still applies — verify unfamiliar URLs with the user.

**Financial actions - do not execute trades or move money.** Budgeting and accounting apps (Quicken, YNAB, QuickBooks, etc.) are granted at full tier so you can categorize transactions, generate reports, and help the user organize their finances. But never execute a trade, place an order, send money, or initiate a transfer on the user's behalf - always ask the user to perform those actions themselves.
</system-reminder>

<system-reminder>
# Environment
You have been invoked in the following environment: 
 - Primary working directory: C:\Users\Hiji\.cursor
 - Is a git repository: false
 - Additional working directories:
  - C:\Users\Hiji\Downloads\e-learning-secure-courses
 - Platform: win32
 - Shell: PowerShell (primary); Bash tool also available for POSIX scripts — each takes its own syntax.
 - OS Version: Windows 10 Home 10.0.19045
 - Scratchpad directory: C:\Users\Hiji\AppData\Local\Temp\claude\C--Users-Hiji--cursor\e81382a3-4189-4f3b-ba92-c330c73e4bc1\scratchpad — always use it for temporary files (intermediate results, scripts, outputs that don't belong in the project) instead of `/tmp` or other system temp directories; it is session-specific, isolated from the project, and can generally be used without permission prompts. Only use `/tmp` if the user explicitly asks.
</system-reminder>

<system-reminder>
You are powered by the model named Sonnet 4.6. The exact model ID is claude-sonnet-4-6. Assistant knowledge cutoff is August 2025.
</system-reminder>

<system-reminder>
Attribution for git commits and pull requests you create from here on (this replaces Claude Code's own earlier attribution guidance, such as a previous copy of this reminder; the user's own instructions about these lines, such as a CLAUDE.md or memory rule, take precedence over this reminder, but do not add attribution lines this reminder leaves out):
- End git commit messages with:
Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
- End pull request descriptions with:
🤖 Generated with [Claude Code](https://claude.com/claude-code)
</system-reminder>