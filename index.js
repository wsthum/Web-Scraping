var Nightmare = require('nightmare');		
var nightmare = Nightmare({ show: true });
var fs = require('fs');
var md5 = require('md5')
var request = require('request')

let desc = 
{
	product_name: "",
	brand : "",
	source_url: "",
	mfg_color: "",
	identifier: "",
	meta: "",
	videos: "",
	images: "",
	specific_category: ""
}

let url = 'https://www.urbanoutfitters.com/shop/champion-reverse-weave-hoodie-sweatshirt'
desc.source_url = url
nightmare.goto(url)
	.evaluate(function () {
		let name = document.querySelector('.c-product-meta__h1.u-small--show span').innerHTML
		let color = document.querySelector('.c-product-colors__legend.c-form__label span').innerHTML
		let brand = document.querySelector('.c-global-header-wrap.js-global-header-wrap.dom-header img').alt
		let meta = document.querySelector('.u-global-p p + p').innerHTML
		let images = document.querySelectorAll('.c-product-image.has-zoom.js-zoom-product-image')
		let b = []
		let c = []

		images.forEach(function(i)
		{
			b.push(i.src)
		})
			
		b.forEach(function(element)
		{
			var j = 0
			len = element.length

			while(j < len)
			{
				if(element[j] == '?')
				{
					break;
				}

				j++
			}

			let trim = element.substr(0, j + 1)

			c.push(trim)
		})
		
		len = c.length

		for(var i = 0; i < len; i++)
		{
			for(var j = i+1; j < len; j++)
			{
				if(c[i] == c[j])
				{
					c.splice(j, 1)
					j--
					len--
				}
			}
		}

		color = color.trim()
		replacedname = name.trim()
		return [replacedname, brand, color, meta, c]
	})
	.end()
	.then(function(result) 
	{
		desc.product_name = result[0]
		desc.brand = result[1]
		desc.mfg_color = result[2]
		desc.identifier = md5(result[0] + result[1] + result[2])
		desc.meta = result[3]
		desc.images = result[4]
		let options = 
		{  
    		url: 'http://data-operations-middleware-ELB-160398862.us-east-1.elb.amazonaws.com/api/v2/product/classify',
    		form: desc
    	}

		request.post(options, callback); 
		fs.writeFileSync('/home/wsthum/Desktop/Markable_Projects_Home/Task_1/test.json', JSON.stringify(desc));
	})

	