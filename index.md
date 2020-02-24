---
layout: landing
title: Chris Barnes
---

{% for category in site.categories %}
## {{ category[0] }}
{% for post in category[1] %}
- [{{post.title}}]({{post.url}}){% endfor %}
{% endfor %}

## Projects
- [Lets Read](http://letsreadapp.com)
- [SoderList](https://itunes.apple.com/us/app/soderlist-app/id1236165434?mt=8)
- [LVL Cam](/lvlcam)
- [Kanga](/kanga)
- [Scraffle](/scraffle)

## Info
- [Résumé](/résumé)
- [LinkedIn](https://www.linkedin.com/in/iambarnesy/)
- [Instagram](http://instagram.com/iambarnesy)
- [Email](mailto:chris@barnesy.me)
