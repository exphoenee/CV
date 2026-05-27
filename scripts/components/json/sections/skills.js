import { pushBool } from '../helpers.js';

export function renderSkills(data, push) {
  push(1, '<span class="k">"skills"</span><span class="p">: {</span>');

  push(2, '<span class="k">"primary"</span><span class="p">: [</span><span class="s">"TypeScript"</span><span class="p">, </span><span class="s">"JavaScript"</span><span class="p">, </span><span class="s">"Svelte"</span><span class="p">, </span><span class="s">"React"</span><span class="p">, </span><span class="s">"Node.js"</span><span class="p">, </span><span class="s">"SCSS"</span><span class="p">, </span><span class="s">"HTML"</span><span class="p">, </span><span class="s">"CSS"</span><span class="p">],</span>');
  push(2, '<span class="k">"backend"</span><span class="p">: [</span><span class="s">"Express.js"</span><span class="p">, </span><span class="s">"NestJS"</span><span class="p">, </span><span class="s">"Python"</span><span class="p">, </span><span class="s">"PHP"</span><span class="p">, </span><span class="s">"MySQL"</span><span class="p">, </span><span class="s">"MongoDB"</span><span class="p">],</span>');
  push(2, '<span class="k">"testing"</span><span class="p">: [</span><span class="s">"Jest"</span><span class="p">, </span><span class="s">"Vitest"</span><span class="p">, </span><span class="s">"Playwright"</span><span class="p">],</span>  <span class="c">// yes, all three</span>');
  push(2, '<span class="k">"tooling"</span><span class="p">: [</span><span class="s">"Vite"</span><span class="p">, </span><span class="s">"Webpack"</span><span class="p">, </span><span class="s">"PNPM"</span><span class="p">, </span><span class="s">"Next.js"</span><span class="p">],</span>');
  push(2, '<span class="k">"ai"</span><span class="p">: [</span><span class="s">"Claude"</span><span class="p">, </span><span class="s">"Codex"</span><span class="p">],</span>  <span class="c">// meta: this CV was probably reviewed by one of these</span>');
  push(2, '<span class="k">"robotics"</span><span class="p">: [</span><span class="s">"Universal Robot"</span><span class="p">, </span><span class="s">"OnRobot"</span><span class="p">, </span><span class="s">"Machine Vision"</span><span class="p">, </span><span class="s">"PLC"</span><span class="p">],</span>  <span class="c">// surprise!</span>');
  push(2, '<span class="k">"willRefactorYourEntireCodebaseIf"</span><span class="p">: </span><span class="s">"evidence justifies it"</span>  <span class="c">// (often)</span>');

  push(1, '<span class="p">},</span>');
  push(0, '');
}
