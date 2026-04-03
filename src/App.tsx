import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Upload, Image as ImageIcon, X, Loader2, Sparkles, Calendar, User, Heart, Users, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const systemInstruction = `
🇰🇷🌍 [글로벌 K-역학 초정밀 엔진] 사주·관상·성명학 1:1 맞춤형 마스터 프롬프트
[역할 및 절대 원칙]
당신은 한국의 정통 명리학(『연해자평』, 『적천수』, 『궁통보감』), 상학(『마의상법』, 『유장상법』) 및 한국식 성명학의 최고 권위자이자 글로벌 AI 운명 분석가입니다.
[절대 금지 사항 및 차별화 강제]: 누구에게나 들어맞는 모호하고 포괄적인 문장(바넘 효과)을 절대 금지합니다. 입력된 사용자의 국적/출생지를 바탕으로 진태양시(True Solar Time)와 남/북반구의 절기 차이를 엄밀히 계산하여 사주 8글자를 도출하십시오. 모든 분석은 도출된 고유의 명식과 관상의 미세한 픽셀 차이에만 기반해야 하며, 반드시 근거가 되는 고서(책)나 명리학적/상학적 논리를 명시하여 지구상에 단 하나뿐인 1:1 맞춤형 분석을 제공하십시오. 길(吉)과 흉(凶)의 비율은 5:5로 엄격히 유지합니다.

[작동 로직 및 출력 구조]
반드시 다음 구분선(---TAB---)을 사용하여 섹션을 나누어 출력하세요. 출력의 가장 첫 시작도 ---TAB--- 으로 시작해야 합니다. 각 섹션의 첫 줄은 '### 1. 탭 이름' 형식으로 작성하여 탭 제목으로 사용될 수 있게 하세요.

**1인 입력 시 (개인 분석 모드) - 6개 탭으로 구성:**
---TAB---
### 0. 🧬 [K-역학 데이터 변환 및 증명]
* **글로벌 사주 명식**: 출생지(국가/도시)의 위도경도와 시차를 반영한 정확한 **사주팔자(천간지지 8글자)**와 대운수를 명시합니다. (남반구 출생일 경우 조후(계절)의 역전 현상을 적용했는지 명시).
* **K-관상학적 특징**: 3면 사진에서 추출한 본인만의 미세한 비대칭, 뼈대의 굴곡, 특정 부위의 점 등 상학적 특징 3가지를 아주 구체적으로 묘사합니다.
* **글로벌 성명학 변환**: 외국어 이름일 경우 한국어 발음으로 변환한 뒤의 초성/종성 발음오행을 도출합니다. (예: John -> ㅈ(금), ㄴ(화)).

---TAB---
### 1. 🖼️ [K-관상 정밀 분석] 마의상법 기반 1:1 형상 풀이
* **음양오행과 삼정오관**: 0단계에서 추출한 3가지 특징을 『마의상법』의 논리에 대입하여 얼굴의 격국을 판정합니다. (예: "서양인의 깊은 안와상융기(눈썹 뼈)를 상학에서는 ~하게 보며...")
* **복덕과 흉조**: 이목구비에 깃든 고유한 재물운과 치명적인 흉조(액운의 징조)를 짚어내고, 이를 보완할 실질적 조언을 제시합니다.

---TAB---
### 2. 📅 [K-명리 정밀 분석] 적천수/궁통보감 기반 1:1 사주 풀이
* **격국용신(格局用神)**: 본인 사주의 강약과 억부/조후를 분석하여, 인생의 막힌 기운을 뚫어줄 정확한 **용신(用神, 가장 필요한 오행)**을 규명합니다.
* **살(煞)과 대운의 파괴력**: 백호살, 원진살, 귀문관살 등 한국 명리학 고유의 살이 본인에게 미치는 특수한 작용을 설명하고, 평생 대운의 굴곡을 논리적으로 분석합니다.

---TAB---
### 3. 🔠 [K-성명학 분석] 이름의 오행과 사주의 융합
* **발음오행과 사주의 조화**: 이름의 발음이 만들어내는 오행(파동)이 사주의 약점을 보완(상생)하는지, 흉을 가중(상극)시키는지 한국 성명학을 바탕으로 분석합니다.

---TAB---
### 4. 📊 [통합 해석] 10대 인생 지표 상세 풀이
관상+사주+이름 데이터를 교차 검증하여, 각 항목마다 "사주의 ~기운과 관상의 ~특징이 결합하여..."라는 식의 논리적 근거를 반드시 포함해 상세히 풀이하십시오.
1. **재물운**: 부의 그릇 크기와 편재/정재의 흐름, 돈이 새어나가는 구체적 패턴.
2. **연애운**: 본인 고유의 도화(桃花) 작용과 반복되는 연애의 맹점.
3. **결혼운**: 인연이 닿는 시기, 배우자의 십성(十星) 성향, 파혼/이혼수를 피하는 지혜.
4. **살(煞)과 복(福)**: 천을귀인 등의 복과 흉살이 충돌했을 때 일어나는 현실적 시뮬레이션.
5. **조심해야 할 것**: 평생 가장 치명적으로 작용할 단 하나의 약점(배신, 소송, 특정 사고 등).
6. **수명 및 건강운**: 오행의 편중으로 인해 선천적으로 취약한 장기와 건강의 고비.
7. **성공운**: 본인의 격국에 가장 잘 맞는 직업적 방향성(Global Career)과 발복의 시기.
8. **승진 및 관운**: 관살(官殺)의 작용에 따른 권력의 쟁취 여부와 실각 위험성.
9. **악재 대응 및 업화(業火)**: 기운이 바닥칠 때 겪게 될 양상과 이를 역학적으로 버텨내는 처세술.
10. **성격 및 기질**: 서양의 심리학과 대비되는, 겉(관상)과 속(사주)이 빚어내는 모순점과 내면의 힘.

---TAB---
### 5. 🎯 [집중 분석] 2026년(병오년) 신수 및 방향성
* **올해의 세운(歲運) 상호작용**: 2026년 병오(丙午)년의 강렬한 화(火) 기운이 본인의 사주 원국과 만나 일으키는 합(合), 충(沖), 형(刑)의 결과를 엄밀히 계산하여 예측합니다.
* **올해의 행운과 기회**: 어떤 시기(월)에 긍정적 운이 열리는지 구체적으로 짚어줍니다.
* **올해의 악재와 조심할 살**: 올해 집중적으로 두들겨 맞는 흉운과 방어 지침을 경고합니다.
* **월별 흐름 및 최종 조언**: 길한 달과 흉한 달을 특정하고, 한국 명리학의 지혜가 담긴 1년의 방향성을 제시합니다.


**2인 입력 시 (궁합 분석 모드) - 7개 탭으로 구성:**
---TAB---
### 0. 🧬 K-역학 데이터 변환 및 증명 (공통)
* 대상 A와 B 각각의 글로벌 사주 명식, K-관상학적 특징, 글로벌 성명학 변환 데이터 도출.

---TAB---
### 1. 🖼️ K-관상 정밀 분석 (개별)
* 대상 A와 B 각각의 음양오행/삼정오관 및 복덕/흉조 분석.

---TAB---
### 2. 📅 K-명리 정밀 분석 (개별)
* 대상 A와 B 각각의 격국용신 및 살/대운 분석.

---TAB---
### 3. 🔠 K-성명학 분석 (개별)
* 대상 A와 B 각각의 발음오행과 사주의 조화 분석.

---TAB---
### 4. 📊 10대 인생 지표 상세 풀이 (공통)
* 두 사람의 시너지를 바탕으로 10가지 지표를 상세히 풀이 (교차 검증 필수).

---TAB---
### 5. 🎯 2026년(병오년) 신수 및 방향성 (공통)
* 두 사람 각각의 올해 세운 상호작용, 행운/기회, 악재/살, 월별 흐름.

---TAB---
### 6. 💑 [선택 실행] K-궁합
* **초정밀 합/충 대조**: 두 사람의 명식과 관상의 상생/상극을 대조 분석. 서양인 커플이더라도 동양의 '궁합' 논리를 적용하여 파국 요소와 시너지를 명시하고 관계 조언을 제공합니다.

[⚠️ 최종 출력 원칙]
언어 출력 설정: 만약 입력된 이름이 영어이거나 외국인으로 판단될 경우, 답변을 자연스러운 영어로 출력할 것.
누락 금지: 위 단계들(특히 4단계의 10가지 지표)은 어떠한 경우에도 생략하거나 하나로 뭉뚱그리지 말고 개별 번호를 매겨 상세히 출력하십시오.
균형감 유지: 맹목적인 비판이나 희망 고문을 금지하고, 명리학적/상학적 근거를 바탕으로 문제 제기와 해결책(방향성)을 동시에 제시하십시오.
`;

type PersonData = {
  name: string;
  hanjaName: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  calendarType: 'solar' | 'lunar';
  gender: 'male' | 'female';
};

type PersonImages = {
  front: string | null;
  left: string | null;
  right: string | null;
};

interface PersonFormProps {
  title: string;
  icon: React.ElementType;
  person: PersonData;
  setPerson: React.Dispatch<React.SetStateAction<PersonData>>;
  images: PersonImages;
  setImages: React.Dispatch<React.SetStateAction<PersonImages>>;
}

const ImageUploader = ({ angle, label, image, onUpload, onRemove }: { angle: string, label: string, image: string | null, onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void, onRemove: () => void }) => (
  <div className="relative">
    <label className="block text-xs text-stone-500 mb-1 text-center font-medium">{label}</label>
    {image ? (
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden group border-2 border-indigo-200">
        <img src={image} alt={label} className="w-full h-full object-cover" />
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    ) : (
      <label className="flex flex-col items-center justify-center aspect-[3/4] rounded-xl border-2 border-dashed border-stone-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors cursor-pointer bg-stone-50">
        <Upload className="w-5 h-5 text-stone-400 mb-1" />
        <span className="text-[10px] text-stone-500 font-medium">업로드</span>
        <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
      </label>
    )}
  </div>
);

const PersonForm = ({ title, icon: Icon, person, setPerson, images, setImages }: PersonFormProps) => {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, angle: keyof PersonImages) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => ({ ...prev, [angle]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (angle: keyof PersonImages) => {
    setImages(prev => ({ ...prev, [angle]: null }));
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-6 md:p-8">
      <h2 className="text-xl font-semibold text-stone-800 mb-6 flex items-center gap-2 border-b border-stone-100 pb-4">
        <Icon className="w-6 h-6 text-indigo-600" />
        {title}
      </h2>
      
      <div className="space-y-6">
        {/* Name Input */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider flex items-center gap-1">
            <User className="w-4 h-4" /> 기본 정보
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs text-stone-500 mb-1.5">이름 (한글/영문)</label>
              <input
                type="text"
                value={person.name}
                onChange={(e) => setPerson({ ...person, name: e.target.value })}
                placeholder="홍길동 / John Doe"
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs text-stone-500 mb-1.5">이름 (한자) - 선택</label>
              <input
                type="text"
                value={person.hanjaName}
                onChange={(e) => setPerson({ ...person, hanjaName: e.target.value })}
                placeholder="洪吉童"
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
              />
            </div>
          </div>
        </div>

        {/* Saju Inputs */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider flex items-center gap-1">
            <Calendar className="w-4 h-4" /> 사주 정보
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs text-stone-500 mb-1.5">생년월일</label>
              <input
                type="date"
                value={person.birthDate}
                onChange={(e) => setPerson({ ...person, birthDate: e.target.value })}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs text-stone-500 mb-1.5">태어난 시간 (선택)</label>
              <input
                type="time"
                value={person.birthTime}
                onChange={(e) => setPerson({ ...person, birthTime: e.target.value })}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-stone-500 mb-1.5">태어난 국가 및 도시 (예: 서울, New York, USA)</label>
              <input
                type="text"
                value={person.birthPlace}
                onChange={(e) => setPerson({ ...person, birthPlace: e.target.value })}
                placeholder="정확한 점성술 차트 도출을 위해 필수"
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs text-stone-500 mb-1.5">양력/음력</label>
              <select
                value={person.calendarType}
                onChange={(e) => setPerson({ ...person, calendarType: e.target.value as 'solar' | 'lunar' })}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
              >
                <option value="solar">양력</option>
                <option value="lunar">음력</option>
              </select>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs text-stone-500 mb-1.5">성별</label>
              <select
                value={person.gender}
                onChange={(e) => setPerson({ ...person, gender: e.target.value as 'male' | 'female' })}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
              >
                <option value="male">남성</option>
                <option value="female">여성</option>
              </select>
            </div>
          </div>
        </div>

        {/* Photo Inputs */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider flex items-center gap-1">
            <ImageIcon className="w-4 h-4" /> 관상 사진 (3면)
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <ImageUploader
              angle="front"
              label="정면"
              image={images.front}
              onUpload={(e) => handleImageUpload(e, 'front')}
              onRemove={() => removeImage('front')}
            />
            <ImageUploader
              angle="left"
              label="좌측면"
              image={images.left}
              onUpload={(e) => handleImageUpload(e, 'left')}
              onRemove={() => removeImage('left')}
            />
            <ImageUploader
              angle="right"
              label="우측면"
              image={images.right}
              onUpload={(e) => handleImageUpload(e, 'right')}
              onRemove={() => removeImage('right')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [mode, setMode] = useState<'single' | 'couple'>('single');
  
  const [personA, setPersonA] = useState<PersonData>({ name: '', hanjaName: '', birthDate: '', birthTime: '', birthPlace: '', calendarType: 'solar', gender: 'male' });
  const [imagesA, setImagesA] = useState<PersonImages>({ front: null, left: null, right: null });
  
  const [personB, setPersonB] = useState<PersonData>({ name: '', hanjaName: '', birthDate: '', birthTime: '', birthPlace: '', calendarType: 'solar', gender: 'female' });
  const [imagesB, setImagesB] = useState<PersonImages>({ front: null, left: null, right: null });

  const [customQuestion, setCustomQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  const resultRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const hasImagesA = imagesA.front || imagesA.left || imagesA.right;
    if (!personA.birthDate && !hasImagesA) {
      setError(
        mode === 'couple'
          ? '정확한 궁합 분석을 위해 본인(대상 A)의 생년월일 또는 관상 사진 중 하나 이상을 꼭 입력해 주세요. 📝'
          : '정밀한 사주·관상 분석을 위해 본인의 생년월일 또는 관상 사진 중 하나 이상을 꼭 입력해 주세요. 📝'
      );
      return;
    }

    if (mode === 'couple') {
      const hasImagesB = imagesB.front || imagesB.left || imagesB.right;
      if (!personB.birthDate && !hasImagesB) {
        setError('정확한 궁합 분석을 위해 상대방(대상 B)의 생년월일 또는 관상 사진 중 하나 이상을 꼭 입력해 주세요. 📝');
        return;
      }
    }

    setLoading(true);
    setError('');
    setResult('');
    setActiveTab(0);

    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY });
      const parts: any[] = [];
      const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });

      let promptText = `[분석 요청 정보]\n오늘 날짜: ${today}\n분석 모드: ${mode === 'single' ? '개인 분석 모드' : '궁합 분석 모드'}\n\n`;

      // Person A Data
      promptText += `[대상 A (본인)]\n이름(한글/영문): ${personA.name || '미입력'}\n이름(한자): ${personA.hanjaName || '미입력'}\n정보: ${personA.birthDate || '생일모름'} ${personA.birthTime || '시간모름'} (${personA.calendarType === 'solar' ? '양력' : '음력'}), ${personA.gender === 'male' ? '남성' : '여성'}\n출생지: ${personA.birthPlace || '미입력'}\n`;
      parts.push({ text: promptText });
      
      if (imagesA.front) parts.push({ text: "대상 A 정면 사진:" }, { inlineData: { data: imagesA.front.split(',')[1], mimeType: 'image/jpeg' } });
      if (imagesA.left) parts.push({ text: "대상 A 좌측면 사진:" }, { inlineData: { data: imagesA.left.split(',')[1], mimeType: 'image/jpeg' } });
      if (imagesA.right) parts.push({ text: "대상 A 우측면 사진:" }, { inlineData: { data: imagesA.right.split(',')[1], mimeType: 'image/jpeg' } });

      // Person B Data
      if (mode === 'couple') {
        parts.push({ text: `\n[대상 B (상대방)]\n이름(한글/영문): ${personB.name || '미입력'}\n이름(한자): ${personB.hanjaName || '미입력'}\n정보: ${personB.birthDate || '생일모름'} ${personB.birthTime || '시간모름'} (${personB.calendarType === 'solar' ? '양력' : '음력'}), ${personB.gender === 'male' ? '남성' : '여성'}\n출생지: ${personB.birthPlace || '미입력'}\n` });
        if (imagesB.front) parts.push({ text: "대상 B 정면 사진:" }, { inlineData: { data: imagesB.front.split(',')[1], mimeType: 'image/jpeg' } });
        if (imagesB.left) parts.push({ text: "대상 B 좌측면 사진:" }, { inlineData: { data: imagesB.left.split(',')[1], mimeType: 'image/jpeg' } });
        if (imagesB.right) parts.push({ text: "대상 B 우측면 사진:" }, { inlineData: { data: imagesB.right.split(',')[1], mimeType: 'image/jpeg' } });
      }

      // Custom Question
      if (customQuestion) {
        parts.push({ text: `\n[요청사항]\n${customQuestion}` });
      } else {
        parts.push({ text: `\n[요청사항]\n위 정보를 바탕으로 심층 분석을 진행해주세요.` });
      }

      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-3.1-pro-preview',
        contents: { parts },
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      let fullText = '';
      for await (const chunk of responseStream) {
        if (chunk.text) {
          fullText += chunk.text;
          setResult(fullText);
        }
      }

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (err: any) {
      console.error(err);
      setError(err.message || '분석 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  // Parse tabs from result
  const rawTabs = result.split('---TAB---').filter(t => t.trim() !== '');
  const parsedTabs = rawTabs.map(tabContent => {
    const lines = tabContent.trim().split('\n');
    const firstLine = lines[0];
    let title = '분석 결과';
    if (firstLine.startsWith('### ')) {
      title = firstLine.replace(/^###\s*\d*\.?\s*/, '').trim();
      // Remove the title line from content to avoid duplication if desired, 
      // but keeping it is fine for markdown rendering.
    }
    return { title, content: tabContent };
  });

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans text-stone-800 selection:bg-indigo-200">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600 fill-indigo-100" />
            <h1 className="text-xl font-bold text-stone-800 tracking-tight">통합 명리 마스터</h1>
          </div>
          <div className="text-sm font-medium text-stone-500 hidden sm:block">사주·관상 및 인연학 솔루션</div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4 tracking-tight">당신의 운명과 인연을 읽다</h2>
          <p className="text-stone-500 max-w-2xl mx-auto text-lg mb-8">
            사주명리학과 입체 관상학을 융합하여 인생 전반의 로드맵과 실질적인 솔루션을 제시합니다.
          </p>
          
          {/* Mode Toggle */}
          <div className="inline-flex bg-stone-200/50 p-1.5 rounded-2xl">
            <button
              onClick={() => setMode('single')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                mode === 'single' ? 'bg-white text-indigo-700 shadow-sm' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              <User className="w-4 h-4" /> 개인 운세
            </button>
            <button
              onClick={() => setMode('couple')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                mode === 'couple' ? 'bg-white text-pink-600 shadow-sm' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              <Users className="w-4 h-4" /> 궁합 분석
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className={`grid gap-8 ${mode === 'couple' ? 'md:grid-cols-2' : 'max-w-2xl mx-auto'}`}>
            <PersonForm
              title={mode === 'couple' ? "나의 정보 (대상 A)" : "나의 정보"}
              icon={User}
              person={personA}
              setPerson={setPersonA}
              images={imagesA}
              setImages={setImagesA}
            />
            
            {mode === 'couple' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <PersonForm
                  title="상대방 정보 (대상 B)"
                  icon={Heart}
                  person={personB}
                  setPerson={setPersonB}
                  images={imagesB}
                  setImages={setImagesB}
                />
              </motion.div>
            )}
          </div>

          <div className={`bg-white rounded-3xl shadow-sm border border-stone-100 p-6 md:p-8 ${mode === 'single' ? 'max-w-2xl mx-auto' : ''}`}>
            <h3 className="text-sm font-medium text-stone-600 mb-3 flex items-center gap-2">
              특별히 조언이 필요한 부분 (선택)
            </h3>
            <textarea
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              placeholder={mode === 'couple' ? "예: 우리 둘이 같이 사업을 해도 될까요? / 내년에 결혼하기 좋은 시기일까요?" : "예: 내일 중요한 면접이 있는데 어떤 넥타이 색상이 좋을까요? / 올해 이직운이 궁금합니다."}
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm min-h-[100px] resize-y"
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-indigo-900 hover:bg-indigo-950 text-white rounded-full font-semibold text-lg transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-indigo-900/20 hover:shadow-xl hover:shadow-indigo-900/30 hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  운명의 흐름을 읽는 중...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-indigo-200" />
                  {mode === 'couple' ? '궁합 분석 시작하기' : '운세 분석 시작하기'}
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-8 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center justify-center gap-2 text-sm">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Results Section */}
        {parsedTabs.length > 0 && (
          <div ref={resultRef} className="mt-12">
            <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
              {/* Tabs Header */}
              <div className="flex border-b border-stone-200 overflow-x-auto hide-scrollbar bg-stone-50/50">
                {parsedTabs.map((tab, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTab(index)}
                    className={`flex-1 min-w-[160px] py-4 px-6 text-sm font-semibold transition-colors relative flex items-center justify-center gap-2 ${
                      activeTab === index ? 'text-indigo-700 bg-white' : 'text-stone-500 hover:text-stone-700'
                    }`}
                  >
                    {tab.title}
                    {activeTab === index && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6 md:p-10 bg-white">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="prose prose-stone max-w-none prose-headings:font-semibold prose-h3:text-xl prose-h3:text-indigo-800 prose-p:leading-relaxed prose-li:marker:text-indigo-500 prose-strong:text-stone-900"
                  >
                    {parsedTabs[activeTab] && (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {parsedTabs[activeTab].content}
                      </ReactMarkdown>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
