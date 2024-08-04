from funasr import AutoModel
from funasr.utils.postprocess_utils import rich_transcription_postprocess

model_dir = "asr/SenseVoiceSmall"

model = AutoModel(model=model_dir, trust_remote_code=True, device="cuda:0")
 
def get_asr_text(audioUrl):

    # en
    res = model.generate(
        input=audioUrl,
        cache={},
        language="auto",  # "zn", "en", "yue", "ja", "ko", "nospeech"
        use_itn=True,
        batch_size_s=60,
        merge_vad=True,  #
        merge_length_s=15,
    )
    text = rich_transcription_postprocess(res[0]["text"])
    print(text)
    return text