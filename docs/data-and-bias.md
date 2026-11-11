# Planned data selection and bias review
NABRA’s current prototype uses simulated scores, illustrative waveforms, and browser-generated Arabic speech. No clinical dataset was used to train or evaluate a diagnostic model. Diagnostic accuracy and subgroup performance have not been measured.

- **[Roy et al. (2024)](https://doi.org/10.1044/2024_JSLHR-24-00104):** Scientific reference for comparing voice across reading tasks in adductor laryngeal dystonia (AdLD) and primary muscle tension dysphonia (pMTD). The study recordings are not available for reuse.
- **[Arabic Voice Pathology Database (AVPD)](https://pmc.ncbi.nlm.nih.gov/articles/PMC5672151/):** Reviewed as a candidate Arabic voice dataset. Its published diagnostic categories do not include the two conditions targeted by NABRA, so it was not selected for classification.
- **[MediaSpeech Arabic](https://www.openslr.org/108/):** A candidate for future technical tests of audio loading, playback, and segment selection. It was not used in the current prototype and does not provide the required diagnostic labels.

Future clinical evaluation requires recordings with specialist-confirmed labels for both conditions and comparable reading tasks from the same speakers. We plan to check representation across age, gender, dialect, and recording conditions where metadata are available, and to keep each speaker’s recordings in a single evaluation split.


No clinical dataset was used for the scripted demo. No diagnostic accuracy or fairness results have been established.

For each candidate dataset, document:

| Item | Evidence to record |
| --- | --- |
| Source and access | Original study or repository, access restrictions and permitted use. |
| Labels | Target conditions, reference diagnosis and who assigned the labels. |
| Tasks | Language, dialect and whether each speaker completed comparable reading tasks. |
| Representation | Speaker counts by condition, age group, gender, dialect and recording setting where documented. |
| Evaluation | Speaker identifiers to keep each speaker's recordings in one split, and sufficient group sizes before comparing performance. |

Report missing metadata as unknown. If a dataset lacks the target labels or comparable tasks, document that limitation and restrict its use to the part of the pipeline it can test. Keep generated sample-case speech out of clinical training and evaluation.

