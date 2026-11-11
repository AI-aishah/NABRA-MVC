# Planned data selection and bias review

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
