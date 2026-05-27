import { pushBool } from '../helpers.js';

export function renderCommunity(data, push) {
  push(1, '<span class="k">"community"</span><span class="p">: {</span>');
  push(2, '<span class="k">"role"</span><span class="p">: </span><span class="s">"Pro bono after-school programming club mentor"</span><span class="p">,</span>');
  push(2, '<span class="k">"school"</span><span class="p">: </span><span class="s">"M\u00e1ty\u00e1s Kir\u00e1ly Street Primary School, P\u00e9cs"</span><span class="p">,</span>');
  push(2, '<span class="k">"since"</span><span class="p">: </span><span class="s">"2026-02"</span><span class="p">,</span>');
  push(2, '<span class="k">"curriculumDesignedBy"</span><span class="p">: </span><span class="s">"Viktor (personally)"</span><span class="p">,</span>');
  pushBool(push, 2, 'paidFor', false, true, 'legend');
  push(2, '<span class="k">"competitionResults"</span><span class="p">: [</span>');
  push(3, '<span class="p">{ </span><span class="k">"place"</span><span class="p">: </span><span class="n">1</span><span class="p">, </span><span class="k">"competition"</span><span class="p">: </span><span class="s">"Hack and Code 2026 (Radn\u00f3ti SZKI)"</span><span class="p"> },</span>');
  push(3, '<span class="p">{ </span><span class="k">"place"</span><span class="p">: </span><span class="n">1</span><span class="p">, </span><span class="k">"competition"</span><span class="p">: </span><span class="s">"22nd Neumann J\u00e1nos Programming Competition"</span><span class="p"> },</span>');
  push(3, '<span class="p">{ </span><span class="k">"place"</span><span class="p">: </span><span class="n">3</span><span class="p">, </span><span class="k">"competition"</span><span class="p">: </span><span class="s">"22nd Neumann J\u00e1nos Programming Competition"</span><span class="p"> }</span>');
  push(2, '<span class="p">]</span>');
  push(1, '<span class="p">},</span>');
  push(0, '');
}
